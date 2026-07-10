import { connectDB } from '@/lib/mongodb';
import Enquiry from '@/models/Enquiry';
import { verifyAuth } from '@/lib/auth';

export async function PUT(request) {
  const auth = await verifyAuth(request);
  if (!auth.valid) {
    return Response.json({ success: false, error: auth.error }, { status: 401 });
  }

  try {
    await connectDB();
    await Enquiry.updateMany({}, { read: true });
    return Response.json({ success: true, message: 'All enquiries marked as read' });
  } catch (error) {
    return Response.json({ success: false, error: 'Failed to mark enquiries as read' }, { status: 500 });
  }
}
