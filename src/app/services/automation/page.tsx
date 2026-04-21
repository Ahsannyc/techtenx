'use client';

import React from 'react';

export default function AutomationService() {
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
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6">Workflow Automation</h1>
          <p className="text-xl text-gray-400 mb-8">Connect your tools, automate repetitive tasks, save hours every week.</p>
          <a href="/pricing" className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-semibold">Start Automating</a>
        </div>
      </section>

      {/* What It Is */}
      <section className="px-6 py-20 bg-zinc-950 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-semibold mb-8">No-Code & Custom Automation</h2>
          <p className="text-gray-400 text-lg mb-8">Connect your favorite tools with zero coding. From simple triggers to complex multi-step workflows, we've got you covered.</p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-zinc-900 p-6 rounded-2xl border border-white/10">
              <h3 className="text-xl font-semibold mb-3">🔗 1000+ Integrations</h3>
              <p className="text-gray-400">Works with all major tools you use daily</p>
            </div>
            <div className="bg-zinc-900 p-6 rounded-2xl border border-white/10">
              <h3 className="text-xl font-semibold mb-3">⚙️ Drag & Drop</h3>
              <p className="text-gray-400">Build workflows visually, no coding needed</p>
            </div>
            <div className="bg-zinc-900 p-6 rounded-2xl border border-white/10">
              <h3 className="text-xl font-semibold mb-3">📈 Smart Logic</h3>
              <p className="text-gray-400">Conditional logic, loops, and AI-powered steps</p>
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
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 font-bold">1</div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">Design Your Workflow</h3>
                <p className="text-gray-400">Pick a trigger (email received, form submitted, etc.) and define your steps.</p>
              </div>
            </div>
            <div className="flex gap-8">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 font-bold">2</div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">Add Integrations</h3>
                <p className="text-gray-400">Connect Slack, Gmail, Google Sheets, CRMs, payment platforms, and 1000+ other apps.</p>
              </div>
            </div>
            <div className="flex gap-8">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 font-bold">3</div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">Deploy & Monitor</h3>
                <p className="text-gray-400">Workflows run automatically. Monitor execution, logs, and results in real-time.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="px-6 py-20 bg-zinc-950 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-semibold mb-16 text-center">Popular Workflows</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-zinc-900 p-6 rounded-2xl border border-white/10">
              <h3 className="font-semibold text-lg mb-2">📱 Social Media Posting</h3>
              <p className="text-gray-400">Auto-post content to all platforms on a schedule</p>
            </div>
            <div className="bg-zinc-900 p-6 rounded-2xl border border-white/10">
              <h3 className="font-semibold text-lg mb-2">💰 Expense Tracking</h3>
              <p className="text-gray-400">Auto-categorize expenses and update your budget</p>
            </div>
            <div className="bg-zinc-900 p-6 rounded-2xl border border-white/10">
              <h3 className="font-semibold text-lg mb-2">📧 Email Management</h3>
              <p className="text-gray-400">Filter, forward, and organize emails automatically</p>
            </div>
            <div className="bg-zinc-900 p-6 rounded-2xl border border-white/10">
              <h3 className="font-semibold text-lg mb-2">📊 Data Syncing</h3>
              <p className="text-gray-400">Keep databases, spreadsheets, and CRMs in sync</p>
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
              <h3 className="text-xl font-semibold mb-3 text-blue-400">Do I need coding skills?</h3>
              <p className="text-gray-400">Nope! Our visual builder lets you create workflows by clicking. No coding required.</p>
            </div>
            <div className="border-b border-white/10 pb-6">
              <h3 className="text-xl font-semibold mb-3 text-blue-400">Can I use custom code?</h3>
              <p className="text-gray-400">Yes, Pro and Enterprise plans include custom code blocks for advanced logic.</p>
            </div>
            <div className="pb-6">
              <h3 className="text-xl font-semibold mb-3 text-blue-400">What if my tool isn't listed?</h3>
              <p className="text-gray-400">Use our Webhook integration to connect any tool via API. Enterprise plans get custom integrations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-semibold mb-8">Ready to Save Hours Every Week?</h2>
          <a href="/pricing" className="inline-block px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-semibold hover:scale-105">Start Free</a>
        </div>
      </section>

      <footer className="py-12 border-t border-white/10 text-center text-sm text-gray-500">© 2026 TechTenX.</footer>
    </main>
  );
}
