import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, message, phone, planInterest } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send email to admin
    await resend.emails.send({
      from: 'noreply@techtenx.com',
      to: 'admin@techtenx.com',
      subject: `New Contact Form Submission: ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || 'N/A'}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <p><strong>Plan Interest:</strong> ${planInterest || 'Not Sure'}</p>
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr />
        <p><small>Reply to: ${email}</small></p>
      `
    });

    // Send confirmation email to user
    await resend.emails.send({
      from: 'noreply@techtenx.com',
      to: email,
      subject: 'We Received Your Message - TechTenX',
      html: `
        <h2>Thank You, ${name}!</h2>
        <p>We received your message and appreciate your interest in TechTenX.</p>
        <p>Our team will get back to you within 24 hours during business days.</p>
        <hr />
        <h3>Your Message:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr />
        <p>
          <strong>In the meantime:</strong><br />
          • Check out our <a href="https://techtenx.com/blog">blog</a> for tips<br />
          • Book a demo: <a href="https://calendly.com/techtenx/product-demo">Schedule Here</a><br />
          • View pricing: <a href="https://techtenx.com/pricing">See Plans</a>
        </p>
        <p>
          Best regards,<br />
          The TechTenX Team
        </p>
      `
    });

    return Response.json(
      { success: true, message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email send error:', error);
    return Response.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
