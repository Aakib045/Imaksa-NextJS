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
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5EFE4;padding:32px 0;"><tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
            <tr><td style="background:#0D4F4A;padding:28px 32px;text-align:center;">
              <div style="font-family:Georgia,serif;font-size:28px;font-weight:300;letter-spacing:6px;color:#F5EFE4;margin:0;">IMAKSA</div>
              <div style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#C9A84C;margin-top:6px;">NEW SELL REQUEST</div>
            </td></tr>
            <tr><td style="background:#ffffff;padding:0 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="35%" style="padding:12px 0;border-bottom:1px solid #E8E0D4;font-family:Arial,sans-serif;font-size:11px;color:#8A8A8A;text-transform:uppercase;letter-spacing:1px;">Name</td>
                  <td width="65%" style="padding:12px 0;border-bottom:1px solid #E8E0D4;font-family:Arial,sans-serif;font-size:14px;color:#0A0A0A;font-weight:bold;">${name}</td>
                </tr>
                <tr>
                  <td width="35%" style="padding:12px 0;border-bottom:1px solid #E8E0D4;font-family:Arial,sans-serif;font-size:11px;color:#8A8A8A;text-transform:uppercase;letter-spacing:1px;">Email</td>
                  <td width="65%" style="padding:12px 0;border-bottom:1px solid #E8E0D4;font-family:Arial,sans-serif;font-size:14px;"><a href="mailto:${email}" style="color:#0D4F4A;text-decoration:none;">${email}</a></td>
                </tr>
                <tr>
                  <td width="35%" style="padding:12px 0;border-bottom:1px solid #E8E0D4;font-family:Arial,sans-serif;font-size:11px;color:#8A8A8A;text-transform:uppercase;letter-spacing:1px;">Phone</td>
                  <td width="65%" style="padding:12px 0;border-bottom:1px solid #E8E0D4;font-family:Arial,sans-serif;font-size:14px;color:#0A0A0A;">${phone || '—'}</td>
                </tr>
                <tr>
                  <td width="35%" style="padding:12px 0;border-bottom:1px solid #E8E0D4;font-family:Arial,sans-serif;font-size:11px;color:#8A8A8A;text-transform:uppercase;letter-spacing:1px;">Property Type</td>
                  <td width="65%" style="padding:12px 0;border-bottom:1px solid #E8E0D4;font-family:Arial,sans-serif;font-size:14px;color:#0A0A0A;">${propertyType || '—'}</td>
                </tr>
                <tr>
                  <td width="35%" style="padding:12px 0;border-bottom:1px solid #E8E0D4;font-family:Arial,sans-serif;font-size:11px;color:#8A8A8A;text-transform:uppercase;letter-spacing:1px;">Location</td>
                  <td width="65%" style="padding:12px 0;border-bottom:1px solid #E8E0D4;font-family:Arial,sans-serif;font-size:14px;color:#0A0A0A;">${location || '—'}</td>
                </tr>
                <tr>
                  <td width="35%" style="padding:12px 0;border-bottom:1px solid #E8E0D4;font-family:Arial,sans-serif;font-size:11px;color:#8A8A8A;text-transform:uppercase;letter-spacing:1px;">Size</td>
                  <td width="65%" style="padding:12px 0;border-bottom:1px solid #E8E0D4;font-family:Arial,sans-serif;font-size:14px;color:#0A0A0A;">${size || '—'}</td>
                </tr>
                <tr>
                  <td width="35%" style="padding:12px 0;border-bottom:1px solid #E8E0D4;font-family:Arial,sans-serif;font-size:11px;color:#8A8A8A;text-transform:uppercase;letter-spacing:1px;">Asking Price</td>
                  <td width="65%" style="padding:12px 0;border-bottom:1px solid #E8E0D4;font-family:Arial,sans-serif;font-size:14px;color:#0A0A0A;">${askingPrice || '—'}</td>
                </tr>
                <tr>
                  <td width="35%" style="padding:12px 0;font-family:Arial,sans-serif;font-size:11px;color:#8A8A8A;text-transform:uppercase;letter-spacing:1px;">Notes</td>
                  <td width="65%" style="padding:12px 0;font-family:Arial,sans-serif;font-size:14px;color:#0A0A0A;">${notes || '—'}</td>
                </tr>
              </table>
            </td></tr>
            <tr><td style="background:#0D4F4A;padding:16px 32px;text-align:center;">
              <a href="mailto:${email}?subject=Re: Your Property Sell Request - IMAKSA" style="font-family:Arial,sans-serif;color:#C9A84C;font-size:12px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;">REPLY TO ${name.toUpperCase()}</a>
            </td></tr>
            <tr><td style="background:#F5EFE4;padding:16px 32px;text-align:center;">
              <span style="font-family:Arial,sans-serif;font-size:11px;color:#8A8A8A;">IMAKSA Real Estate LLC | Business Bay, Dubai, UAE</span>
            </td></tr>
          </table>
          </td></tr></table>
        `
      });

      await resend.emails.send({
        from: process.env.RESEND_FROM,
        to: email,
        subject: 'We received your property details — IMAKSA',
        html: `
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5EFE4;padding:32px 0;"><tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
            <tr><td style="background:#0D4F4A;padding:28px 32px;text-align:center;">
              <div style="font-family:Georgia,serif;font-size:28px;font-weight:300;letter-spacing:6px;color:#F5EFE4;margin:0;">IMAKSA</div>
              <div style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#C9A84C;margin-top:6px;">REAL ESTATE LLC</div>
            </td></tr>
            <tr><td style="background:#ffffff;padding:32px;">
              <div style="font-family:Georgia,serif;font-size:24px;font-weight:300;color:#0D4F4A;margin-bottom:16px;">Thank you, ${name}!</div>
              <p style="font-family:Arial,sans-serif;color:#4A4A4A;line-height:1.8;margin:0 0 16px;">We have received your property details and one of our consultants will contact you within 24 hours with a clear, honest valuation.</p>
              <p style="font-family:Arial,sans-serif;color:#4A4A4A;line-height:1.8;margin:0 0 24px;">In the meantime, feel free to explore our services at <a href="https://imaksa.ae" style="color:#0D4F4A;text-decoration:none;">imaksa.ae</a></p>
              <table cellpadding="0" cellspacing="0" style="margin:0 auto 8px;"><tr>
                <td style="background:#0D4F4A;padding:14px 32px;text-align:center;">
                  <a href="https://imaksa.ae" style="font-family:Arial,sans-serif;color:#C9A84C;font-size:12px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;">VISIT IMAKSA.AE</a>
                </td>
              </tr></table>
            </td></tr>
            <tr><td style="background:#F5EFE4;padding:20px 32px;text-align:center;">
              <p style="font-family:Arial,sans-serif;font-size:13px;color:#4A4A4A;margin:0 0 6px;">&#9993; <a href="mailto:sales@imaksa.ae" style="color:#0D4F4A;text-decoration:none;">sales@imaksa.ae</a></p>
              <p style="font-family:Arial,sans-serif;font-size:13px;color:#4A4A4A;margin:0;">&#127760; <a href="https://imaksa.ae" style="color:#0D4F4A;text-decoration:none;">imaksa.ae</a></p>
            </td></tr>
            <tr><td style="background:#F5EFE4;padding:12px 32px;text-align:center;border-top:1px solid #E8E0D4;">
              <span style="font-family:Arial,sans-serif;font-size:11px;color:#8A8A8A;">Suite 701, Churchill Executive Towers, Business Bay, Dubai, UAE</span>
            </td></tr>
          </table>
          </td></tr></table>
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
