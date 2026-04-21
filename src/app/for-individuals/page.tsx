'use client';

import React from 'react';

export default function ForIndividuals() {
  const useCases = [
    {
      icon: '✉️',
      title: 'Email Triage Assistant',
      desc: 'AI automatically sorts, tags, and prioritizes emails',
      benefit: 'Saves 5 hrs/week'
    },
    {
      icon: '📱',
      title: 'Social Media Automation',
      desc: 'Schedule and auto-post to Twitter, LinkedIn, Instagram',
      benefit: 'Stay active without the grind'
    },
    {
      icon: '📚',
      title: 'Personal Learning Coach',
      desc: 'AI curates articles, summarizes research, creates study guides',
      benefit: 'Learn faster, retain more'
    },
    {
      icon: '💰',
      title: 'Expense & Budget Tracker',
      desc: 'AI categorizes spending, suggests savings, tracks goals',
      benefit: 'Financial clarity in minutes'
    },
    {
      icon: '✍️',
      title: 'Content Creator Assistant',
      desc: 'AI generates ideas, outlines, first drafts for blogs/newsletters',
      benefit: 'Write 3x faster'
    },
    {
      icon: '🎯',
      title: 'Habit Tracker & Coach',
      desc: 'AI monitors habits, sends reminders, celebrates wins',
      benefit: 'Build habits that stick'
    }
  ];

  const benefits = [
    { icon: '⚡', text: 'No coding required' },
    { icon: '🆓', text: 'Start free, upgrade anytime' },
    { icon: '🔗', text: 'Works with your favorite tools' },
    { icon: '🔒', text: 'Privacy first (your data stays yours)' }
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
            <a href="/for-individuals" className="text-blue-400">For Individuals</a>
            <a href="/for-business" className="hover:text-blue-400 transition-colors">For Business</a>
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
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6">
            AI Made Personal
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Automate your daily life, boost productivity, and achieve more — without the grind.
          </p>
          <a
            href="/pricing"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-semibold hover:scale-105 transition-all"
          >
            Start Your Free AI Assistant
          </a>
        </div>
      </section>

      {/* Use Cases Grid */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-semibold text-center mb-16">Your Personal AI Suite</h2>
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
                  <p className="text-sm text-blue-400 font-semibold">💡 {useCase.benefit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-6 py-20 bg-zinc-950 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-semibold mb-16">Why Choose TechTenX?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="text-center">
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <p className="text-xl text-gray-300">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-semibold mb-8">Ready to Reclaim Your Time?</h2>
          <p className="text-xl text-gray-400 mb-10">
            Join 500+ individuals who've already automated their lives with TechTenX.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/pricing"
              className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-semibold hover:scale-105 transition-all"
            >
              Start Free Today
            </a>
            <a
              href="/contact"
              className="px-10 py-4 border border-white/30 rounded-2xl font-semibold hover:bg-white/5 transition-all"
            >
              Schedule Demo
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
