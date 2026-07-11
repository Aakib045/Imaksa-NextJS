import { connectDB } from '@/lib/mongodb';
import Property from '@/models/Property';
import { verifyAuth } from '@/lib/auth';

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    await connectDB();
    const property = await Property.findById(id);
    if (!property) {
      return Response.json({ success: false, error: 'Property not found' }, { status: 404 });
    }
    return Response.json({ success: true, property }, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' },
    });
  } catch (error) {
    return Response.json({ success: false, error: 'Failed to fetch property' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const auth = await verifyAuth(request);
  if (!auth.valid) {
    return Response.json({ success: false, error: auth.error }, { status: 401 });
  }

  try {
    const data = await request.json();
    await connectDB();
    const updated = await Property.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!updated) {
      return Response.json({ success: false, error: 'Property not found' }, { status: 404 });
    }
    return Response.json({ success: true, property: updated }, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' },
    });
  } catch (error) {
    return Response.json({ success: false, error: error.message || 'Failed to update property' }, { status: 500 });
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
    const deleted = await Property.findByIdAndDelete(id);
    if (!deleted) {
      return Response.json({ success: false, error: 'Property not found' }, { status: 404 });
    }
    return Response.json({ success: true, message: 'Property deleted' });
  } catch (error) {
    return Response.json({ success: false, error: 'Failed to delete property' }, { status: 500 });
  }
}
