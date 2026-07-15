import { connectDB } from '@/lib/mongodb';
import Job from '@/models/Job';
import { verifyAuth } from '@/lib/auth';

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    await connectDB();
    const job = await Job.findById(id);
    if (!job) {
      return Response.json({ success: false, error: 'Job not found' }, { status: 404 });
    }
    return Response.json({ success: true, job });
  } catch {
    return Response.json({ success: false, error: 'Failed to fetch job' }, { status: 500 });
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
    const updated = await Job.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!updated) {
      return Response.json({ success: false, error: 'Job not found' }, { status: 404 });
    }
    return Response.json({ success: true, job: updated });
  } catch {
    return Response.json({ success: false, error: 'Failed to update job' }, { status: 500 });
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
    const deleted = await Job.findByIdAndDelete(id);
    if (!deleted) {
      return Response.json({ success: false, error: 'Job not found' }, { status: 404 });
    }
    return Response.json({ success: true, message: 'Job deleted' });
  } catch {
    return Response.json({ success: false, error: 'Failed to delete job' }, { status: 500 });
  }
}
