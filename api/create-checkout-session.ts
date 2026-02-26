import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const PRICES: Record<string, number> = {
  etourist_30: 4900,
  etourist_1y: 6900,
  etourist_5y: 9900,
  emedical: 7900,
  ebusiness: 7900,
  econference: 6900,
  emedical_attendant: 5900,
  eayush: 7900,
  eayush_attendant: 5900,
  estudent: 6900,
  estudent_dependent: 6900,
  eentry: 6900,
  efilm: 7900,
  emountaineering: 6900,
  etransit: 4900,
  eproduction: 7900,
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { applicationId, visaService, email, totalPrice, nationality } = req.body;
    // Use totalPrice from frontend (gov fee + service fee), fallback to PRICES
    const amount = totalPrice ? Math.round(totalPrice * 100) : (PRICES[visaService] || 4900);

    const serviceNames: Record<string, string> = {
      etourist_30: 'e-Tourist Visa (30 Days)',
      etourist_1y: 'e-Tourist Visa (1 Year)',
      etourist_5y: 'e-Tourist Visa (5 Years)',
      emedical: 'e-Medical Visa',
      ebusiness: 'e-Business Visa',
      econference: 'e-Conference Visa',
      emedical_attendant: 'e-Medical Attendant Visa',
      eayush: 'e-Ayush Visa',
      eayush_attendant: 'e-Ayush Attendant',
      estudent: 'e-Student Visa',
      estudent_dependent: 'e-Student Dependent',
      eentry: 'e-Entry Visa',
      efilm: 'e-Film Visa',
      emountaineering: 'e-Mountaineering Visa',
      etransit: 'e-Transit Visa',
      eproduction: 'e-Production Investment Visa',
    };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Indian ${serviceNames[visaService] || 'e-Visa'}`,
            description: 'IndiaGoVisa.com â Professional visa application service',
          },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      customer_email: email,
      metadata: { applicationId, visaService, visaName: serviceNames[visaService] || 'e-Visa' },
      success_url: `https://indiagovisa.com/#/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://indiagovisa.com/#/apply`,
    });

    res.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
}
