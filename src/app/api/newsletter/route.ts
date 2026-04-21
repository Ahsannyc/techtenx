import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// In production, store this in a database
const subscribers: Set<string> = new Set();

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return Response.json(
        { error: 'Invalid email' },
        { status: 400 }
      );
    }

    // Check if already subscribed
    if (subscribers.has(email)) {
      return Response.json(
        { error: 'Already subscribed' },
        { status: 400 }
      );
    }

    // Add to subscribers
    subscribers.add(email);

    // Send welcome email
    await resend.emails.send({
      from: 'noreply@techtenx.com',
      to: email,
      subject: 'Welcome to TechTenX Newsletter',
      html: `
        <h2>Welcome to TechTenX!</h2>
        <p>Thanks for subscribing to our newsletter. You'll now receive:</p>
        <ul>
          <li>Weekly AI automation tips</li>
          <li>New feature announcements</li>
          <li>Success stories from our users</li>
          <li>Exclusive guides and resources</li>
        </ul>
        <p>Stay tuned!</p>
      `
    });

    return Response.json(
      { success: true, message: 'Subscribed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter error:', error);
    return Response.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}
