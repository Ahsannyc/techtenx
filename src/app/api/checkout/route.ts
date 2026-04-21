import { getSession } from '@auth0/nextjs-auth0';
import { createCheckoutSession, PRODUCTS } from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { plan } = await request.json();

    if (!plan || !['starter', 'pro', 'enterprise'].includes(plan)) {
      return Response.json(
        { error: 'Invalid plan' },
        { status: 400 }
      );
    }

    const priceId = PRODUCTS[plan.toUpperCase() as keyof typeof PRODUCTS];
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const checkoutSession = await createCheckoutSession(
      session.user.email || '',
      priceId,
      `${baseUrl}/dashboard/billing?success=true`,
      `${baseUrl}/dashboard/billing?canceled=true`
    );

    return Response.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return Response.json(
      { error: 'Checkout failed' },
      { status: 500 }
    );
  }
}
