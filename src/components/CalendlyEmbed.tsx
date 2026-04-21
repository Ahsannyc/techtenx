'use client';

export default function CalendlyEmbed() {
  // Replace YOUR-USERNAME with actual Calendly username
  const calendlyUsername = 'techtenx'; // Update this when Calendly account is created

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/10 to-purple-900/10 rounded-xl">
      <iframe
        src={`https://calendly.com/${calendlyUsername}/product-demo?hide_event_type_details=1&hide_gdpr_banner=1`}
        width="100%"
        height="600"
        frameBorder="0"
        title="Schedule a product demo with TechTenX"
        style={{ borderRadius: '8px', minHeight: '600px' }}
      />
    </div>
  );
}
