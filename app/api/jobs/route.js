import { connectDB } from '@/lib/mongodb';
import Job from '@/models/Job';
import { verifyAuth } from '@/lib/auth';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get('admin');
    const query = admin ? {} : { active: true };
    const jobs = await Job.find(query).sort({ order: 1 });
    return Response.json({ success: true, jobs }, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' },
    });
  } catch {
    return Response.json({ success: false, error: 'Failed to fetch jobs' }, { status: 500 });
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
    const newJob = await Job.create(data);
    return Response.json({ success: true, job: newJob }, { status: 201 });
  } catch {
    return Response.json({ success: false, error: 'Failed to create job' }, { status: 500 });
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
    const updated = await Job.findByIdAndUpdate(id, fieldsToUpdate, { new: true, runValidators: true });
    if (!updated) {
      return Response.json({ success: false, error: 'Job not found' }, { status: 404 });
    }
    return Response.json({ success: true, job: updated });
  } catch {
    return Response.json({ success: false, error: 'Failed to update job' }, { status: 500 });
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
    const deleted = await Job.findByIdAndDelete(id);
    if (!deleted) {
      return Response.json({ success: false, error: 'Job not found' }, { status: 404 });
    }
    return Response.json({ success: true, message: 'Job deleted' });
  } catch {
    return Response.json({ success: false, error: 'Failed to delete job' }, { status: 500 });
  }
}
