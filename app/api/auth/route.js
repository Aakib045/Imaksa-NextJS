import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/mongodb';
import Admin from '@/models/Admin';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    await connectDB();

    // Seed first admin if none exists
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      await Admin.create({
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD,
      });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return Response.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return Response.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    admin.lastLogin = new Date();
    await admin.save();

    return Response.json({
      success: true,
      token,
      admin: { username: admin.username, name: admin.name },
    });
  } catch (error) {
    return Response.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
