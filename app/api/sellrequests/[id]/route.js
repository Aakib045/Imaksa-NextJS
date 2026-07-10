import { connectDB } from '@/lib/mongodb';
import SellRequest from '@/models/SellRequest';
import { verifyAuth } from '@/lib/auth';

export async function PUT(request, { params }) {
  const { id } = await params;
  const auth = await verifyAuth(request);
  if (!auth.valid) {
    return Response.json({ success: false, error: auth.error }, { status: 401 });
  }

  try {
    const data = await request.json();
    await connectDB();
    const updated = await SellRequest.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!updated) {
      return Response.json({ success: false, error: 'Sell request not found' }, { status: 404 });
    }
    return Response.json({ success: true, sellRequest: updated });
  } catch (error) {
    return Response.json({ success: false, error: 'Failed to update sell request' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const auth = await verifyAuth(request);
  if (!auth.valid) {
    return Response.json({ success: false, error: auth.error }, { status: 401 });
  }

  try {
    await connectDB();
    const deleted = await SellRequest.findByIdAndDelete(id);
    if (!deleted) {
      return Response.json({ success: false, error: 'Sell request not found' }, { status: 404 });
    }
    return Response.json({ success: true, message: 'Sell request deleted' });
  } catch (error) {
    return Response.json({ success: false, error: 'Failed to delete sell request' }, { status: 500 });
  }
}
