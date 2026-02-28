import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

const OWNER_EMAIL = 'info@indiagovisa.com';

function row(label: string, value: string): string {
  return `<tr>
    <td style="color:#6b7280;padding:6px 12px 6px 0;white-space:nowrap;vertical-align:top;font-size:14px;">${label}</td>
    <td style="color:#111827;font-weight:600;padding:6px 0;font-size:14px;">${value || '-'}</td>
  </tr>`;
}

async function sendEmail(to: string, subject: string, html: string) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) { console.error('RESEND_API_KEY not set'); return; }
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: 'IndiaGoVisa <info@indiagovisa.com>', to: [to], subject, html }),
  });
  if (!response.ok) {
    const err = await response.text();
    console.error('Resend error for', to, ':', err);
  } else {
    console.log('Email sent to', to);
  }
}

function buildClientEmail(name: string, visaName: string, arrivalDate: string, applicationId: string): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;background:#f9f9f9;margin:0;padding:0;">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
    <div style="background:#ea580c;padding:32px 40px;">
      <h1 style="color:#fff;margin:0;font-size:24px;">IndiaGoVisa.com</h1>
      <p style="color:#fed7aa;margin:8px 0 0;font-size:14px;">Indian e-Visa Application Service</p>
    </div>
    <div style="padding:40px;">
      <h2 style="color:#1f2937;margin-top:0;">Payment Confirmed</h2>
      <p style="color:#4b5563;font-size:15px;">Dear <strong>${name}</strong>,</p>
      <p style="color:#4b5563;font-size:15px;">Thank you for your payment. Your Indian e-Visa application has been successfully submitted and is now being processed by our team.</p>
      <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:20px;margin:24px 0;">
        <h3 style="color:#ea580c;margin:0 0 12px;font-size:14px;text-transform:uppercase;letter-spacing:0.05em;">Application Details</h3>
        <table style="width:100%;border-collapse:collapse;">
          ${row('Application ID', applicationId)}
          ${row('Visa Type', visaName)}
          ${row('Expected Arrival', arrivalDate || 'Not specified')}
        </table>
      </div>
      <p style="color:#4b5563;font-size:15px;">Our visa experts will review your application within <strong>24 hours</strong>. Once approved, your eVisa will be sent to this email address.</p>
      <p style="color:#4b5563;font-size:14px;margin-top:32px;padding-top:24px;border-top:1px solid #e5e7eb;">
        Questions? Contact us at <a href="mailto:info@indiagovisa.com" style="color:#ea580c;">info@indiagovisa.com</a>
      </p>
    </div>
    <div style="background:#f3f4f6;padding:16px 40px;text-align:center;">
      <p style="color:#9ca3af;font-size:12px;margin:0;">&copy; ${new Date().getFullYear()} IndiaGoVisa.com &mdash; All rights reserved</p>
    </div>
  </div>
</body></html>`;
}

function buildAdminEmail(app: any, visaName: string, applicationId: string, amount: number): string {
  const name = `${app.given_names || ''} ${app.surname || ''}`.trim();
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;background:#f0f4f8;margin:0;padding:0;">
  <div style="max-width:700px;margin:30px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.1);">
    <div style="background:#1e3a5f;padding:24px 32px;display:flex;justify-content:space-between;align-items:center;">
      <div>
        <h1 style="color:#fff;margin:0;font-size:20px;">New Visa Application</h1>
        <p style="color:#93c5fd;margin:4px 0 0;font-size:13px;">IndiaGoVisa.com &mdash; Admin Notification</p>
      </div>
      <div style="background:#ea580c;color:#fff;padding:8px 18px;border-radius:20px;font-weight:bold;font-size:16px;">$${amount} USD</div>
    </div>
    <div style="padding:28px 32px;">
      <p style="color:#374151;font-size:14px;margin:0 0 20px;">A new payment has been received. All application details are below for entry into the government portal.</p>
      
      <h2 style="color:#1e3a5f;font-size:15px;margin:0 0 8px;padding-bottom:6px;border-bottom:2px solid #e5e7eb;">PERSONAL INFORMATION</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        ${row('Full Name', name)}
        ${row('Email', app.email)}
        ${row('Date of Birth', app.date_of_birth)}
        ${row('Gender', app.gender)}
        ${row('Nationality', app.nationality)}
        ${row('Religion', app.religion)}
        ${row('Town of Birth', app.town_of_birth)}
        ${row('Country of Birth', app.country_of_birth)}
        ${row('Visible Marks', app.visible_marks)}
        ${row('Educational Qualification', app.educational_qualification)}
        ${row('Nationality By', app.nationality_by)}
        ${row('Previous Nationality', app.prev_nationality)}
      </table>

      <h2 style="color:#1e3a5f;font-size:15px;margin:0 0 8px;padding-bottom:6px;border-bottom:2px solid #e5e7eb;">PASSPORT DETAILS</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        ${row('Passport Type', app.passport_type)}
        ${row('Passport Number', app.passport_number)}
        ${row('Place of Issue', app.place_of_issue)}
        ${row('Date of Issue', app.date_of_issue)}
        ${row('Date of Expiry', app.date_of_expiry)}
        ${row('ID Number', app.id_number)}
        ${row('Previous Name', app.changed_name === 'yes' ? (app.prev_surname + ' ' + app.prev_given_names) : 'No')}
        ${row('Other Passport', app.any_other_passport === 'yes' ? (app.other_passport_country + ' / ' + app.other_passport_number) : 'No')}
      </table>

      <h2 style="color:#1e3a5f;font-size:15px;margin:0 0 8px;padding-bottom:6px;border-bottom:2px solid #e5e7eb;">ADDRESS</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        ${row('Street', app.pres_house_street)}
        ${row('City', app.pres_village_city)}
        ${row('State', app.pres_state)}
        ${row('Country', app.pres_country)}
        ${row('ZIP', app.pres_zip)}
        ${row('Phone', app.pres_phone)}
      </table>

      <h2 style="color:#1e3a5f;font-size:15px;margin:0 0 8px;padding-bottom:6px;border-bottom:2px solid #e5e7eb;">VISA DETAILS</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        ${row('Visa Type', visaName)}
        ${row('Port of Arrival', app.port_of_arrival)}
        ${row('Expected Arrival', app.expected_arrival_date)}
        ${row('Amount Paid', '$' + amount + ' USD')}
        ${row('Application ID', applicationId)}
      </table>

      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin-top:8px;">
        <p style="color:#64748b;font-size:12px;margin:0;">
          <strong>Note:</strong> Log into <a href="https://indianvisaonline.gov.in" style="color:#ea580c;">indianvisaonline.gov.in</a> to submit this application to the Indian government. Application ID: <strong>${applicationId}</strong>
        </p>
      </div>
    </div>
  </div>
</body></html>`;
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
    const clientEmail = session.customer_email || '';
    const amountPaid = session.amount_total ? session.amount_total / 100 : 0;

    if (applicationId) {
      // Update payment status
      await supabase
        .from('visa_applications')
        .update({ payment_status: 'paid', stripe_session_id: session.id })
        .eq('id', applicationId);

      // Fetch ALL applicant fields for admin email
      const { data: app } = await supabase
        .from('visa_applications')
        .select('*')
        .eq('id', applicationId)
        .single();

      if (app) {
        const applicantName = `${app.given_names || ''} ${app.surname || ''}`.trim();

        // 1. Send confirmation to client
        if (clientEmail) {
          await sendEmail(
            clientEmail,
            'Payment Confirmed - Your Indian e-Visa Application | IndiaGoVisa.com',
            buildClientEmail(applicantName, visaName, app.expected_arrival_date, applicationId)
          );
        }

        // 2. Send full application details to owner
        await sendEmail(
          OWNER_EMAIL,
          `[NEW APPLICATION] ${applicantName} - ${visaName} - $${amountPaid} USD`,
          buildAdminEmail(app, visaName, applicationId, amountPaid)
        );
      }
    }
  }

  res.json({ received: true });
}
