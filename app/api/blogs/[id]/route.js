import { connectDB } from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { verifyAuth } from '@/lib/auth';

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    await connectDB();
    const blog = await Blog.findById(id);
    if (!blog) {
      return Response.json({ success: false, error: 'Blog not found' }, { status: 404 });
    }
    return Response.json({ success: true, blog });
  } catch (error) {
    return Response.json({ success: false, error: 'Failed to fetch blog' }, { status: 500 });
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
    const updated = await Blog.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!updated) {
      return Response.json({ success: false, error: 'Blog not found' }, { status: 404 });
    }
    return Response.json({ success: true, blog: updated });
  } catch (error) {
    return Response.json({ success: false, error: 'Failed to update blog' }, { status: 500 });
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
    const deleted = await Blog.findByIdAndDelete(id);
    if (!deleted) {
      return Response.json({ success: false, error: 'Blog not found' }, { status: 404 });
    }
    return Response.json({ success: true, message: 'Blog deleted' });
  } catch (error) {
    return Response.json({ success: false, error: 'Failed to delete blog' }, { status: 500 });
  }
}
