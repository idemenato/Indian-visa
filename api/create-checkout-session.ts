import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const PRICES: Record<string, number> = {
  etourist_30: 4900,
  etourist_1y: 6900,
  etourist_5y: 9900,
  ebusiness: 7900,
  emedical: 7900,
  emedical_attendant: 5900,
  econference: 6900,
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { applicationId, visaService, email } = req.body;
    const amount = PRICES[visaService] || 4900;

    const serviceNames: Record<string, string> = {
      etourist_30: 'e-Tourist Visa (30 Days)',
      etourist_1y: 'e-Tourist Visa (1 Year)',
      etourist_5y: 'e-Tourist Visa (5 Years)',
      ebusiness: 'e-Business Visa',
      emedical: 'e-Medical Visa',
      emedical_attendant: 'e-Medical Attendant Visa',
      econference: 'e-Conference Visa',
    };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Indian ${serviceNames[visaService] || 'e-Visa'}`,
            description: 'IndiaGoVisa.com — Professional visa application service',
          },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      customer_email: email,
      metadata: { applicationId },
      success_url: `${process.env.APP_URL}/#/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL}/#/apply`,
    });

    res.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
}
