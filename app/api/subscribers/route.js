import { connectDB } from '@/lib/mongodb';
import Subscriber from '@/models/Subscriber';
import { verifyAuth } from '@/lib/auth';

const ipRequests = new Map()
const emailRequests = new Map()

function isRateLimited(ip) {
  const now = Date.now()
  const times = (ipRequests.get(ip) || []).filter(t => now - t < 3600000)
  if (times.length >= 3) return true
  ipRequests.set(ip, [...times, now])
  return false
}

function isSpam({ name, email, website_url }) {
  if (website_url) return true
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (email && !emailRegex.test(email)) return true
  if (email) {
    const now = Date.now()
    const times = (emailRequests.get(email) || []).filter(t => now - t < 600000)
    if (times.length >= 2) return true
    emailRequests.set(email, [...times, now])
  }
  if (name) {
    if (/[bcdfghjklmnpqrstvwxyz]{6,}/i.test(name.replace(/\s/g, ''))) return true
    if (/\.\s*\.\s*\./.test(name)) return true
  }
  return false
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, source, website_url } = body;
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

    if (isRateLimited(ip)) {
      return Response.json({ success: false, error: 'Too many requests, please try again later' }, { status: 429 });
    }
    if (isSpam({ name, email, website_url })) {
      return Response.json({ success: true }, { status: 201 });
    }

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
