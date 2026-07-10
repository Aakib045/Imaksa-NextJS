import { connectDB } from '@/lib/mongodb';
import SellRequest from '@/models/SellRequest';
import { verifyAuth } from '@/lib/auth';

export async function PUT(request) {
  const auth = await verifyAuth(request);
  if (!auth.valid) {
    return Response.json({ success: false, error: auth.error }, { status: 401 });
  }

  try {
    await connectDB();
    await SellRequest.updateMany({}, { read: true });
    return Response.json({ success: true, message: 'All sell requests marked as read' });
  } catch (error) {
    return Response.json({ success: false, error: 'Failed to mark sell requests as read' }, { status: 500 });
  }
}
