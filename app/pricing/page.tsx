'use client';

import React from 'react';

export default function PricingPage() {
  const pricingPlans = [
    {
      name: 'Starter',
      price: 29,
      description: 'Perfect for individuals getting started with AI',
      features: [
        'Up to 3 AI Agents',
        'Email automation',
        'Basic website builder',
        '5 automations',
        'Community support',
        '1 GB storage'
      ],
      cta: 'Start Free',
      highlight: false
    },
    {
      name: 'Pro',
      price: 99,
      description: 'For growing teams and serious builders',
      features: [
        'Unlimited AI Agents',
        'Advanced automation workflows',
        'Custom website builder',
        '50 automations',
        'Priority email support',
        '100 GB storage',
        'Custom domain hosting',
        'Analytics dashboard'
      ],
      cta: 'Start Building',
      highlight: true
    },
    {
      name: 'Enterprise',
      price: null,
      description: 'Custom solutions for large organizations',
      features: [
        'Everything in Pro +',
        'Custom multi-agent systems',
        'Dedicated account manager',
        'White-label options',
        'SLA & 99.9% uptime',
        'Advanced security & compliance',
        'Custom integrations',
        'Priority support 24/7'
      ],
      cta: 'Schedule Demo',
      highlight: false
    }
  ];

  const faqs = [
    {
      question: 'Can I change plans anytime?',
      answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect at the end of your billing cycle.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes, all plans come with a 14-day free trial. No credit card required to start.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and ACH transfers for Enterprise plans.'
    },
    {
      question: 'Do you offer discounts for annual billing?',
      answer: 'Yes! Annual plans come with 20% discount. Contact sales for custom Enterprise pricing.'
    }
  ];

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              T
            </div>
            <span className="font-semibold text-2xl tracking-tight">TechTenX</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="/#services" className="hover:text-blue-400 transition-colors">Services</a>
            <a href="/for-individuals" className="hover:text-blue-400 transition-colors">For Individuals</a>
            <a href="/for-business" className="hover:text-blue-400 transition-colors">For Business</a>
            <a href="/pricing" className="text-blue-400">Pricing</a>
          </div>

          <a href="/contact" className="px-6 py-2.5 bg-white text-black font-medium rounded-full hover:bg-white/90 transition-all">
            Get Started
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include a 14-day free trial — no credit card required.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 lg:gap-6">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-3xl border transition-all ${
                  plan.highlight
                    ? 'border-blue-500 bg-gradient-to-br from-blue-900/20 to-purple-900/20 lg:scale-105 lg:shadow-2xl lg:shadow-blue-500/20'
                    : 'border-white/10 bg-zinc-900 hover:border-white/20'
                }`}
              >
                {/* Most Popular Badge */}
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Name */}
                  <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
                  <p className="text-gray-400 text-sm mb-6">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-8">
                    {plan.price !== null ? (
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-bold">${plan.price}</span>
                        <span className="text-gray-400">/month</span>
                      </div>
                    ) : (
                      <div className="text-3xl font-bold">Custom Pricing</div>
                    )}
                    <p className="text-gray-500 text-sm mt-2">Billed monthly. Save 20% with annual billing.</p>
                  </div>

                  {/* CTA Button */}
                  <a
                    href="/contact"
                    className={`block w-full py-3 px-6 rounded-2xl font-semibold text-center transition-all mb-8 ${
                      plan.highlight
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105'
                        : 'border border-white/30 hover:bg-white/5'
                    }`}
                  >
                    {plan.cta}
                  </a>

                  {/* Features List */}
                  <div className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <span className="text-blue-400 mt-1">✓</span>
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Compare All Features */}
          <div className="mt-20 text-center">
            <p className="text-gray-400 mb-6">
              Need a detailed feature comparison? <a href="#" className="text-blue-400 hover:underline">View full comparison table →</a>
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-20 bg-zinc-950 border-t border-white/10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-semibold text-center mb-16">Frequently Asked Questions</h2>

          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-white/10 pb-8">
                <h3 className="text-xl font-semibold mb-4 text-blue-400">{faq.question}</h3>
                <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-gray-400 mb-6">Still have questions?</p>
            <a href="/contact" className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-semibold hover:scale-105 transition-all">
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="px-6 py-16 text-center">
        <p className="text-gray-500 mb-8">Trusted by individuals & businesses</p>
        <div className="flex justify-center gap-8 flex-wrap">
          <div className="text-sm">
            <div className="text-2xl font-bold text-blue-400">500+</div>
            <p className="text-gray-400">Active Users</p>
          </div>
          <div className="text-sm">
            <div className="text-2xl font-bold text-blue-400">99.9%</div>
            <p className="text-gray-400">Uptime</p>
          </div>
          <div className="text-sm">
            <div className="text-2xl font-bold text-blue-400">$2M+</div>
            <p className="text-gray-400">Value Saved</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 text-center text-sm text-gray-500">
        © 2026 TechTenX. Building the future, one AI system at a time.
      </footer>
    </main>
  );
}
