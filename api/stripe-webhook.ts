import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

async function sendConfirmationEmail(to: string, applicantName: string, visaName: string, arrivalDate: string, applicationId: string) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY not set, skipping email');
    return;
  }

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; background: #f9f9f9; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
    <div style="background: #ea580c; padding: 32px 40px;">
      <h1 style="color: #fff; margin: 0; font-size: 24px;">IndiaGoVisa.com</h1>
      <p style="color: #fed7aa; margin: 8px 0 0; font-size: 14px;">Indian e-Visa Application Service</p>
    </div>
    <div style="padding: 40px;">
      <h2 style="color: #1f2937; margin-top: 0;">Payment Confirmed ✓</h2>
      <p style="color: #4b5563; font-size: 15px;">Dear <strong>${applicantName}</strong>,</p>
      <p style="color: #4b5563; font-size: 15px;">
        Thank you for your payment. Your Indian e-Visa application has been successfully submitted and is now being processed by our team.
      </p>
      <div style="background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h3 style="color: #ea580c; margin: 0 0 12px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Application Details</h3>
        <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
          <tr><td style="color: #6b7280; padding: 4px 0;">Application ID</td><td style="color: #1f2937; font-weight: bold; text-align: right;">${applicationId}</td></tr>
          <tr><td style="color: #6b7280; padding: 4px 0;">Visa Type</td><td style="color: #1f2937; font-weight: bold; text-align: right;">${visaName}</td></tr>
          <tr><td style="color: #6b7280; padding: 4px 0;">Expected Arrival</td><td style="color: #1f2937; font-weight: bold; text-align: right;">${arrivalDate || 'Not specified'}</td></tr>
        </table>
      </div>
      <p style="color: #4b5563; font-size: 15px;">
        Our visa experts will review your application within <strong>24 hours</strong>. Once approved, your eVisa will be sent to this email address.
      </p>
      <p style="color: #4b5563; font-size: 14px; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
        If you have any questions, please contact us at <a href="mailto:support@indiagovisa.com" style="color: #ea580c;">support@indiagovisa.com</a>
      </p>
    </div>
    <div style="background: #f3f4f6; padding: 16px 40px; text-align: center;">
      <p style="color: #9ca3af; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} IndiaGoVisa.com — All rights reserved</p>
    </div>
  </div>
</body>
</html>`;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'IndiaGoVisa <noreply@indiagovisa.com>',
      to: [to],
      subject: 'Payment Confirmed — Your Indian e-Visa Application',
      html,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error('Resend email error:', err);
  } else {
    console.log('Confirmation email sent to', to);
  }
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;
  try {
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret as string);
  } catch (err: any) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const applicationId = session.metadata?.applicationId;
    const visaName = session.metadata?.visaName || 'Indian e-Visa';
    const email = session.customer_email || '';

    // Update payment status in Supabase
    if (applicationId) {
      const { error } = await supabase
        .from('visa_applications')
        .update({ payment_status: 'paid', stripe_session_id: session.id })
        .eq('id', applicationId);

      if (error) {
        console.error('Supabase update error:', error);
      }

      // Fetch applicant details for email
      const { data: app } = await supabase
        .from('visa_applications')
        .select('given_names, surname, expected_arrival_date')
        .eq('id', applicationId)
        .single();

      if (app && email) {
        const applicantName = `${app.given_names || ''} ${app.surname || ''}`.trim();
        await sendConfirmationEmail(email, applicantName, visaName, app.expected_arrival_date, applicationId);
      }
    }
  }

  res.json({ received: true });
}
