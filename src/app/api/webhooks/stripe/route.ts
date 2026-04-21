import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  if (!webhookSecret) {
    return Response.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  const body = await request.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return Response.json(
      { error: 'Missing stripe-signature' },
      { status: 400 }
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return Response.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log('✓ Checkout completed:', session.id);
        console.log('  Customer:', session.customer_email);
        console.log('  Amount:', session.amount_total);
        // TODO: Update user subscription in database
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        console.log('✓ Invoice payment succeeded:', invoice.id);
        console.log('  Customer:', invoice.customer_email);
        // TODO: Log successful payment
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        console.log('✗ Invoice payment failed:', invoice.id);
        console.log('  Customer:', invoice.customer_email);
        // TODO: Send payment failure notification
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        console.log('✗ Subscription canceled:', subscription.id);
        // TODO: Update user subscription status in database
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        console.log('✓ Subscription updated:', subscription.id);
        console.log('  Status:', subscription.status);
        // TODO: Update user plan in database
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return Response.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
