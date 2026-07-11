import { connectDB } from '@/lib/mongodb';
import Settings from '@/models/Settings';
import { verifyAuth } from '@/lib/auth';

export async function GET() {
  try {
    await connectDB();
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    return Response.json({ success: true, settings }, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    });
  } catch (error) {
    return Response.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request) {
  const auth = await verifyAuth(request);
  if (!auth.valid) {
    return Response.json({ success: false, error: auth.error }, { status: 401 });
  }

  try {
    const data = await request.json();
    await connectDB();
    const updatedSettings = await Settings.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
      runValidators: true,
    });
    return Response.json({ success: true, settings: updatedSettings });
  } catch (error) {
    return Response.json({ success: false, error: 'Failed to update settings' }, { status: 500 });
  }
}
