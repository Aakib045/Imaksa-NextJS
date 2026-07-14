import { connectDB } from '@/lib/mongodb';
import Enquiry from '@/models/Enquiry';
import { verifyAuth } from '@/lib/auth';
import { Resend } from 'resend';

export async function POST(request) {
  try {
    const { name, email, phone, interest, budget, message, source } = await request.json();
    const ip = request.headers.get('x-forwarded-for') || '';

    const getEmailMeta = (source, interest) => {
      if (source === 'careers') return { title: 'NEW CAREER APPLICATION', subject: `New Career Application from ${name} — IMAKSA`, confirmSubject: 'Thank you for your application — IMAKSA', confirmBody: 'We have received your job application and our HR team will review it and get back to you within 48 hours.' }
      if (source === 'buy-inquiry') return { title: 'NEW BUY ENQUIRY', subject: `New Buy Enquiry from ${name} — IMAKSA`, confirmSubject: 'Thank you for your enquiry — IMAKSA', confirmBody: 'We have received your buying enquiry and one of our expert consultants will get back to you within 24 hours with exclusive listings.' }
      if (source === 'rent-inquiry') return { title: 'NEW RENT ENQUIRY', subject: `New Rent Enquiry from ${name} — IMAKSA`, confirmSubject: 'Thank you for your enquiry — IMAKSA', confirmBody: 'We have received your rental enquiry and one of our expert consultants will get back to you within 24 hours with available properties.' }
      if (source === 'offplan-inquiry') return { title: 'NEW OFF-PLAN ENQUIRY', subject: `New Off-Plan Enquiry from ${name} — IMAKSA`, confirmSubject: 'Thank you for your enquiry — IMAKSA', confirmBody: 'We have received your off-plan investment enquiry and one of our expert consultants will get back to you within 24 hours.' }
      if (source === 'sell' || source === 'website-sell') return { title: 'NEW SELL REQUEST', subject: `New Sell Request from ${name} — IMAKSA`, confirmSubject: 'We received your property details — IMAKSA', confirmBody: 'We have received your property details and one of our consultants will contact you within 24 hours with a valuation.' }
      return { title: 'NEW PROPERTY ENQUIRY', subject: `New Enquiry from ${name} — IMAKSA`, confirmSubject: 'Thank you for your enquiry — IMAKSA', confirmBody: 'We have received your enquiry and one of our expert consultants will get back to you within 24 hours.' }
    }
    const meta = getEmailMeta(source, interest);

    await connectDB();
    const newEnquiry = await Enquiry.create({ name, email, phone, interest, budget, message, source, ip });

    try {
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: process.env.RESEND_FROM,
        to: process.env.CLIENT_EMAIL,
        subject: meta.subject,
        html: `
          <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#F5EFE4;">
            <div style="background:#0D4F4A;padding:24px;text-align:center;margin-bottom:24px;">
              <h1 style="color:#F5EFE4;font-family:Georgia,serif;font-weight:300;letter-spacing:4px;margin:0;">IMAKSA</h1>
              <p style="color:#C9A84C;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:4px 0 0;">${meta.title}</p>
            </div>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:10px 0;border-bottom:1px solid rgba(13,79,74,.12);font-size:12px;color:#8A8A8A;text-transform:uppercase;letter-spacing:1px;">Name</td><td style="padding:10px 0;border-bottom:1px solid rgba(13,79,74,.12);font-size:14px;color:#0A0A0A;font-weight:500;">${name}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid rgba(13,79,74,.12);font-size:12px;color:#8A8A8A;text-transform:uppercase;letter-spacing:1px;">Email</td><td style="padding:10px 0;border-bottom:1px solid rgba(13,79,74,.12);font-size:14px;color:#0D4F4A;">${email}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid rgba(13,79,74,.12);font-size:12px;color:#8A8A8A;text-transform:uppercase;letter-spacing:1px;">Phone</td><td style="padding:10px 0;border-bottom:1px solid rgba(13,79,74,.12);font-size:14px;color:#0A0A0A;">${phone || '—'}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid rgba(13,79,74,.12);font-size:12px;color:#8A8A8A;text-transform:uppercase;letter-spacing:1px;">Interest</td><td style="padding:10px 0;border-bottom:1px solid rgba(13,79,74,.12);font-size:14px;color:#0A0A0A;">${interest || '—'}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid rgba(13,79,74,.12);font-size:12px;color:#8A8A8A;text-transform:uppercase;letter-spacing:1px;">Budget</td><td style="padding:10px 0;border-bottom:1px solid rgba(13,79,74,.12);font-size:14px;color:#0A0A0A;">${budget || '—'}</td></tr>
              <tr><td style="padding:10px 0;font-size:12px;color:#8A8A8A;text-transform:uppercase;letter-spacing:1px;">Message</td><td style="padding:10px 0;font-size:14px;color:#0A0A0A;">${message || '—'}</td></tr>
            </table>
            <div style="margin-top:24px;padding:16px;background:#0D4F4A;text-align:center;">
              <a href="mailto:${email}?subject=Re: Your Property Enquiry - IMAKSA" style="color:#C9A84C;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Reply to ${name}</a>
            </div>
          </div>
        `
      });

      await resend.emails.send({
        from: process.env.RESEND_FROM,
        to: email,
        subject: meta.confirmSubject,
        html: `
          <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#F5EFE4;">
            <div style="background:#0D4F4A;padding:24px;text-align:center;margin-bottom:24px;">
              <h1 style="color:#F5EFE4;font-family:Georgia,serif;font-weight:300;letter-spacing:4px;margin:0;">IMAKSA</h1>
              <p style="color:#C9A84C;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:4px 0 0;">Real Estate LLC</p>
            </div>
            <h2 style="font-family:Georgia,serif;font-weight:300;color:#0D4F4A;font-size:24px;margin-bottom:16px;">Thank you, ${name}!</h2>
            <p style="color:#4A4A4A;line-height:1.8;margin-bottom:16px;">${meta.confirmBody}</p>
            <p style="color:#4A4A4A;line-height:1.8;margin-bottom:24px;">In the meantime, feel free to browse our latest listings at <a href="https://imaksa.ae" style="color:#0D4F4A;">imaksa.ae</a></p>
            <div style="border-top:1px solid rgba(13,79,74,.15);padding-top:16px;margin-top:16px;">
              <p style="color:#8A8A8A;font-size:12px;margin:4px 0;">📞 ${process.env.CLIENT_EMAIL}</p>
              <p style="color:#8A8A8A;font-size:12px;margin:4px 0;">🌐 imaksa.ae</p>
            </div>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Email send failed:', emailError.message, emailError);
    }

    return Response.json({ success: true, enquiry: newEnquiry }, { status: 201 });
  } catch (error) {
    return Response.json({ success: false, error: 'Failed to submit enquiry' }, { status: 500 });
  }
}

export async function GET(request) {
  const auth = await verifyAuth(request);
  if (!auth.valid) {
    return Response.json({ success: false, error: auth.error }, { status: 401 });
  }

  try {
    await connectDB();
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    return Response.json({ success: true, enquiries });
  } catch (error) {
    return Response.json({ success: false, error: 'Failed to fetch enquiries' }, { status: 500 });
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
    const updatedEnquiry = await Enquiry.findByIdAndUpdate(id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });
    if (!updatedEnquiry) {
      return Response.json({ success: false, error: 'Enquiry not found' }, { status: 404 });
    }
    return Response.json({ success: true, enquiry: updatedEnquiry });
  } catch (error) {
    return Response.json({ success: false, error: 'Failed to update enquiry' }, { status: 500 });
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
    const deleted = await Enquiry.findByIdAndDelete(id);
    if (!deleted) {
      return Response.json({ success: false, error: 'Enquiry not found' }, { status: 404 });
    }
    return Response.json({ success: true, message: 'Enquiry deleted' });
  } catch (error) {
    return Response.json({ success: false, error: 'Failed to delete enquiry' }, { status: 500 });
  }
}
