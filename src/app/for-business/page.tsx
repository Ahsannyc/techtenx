'use client';

import React from 'react';

export default function ForBusiness() {
  const useCases = [
    {
      icon: '🎧',
      title: 'AI Customer Support Agent',
      desc: 'Handles 80% of support tickets automatically',
      roi: 'Save $50K+/year on support staff'
    },
    {
      icon: '📊',
      title: 'Sales Forecasting & Pipeline',
      desc: 'AI predicts deal closure rates and recommends actions',
      roi: 'Increase win rate by 15%'
    },
    {
      icon: '🎯',
      title: 'Lead Qualification & Routing',
      desc: 'AI scores leads and routes to best sales rep',
      roi: 'Close 2x more deals with same team'
    },
    {
      icon: '📝',
      title: 'Content Generation at Scale',
      desc: 'AI creates product descriptions, marketing copy, emails',
      roi: 'Launch 10x more content in half the time'
    },
    {
      icon: '📄',
      title: 'Invoice & Document Processing',
      desc: 'AI extracts data, validates, and auto-files documents',
      roi: 'Eliminate 100 manual hours/month'
    },
    {
      icon: '📦',
      title: 'Inventory & Supply Chain',
      desc: 'AI predicts demand, optimizes stock, alerts on anomalies',
      roi: 'Reduce overstock by 30%'
    }
  ];

  const features = [
    { text: 'Multi-agent orchestration (agents working together)' },
    { text: 'Custom AI training (fine-tune on your data)' },
    { text: 'White-label options (rebrand as your own)' },
    { text: 'SSO & enterprise security (GDPR, SOC2)' },
    { text: 'Dedicated account manager' },
    { text: 'SLA & 99.9% uptime guarantee' }
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
            <a href="/for-business" className="text-blue-400">For Business</a>
            <a href="/pricing" className="hover:text-blue-400 transition-colors">Pricing</a>
          </div>

          <a href="/contact" className="px-6 py-2.5 bg-white text-black font-medium rounded-full hover:bg-white/90 transition-all">
            Get Started
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-blue-400 font-semibold mb-4">Used by 100+ growing companies</p>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6">
            Enterprise AI Automation
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Scale without hiring. AI agents that work 24/7 for your business.
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-semibold hover:scale-105 transition-all"
          >
            Schedule Enterprise Demo
          </a>
        </div>
      </section>

      {/* Use Cases Grid */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-semibold text-center mb-16">Enterprise Use Cases</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, idx) => (
              <div
                key={idx}
                className="bg-zinc-900 border border-white/10 p-8 rounded-3xl hover:border-blue-500/50 hover:bg-zinc-800/50 transition-all group"
              >
                <div className="text-5xl mb-4">{useCase.icon}</div>
                <h3 className="text-2xl font-semibold mb-3">{useCase.title}</h3>
                <p className="text-gray-400 mb-6">{useCase.desc}</p>
                <div className="pt-6 border-t border-white/10">
                  <p className="text-sm text-green-400 font-semibold">💰 {useCase.roi}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Features */}
      <section className="px-6 py-20 bg-zinc-950 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-semibold text-center mb-16">Enterprise-Grade Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <span className="text-blue-400 text-xl mt-1">✓</span>
                <p className="text-gray-300 text-lg">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-3xl p-12 text-center">
          <p className="text-2xl text-white mb-6 italic">
            "TechTenX automated our customer support. Now we handle 5x more tickets with the same team."
          </p>
          <p className="font-semibold text-lg mb-2">Sarah Chen</p>
          <p className="text-gray-400">VP Operations, TechCorp</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-semibold mb-8">Ready to Transform Your Operations?</h2>
          <p className="text-xl text-gray-400 mb-10">
            Let's discuss how AI can drive growth and efficiency for your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-semibold hover:scale-105 transition-all"
            >
              Schedule Demo
            </a>
            <a
              href="/pricing"
              className="px-10 py-4 border border-white/30 rounded-2xl font-semibold hover:bg-white/5 transition-all"
            >
              View Enterprise Plans
            </a>
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
