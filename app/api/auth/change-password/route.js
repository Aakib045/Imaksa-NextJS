import { connectDB } from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { verifyAuth } from '@/lib/auth';

export async function PUT(request) {
  const auth = await verifyAuth(request);
  if (!auth.valid) {
    return Response.json({ success: false, error: auth.error }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword } = await request.json();
    await connectDB();
    const admin = await Admin.findById(auth.admin.id);
    if (!admin) {
      return Response.json({ success: false, error: 'Admin not found' }, { status: 404 });
    }

    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return Response.json({ success: false, error: 'Current password is incorrect' }, { status: 401 });
    }

    admin.password = newPassword;
    await admin.save();

    return Response.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    return Response.json({ success: false, error: 'Failed to change password' }, { status: 500 });
  }
}
