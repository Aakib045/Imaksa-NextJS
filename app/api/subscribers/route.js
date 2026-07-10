import { connectDB } from '@/lib/mongodb';
import Subscriber from '@/models/Subscriber';
import { verifyAuth } from '@/lib/auth';

export async function POST(request) {
  try {
    const { name, email, source } = await request.json();
    const ip = request.headers.get('x-forwarded-for') || '';
    await connectDB();
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return Response.json({ success: true, message: 'Already subscribed' });
    }
    const newSubscriber = await Subscriber.create({ name, email, source, ip });
    return Response.json({ success: true, subscriber: newSubscriber }, { status: 201 });
  } catch (error) {
    return Response.json({ success: false, error: 'Failed to subscribe' }, { status: 500 });
  }
}

export async function GET(request) {
  const auth = await verifyAuth(request);
  if (!auth.valid) {
    return Response.json({ success: false, error: auth.error }, { status: 401 });
  }

  try {
    await connectDB();
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    return Response.json({ success: true, subscribers });
  } catch (error) {
    return Response.json({ success: false, error: 'Failed to fetch subscribers' }, { status: 500 });
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
    const deleted = await Subscriber.findByIdAndDelete(id);
    if (!deleted) {
      return Response.json({ success: false, error: 'Subscriber not found' }, { status: 404 });
    }
    return Response.json({ success: true, message: 'Subscriber deleted' });
  } catch (error) {
    return Response.json({ success: false, error: 'Failed to delete subscriber' }, { status: 500 });
  }
}
