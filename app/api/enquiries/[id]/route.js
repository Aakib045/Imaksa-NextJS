import { connectDB } from '@/lib/mongodb';
import Enquiry from '@/models/Enquiry';
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
    const updated = await Enquiry.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!updated) {
      return Response.json({ success: false, error: 'Enquiry not found' }, { status: 404 });
    }
    return Response.json({ success: true, enquiry: updated });
  } catch (error) {
    return Response.json({ success: false, error: 'Failed to update enquiry' }, { status: 500 });
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
    const deleted = await Enquiry.findByIdAndDelete(id);
    if (!deleted) {
      return Response.json({ success: false, error: 'Enquiry not found' }, { status: 404 });
    }
    return Response.json({ success: true, message: 'Enquiry deleted' });
  } catch (error) {
    return Response.json({ success: false, error: 'Failed to delete enquiry' }, { status: 500 });
  }
}
