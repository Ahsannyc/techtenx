import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

// Product IDs (from Stripe dashboard)
export const PRODUCTS = {
  STARTER: 'price_starter', // Will be replaced with actual Stripe price ID
  PRO: 'price_pro',
  ENTERPRISE: 'price_enterprise',
};

export async function createCheckoutSession(
  email: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
    });

    return session;
  } catch (error) {
    console.error('Stripe checkout error:', error);
    throw error;
  }
}

export async function getCustomerSubscriptions(customerId: string) {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 10,
    });

    return subscriptions.data;
  } catch (error) {
    console.error('Stripe subscriptions error:', error);
    throw error;
  }
}

export async function cancelSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    return subscription;
  } catch (error) {
    console.error('Stripe cancel error:', error);
    throw error;
  }
}
