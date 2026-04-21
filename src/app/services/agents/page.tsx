'use client';

import React from 'react';

export default function AgentsService() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">T</div>
            <span className="font-semibold text-2xl tracking-tight">TechTenX</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="/#services" className="hover:text-blue-400">Services</a>
            <a href="/pricing" className="hover:text-blue-400">Pricing</a>
          </div>
          <a href="/contact" className="px-6 py-2.5 bg-white text-black font-medium rounded-full hover:bg-white/90">Get Started</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6">AI Agents & Assistants</h1>
          <p className="text-xl text-gray-400 mb-8">Smart agents that work 24/7 for you, handling any task you throw at them.</p>
          <a href="/pricing" className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-semibold">Start Building</a>
        </div>
      </section>

      {/* What It Is */}
      <section className="px-6 py-20 bg-zinc-950 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-semibold mb-8">What Are AI Agents?</h2>
          <p className="text-gray-400 text-lg mb-8">AI Agents are intelligent programs that work independently on your behalf. They learn your preferences, understand context, and take action without human intervention.</p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-zinc-900 p-6 rounded-2xl border border-white/10">
              <h3 className="text-xl font-semibold mb-3">🧠 Autonomous</h3>
              <p className="text-gray-400">They think, decide, and act on their own</p>
            </div>
            <div className="bg-zinc-900 p-6 rounded-2xl border border-white/10">
              <h3 className="text-xl font-semibold mb-3">🔄 Adaptive</h3>
              <p className="text-gray-400">They improve over time based on feedback</p>
            </div>
            <div className="bg-zinc-900 p-6 rounded-2xl border border-white/10">
              <h3 className="text-xl font-semibold mb-3">⚡ Always On</h3>
              <p className="text-gray-400">24/7 availability without breaks</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-semibold mb-16 text-center">How It Works</h2>
          <div className="space-y-8">
            <div className="flex gap-8">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 font-bold text-lg">1</div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">Define Your Need</h3>
                <p className="text-gray-400">Describe what you want automated. Our AI understands your exact requirements.</p>
              </div>
            </div>
            <div className="flex gap-8">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 font-bold text-lg">2</div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">AI Plans the Agent</h3>
                <p className="text-gray-400">We suggest tools, workflows, and integrations tailored to your use case.</p>
              </div>
            </div>
            <div className="flex gap-8">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 font-bold text-lg">3</div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">Deploy & Monitor</h3>
                <p className="text-gray-400">Your agent runs 24/7. You monitor, optimize, and scale as needed.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="px-6 py-20 bg-zinc-950 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-semibold mb-16 text-center">Popular Agent Types</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-zinc-900 p-6 rounded-2xl border border-white/10">
              <h3 className="font-semibold text-lg mb-2">✉️ Email Agent</h3>
              <p className="text-gray-400">Triage, categorize, and respond to emails</p>
            </div>
            <div className="bg-zinc-900 p-6 rounded-2xl border border-white/10">
              <h3 className="font-semibold text-lg mb-2">🎧 Support Agent</h3>
              <p className="text-gray-400">Handle customer support tickets 24/7</p>
            </div>
            <div className="bg-zinc-900 p-6 rounded-2xl border border-white/10">
              <h3 className="font-semibold text-lg mb-2">💼 Sales Agent</h3>
              <p className="text-gray-400">Qualify leads and drive pipeline growth</p>
            </div>
            <div className="bg-zinc-900 p-6 rounded-2xl border border-white/10">
              <h3 className="font-semibold text-lg mb-2">📊 Analytics Agent</h3>
              <p className="text-gray-400">Monitor metrics and alert on anomalies</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-semibold mb-12 text-center">FAQ</h2>
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-6">
              <h3 className="text-xl font-semibold mb-3 text-blue-400">Can agents access my data safely?</h3>
              <p className="text-gray-400">Yes. All agents run with encryption, SOC2 compliance, and GDPR adherence. Your data never leaves our secure infrastructure.</p>
            </div>
            <div className="border-b border-white/10 pb-6">
              <h3 className="text-xl font-semibold mb-3 text-blue-400">How long to set up an agent?</h3>
              <p className="text-gray-400">Minutes. Describe your need → AI builds the agent → Deploy. Most users are live within hours.</p>
            </div>
            <div className="pb-6">
              <h3 className="text-xl font-semibold mb-3 text-blue-400">What if I need custom logic?</h3>
              <p className="text-gray-400">Our platform supports custom workflows, API integrations, and white-label solutions for Enterprise plans.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-semibold mb-8">Ready to Deploy Your First Agent?</h2>
          <a href="/pricing" className="inline-block px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-semibold hover:scale-105">Start Free</a>
        </div>
      </section>

      <footer className="py-12 border-t border-white/10 text-center text-sm text-gray-500">© 2026 TechTenX.</footer>
    </main>
  );
}
