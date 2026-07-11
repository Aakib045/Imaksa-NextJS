import { connectDB } from '@/lib/mongodb';
import Property from '@/models/Property';
import { verifyAuth } from '@/lib/auth';

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const listingType = searchParams.get('listingType');
    const type = searchParams.get('type');
    const featured = searchParams.get('featured');

    const filter = { status: 'active' };

    if (listingType) filter.listingType = { $regex: new RegExp(`^${listingType}$`, 'i') };
    if (type) filter.type = { $regex: new RegExp(`^${type}$`, 'i') };
    if (featured === 'true') filter.featured = true;

    const properties = await Property.find(filter).sort({ order: 1, createdAt: -1 });

    return Response.json({ success: true, properties }, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
    });
  } catch (error) {
    return Response.json({ success: false, error: 'Failed to fetch properties' }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await verifyAuth(request);
  if (!auth.valid) {
    return Response.json({ success: false, error: auth.error }, { status: 401 });
  }

  try {
    const data = await request.json();
    await connectDB();
    const newProperty = await Property.create(data);
    return Response.json({ success: true, property: newProperty }, { status: 201 });
  } catch (error) {
    return Response.json({ success: false, error: 'Failed to create property' }, { status: 500 });
  }
}

export async function PUT(request) {
  const auth = await verifyAuth(request);
  if (!auth.valid) {
    return Response.json({ success: false, error: auth.error }, { status: 401 });
  }

  try {
    const { id, ...fieldsToUpdate } = await request.json();
    await connectDB();
    const updatedProperty = await Property.findByIdAndUpdate(id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });
    if (!updatedProperty) {
      return Response.json({ success: false, error: 'Property not found' }, { status: 404 });
    }
    return Response.json({ success: true, property: updatedProperty });
  } catch (error) {
    return Response.json({ success: false, error: 'Failed to update property' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const auth = await verifyAuth(request);
  if (!auth.valid) {
    return Response.json({ success: false, error: auth.error }, { status: 401 });
  }

  try {
    const { id } = await request.json();
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
