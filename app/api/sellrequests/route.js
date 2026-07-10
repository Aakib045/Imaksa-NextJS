import { connectDB } from '@/lib/mongodb';
import SellRequest from '@/models/SellRequest';
import { verifyAuth } from '@/lib/auth';
import { Resend } from 'resend';

export async function POST(request) {
  try {
    const { name, email, phone, propertyType, location, size, askingPrice, notes } = await request.json();
    const ip = request.headers.get('x-forwarded-for') || '';
    await connectDB();
    const newSellRequest = await SellRequest.create({ name, email, phone, propertyType, location, size, askingPrice, notes, ip });

    try {
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: process.env.RESEND_FROM,
        to: process.env.CLIENT_EMAIL,
        subject: `New Sell Request from ${name} — IMAKSA`,
        html: `
          <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#F5EFE4;">
            <div style="background:#0D4F4A;padding:24px;text-align:center;margin-bottom:24px;">
              <h1 style="color:#F5EFE4;font-family:Georgia,serif;font-weight:300;letter-spacing:4px;margin:0;">IMAKSA</h1>
              <p style="color:#C9A84C;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:4px 0 0;">New Sell Request</p>
            </div>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:10px 0;border-bottom:1px solid rgba(13,79,74,.12);font-size:12px;color:#8A8A8A;text-transform:uppercase;letter-spacing:1px;">Name</td><td style="padding:10px 0;border-bottom:1px solid rgba(13,79,74,.12);font-size:14px;color:#0A0A0A;font-weight:500;">${name}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid rgba(13,79,74,.12);font-size:12px;color:#8A8A8A;text-transform:uppercase;letter-spacing:1px;">Email</td><td style="padding:10px 0;border-bottom:1px solid rgba(13,79,74,.12);font-size:14px;color:#0D4F4A;">${email}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid rgba(13,79,74,.12);font-size:12px;color:#8A8A8A;text-transform:uppercase;letter-spacing:1px;">Phone</td><td style="padding:10px 0;border-bottom:1px solid rgba(13,79,74,.12);font-size:14px;color:#0A0A0A;">${phone || '—'}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid rgba(13,79,74,.12);font-size:12px;color:#8A8A8A;text-transform:uppercase;letter-spacing:1px;">Property Type</td><td style="padding:10px 0;border-bottom:1px solid rgba(13,79,74,.12);font-size:14px;color:#0A0A0A;">${propertyType || '—'}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid rgba(13,79,74,.12);font-size:12px;color:#8A8A8A;text-transform:uppercase;letter-spacing:1px;">Location</td><td style="padding:10px 0;border-bottom:1px solid rgba(13,79,74,.12);font-size:14px;color:#0A0A0A;">${location || '—'}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid rgba(13,79,74,.12);font-size:12px;color:#8A8A8A;text-transform:uppercase;letter-spacing:1px;">Size</td><td style="padding:10px 0;border-bottom:1px solid rgba(13,79,74,.12);font-size:14px;color:#0A0A0A;">${size || '—'}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid rgba(13,79,74,.12);font-size:12px;color:#8A8A8A;text-transform:uppercase;letter-spacing:1px;">Asking Price</td><td style="padding:10px 0;border-bottom:1px solid rgba(13,79,74,.12);font-size:14px;color:#0A0A0A;">${askingPrice || '—'}</td></tr>
              <tr><td style="padding:10px 0;font-size:12px;color:#8A8A8A;text-transform:uppercase;letter-spacing:1px;">Notes</td><td style="padding:10px 0;font-size:14px;color:#0A0A0A;">${notes || '—'}</td></tr>
            </table>
            <div style="margin-top:24px;padding:16px;background:#0D4F4A;text-align:center;">
              <a href="mailto:${email}?subject=Re: Your Property Sell Request - IMAKSA" style="color:#C9A84C;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Reply to ${name}</a>
            </div>
          </div>
        `
      });

      await resend.emails.send({
        from: process.env.RESEND_FROM,
        to: email,
        subject: 'We received your property details — IMAKSA',
        html: `
          <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#F5EFE4;">
            <div style="background:#0D4F4A;padding:24px;text-align:center;margin-bottom:24px;">
              <h1 style="color:#F5EFE4;font-family:Georgia,serif;font-weight:300;letter-spacing:4px;margin:0;">IMAKSA</h1>
              <p style="color:#C9A84C;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:4px 0 0;">Real Estate LLC</p>
            </div>
            <h2 style="font-family:Georgia,serif;font-weight:300;color:#0D4F4A;font-size:24px;margin-bottom:16px;">Thank you, ${name}!</h2>
            <p style="color:#4A4A4A;line-height:1.8;margin-bottom:16px;">We have received your property details and one of our expert consultants will contact you within 24 hours to discuss next steps.</p>
            <p style="color:#4A4A4A;line-height:1.8;margin-bottom:24px;">In the meantime, feel free to explore our services at <a href="https://imaksa.ae" style="color:#0D4F4A;">imaksa.ae</a></p>
            <div style="border-top:1px solid rgba(13,79,74,.15);padding-top:16px;margin-top:16px;">
              <p style="color:#8A8A8A;font-size:12px;margin:4px 0;">📞 ${process.env.CLIENT_EMAIL}</p>
              <p style="color:#8A8A8A;font-size:12px;margin:4px 0;">🌐 imaksa.ae</p>
            </div>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Email send failed:', emailError);
    }

    return Response.json({ success: true, sellRequest: newSellRequest }, { status: 201 });
  } catch (error) {
    return Response.json({ success: false, error: 'Failed to submit sell request' }, { status: 500 });
  }
}

export async function GET(request) {
  const auth = await verifyAuth(request);
  if (!auth.valid) {
    return Response.json({ success: false, error: auth.error }, { status: 401 });
  }

  try {
    await connectDB();
    const sellRequests = await SellRequest.find().sort({ createdAt: -1 });
    return Response.json({ success: true, sellRequests });
  } catch (error) {
    return Response.json({ success: false, error: 'Failed to fetch sell requests' }, { status: 500 });
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
    const updatedSellRequest = await SellRequest.findByIdAndUpdate(id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });
    if (!updatedSellRequest) {
      return Response.json({ success: false, error: 'Sell request not found' }, { status: 404 });
    }
    return Response.json({ success: true, sellRequest: updatedSellRequest });
  } catch (error) {
    return Response.json({ success: false, error: 'Failed to update sell request' }, { status: 500 });
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
    const deleted = await SellRequest.findByIdAndDelete(id);
    if (!deleted) {
      return Response.json({ success: false, error: 'Sell request not found' }, { status: 404 });
    }
    return Response.json({ success: true, message: 'Sell request deleted' });
  } catch (error) {
    return Response.json({ success: false, error: 'Failed to delete sell request' }, { status: 500 });
  }
}
