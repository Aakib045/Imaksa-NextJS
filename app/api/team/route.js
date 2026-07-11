import { connectDB } from '@/lib/mongodb';
import Team from '@/models/Team';
import { verifyAuth } from '@/lib/auth';

export async function GET() {
  try {
    await connectDB();
    const members = await Team.find({ active: true }).sort({ order: 1 });
    return Response.json({ success: true, members }, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' },
    });
  } catch (error) {
    return Response.json({ success: false, error: 'Failed to fetch team members' }, { status: 500 });
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
    const newMember = await Team.create(data);
    return Response.json({ success: true, member: newMember }, { status: 201 });
  } catch (error) {
    return Response.json({ success: false, error: 'Failed to create team member' }, { status: 500 });
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
    const updatedMember = await Team.findByIdAndUpdate(id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });
    if (!updatedMember) {
      return Response.json({ success: false, error: 'Team member not found' }, { status: 404 });
    }
    return Response.json({ success: true, member: updatedMember });
  } catch (error) {
    return Response.json({ success: false, error: 'Failed to update team member' }, { status: 500 });
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
    const deleted = await Team.findByIdAndDelete(id);
    if (!deleted) {
      return Response.json({ success: false, error: 'Team member not found' }, { status: 404 });
    }
    return Response.json({ success: true, message: 'Team member deleted' });
  } catch (error) {
    return Response.json({ success: false, error: 'Failed to delete team member' }, { status: 500 });
  }
}
