import { connectDB } from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { verifyAuth } from '@/lib/auth';

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const filter = { status: 'Published' };

    if (category) filter.cat = { $regex: new RegExp(`^${category}$`, 'i') };

    const blogs = await Blog.find(filter).sort({ createdAt: -1 });

    return Response.json({ success: true, blogs }, {
      headers: { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=240' },
    });
  } catch (error) {
    return Response.json({ success: false, error: 'Failed to fetch blogs' }, { status: 500 });
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
    const newBlog = await Blog.create(data);
    return Response.json({ success: true, blog: newBlog }, { status: 201 });
  } catch (error) {
    return Response.json({ success: false, error: 'Failed to create blog' }, { status: 500 });
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
    const updatedBlog = await Blog.findByIdAndUpdate(id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });
    if (!updatedBlog) {
      return Response.json({ success: false, error: 'Blog not found' }, { status: 404 });
    }
    return Response.json({ success: true, blog: updatedBlog });
  } catch (error) {
    return Response.json({ success: false, error: 'Failed to update blog' }, { status: 500 });
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
    const deleted = await Blog.findByIdAndDelete(id);
    if (!deleted) {
      return Response.json({ success: false, error: 'Blog not found' }, { status: 404 });
    }
    return Response.json({ success: true, message: 'Blog deleted' });
  } catch (error) {
    return Response.json({ success: false, error: 'Failed to delete blog' }, { status: 500 });
  }
}
