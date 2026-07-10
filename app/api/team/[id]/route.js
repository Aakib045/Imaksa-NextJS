import { connectDB } from '@/lib/mongodb';
import Team from '@/models/Team';
import { verifyAuth } from '@/lib/auth';

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    await connectDB();
    const member = await Team.findById(id);
    if (!member) {
      return Response.json({ success: false, error: 'Team member not found' }, { status: 404 });
    }
    return Response.json({ success: true, member });
  } catch (error) {
    return Response.json({ success: false, error: 'Failed to fetch team member' }, { status: 500 });
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
    const updated = await Team.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!updated) {
      return Response.json({ success: false, error: 'Team member not found' }, { status: 404 });
    }
    return Response.json({ success: true, member: updated });
  } catch (error) {
    return Response.json({ success: false, error: 'Failed to update team member' }, { status: 500 });
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
    const deleted = await Team.findByIdAndDelete(id);
    if (!deleted) {
      return Response.json({ success: false, error: 'Team member not found' }, { status: 404 });
    }
    return Response.json({ success: true, message: 'Team member deleted' });
  } catch (error) {
    return Response.json({ success: false, error: 'Failed to delete team member' }, { status: 500 });
  }
}
