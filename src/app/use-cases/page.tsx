'use client';

import React from 'react';

export default function UseCases() {
  const caseStudies = [
    {
      company: 'ShopHub',
      industry: 'E-Commerce',
      challenge: 'Manual product descriptions took 40 hours/month',
      solution: 'AI-powered content generator + website builder',
      results: ['95% reduction in writing time', 'Launched 1,000 new products in 2 weeks', '25% increase in conversion rate'],
      quote: 'TechTenX transformed our product page creation.',
      author: 'John Malik, CEO ShopHub'
    },
    {
      company: 'IndieAI',
      industry: 'Solopreneur',
      challenge: 'No time for social media, emails, content creation',
      solution: 'Personal AI assistant + email automation',
      results: ['20 hours/week saved', '10x social media presence', 'Built personal brand with AI help'],
      quote: 'I feel like I have a team now. This is a game-changer for solopreneurs.',
      author: 'Alex Rivera, Founder IndieAI'
    },
    {
      company: 'SalesCorp',
      industry: 'B2B SaaS',
      challenge: 'Customer support costs rising, response times slow',
      solution: 'AI customer support agent + knowledge base',
      results: ['70% of tickets resolved without human', '5min avg response time (was 2 hours)', '$200K annual savings'],
      quote: 'Our support team actually has time to think now.',
      author: 'Lisa Wong, Support Director SalesCorp'
    },
    {
      company: 'CreativeStudio',
      industry: 'Agency',
      challenge: 'Building custom websites took 3-4 weeks per project',
      solution: 'AI website builder + custom integration',
      results: ['5x more projects per year', '60% faster turnaround', 'Higher profit margins'],
      quote: 'We tripled our capacity without hiring.',
      author: 'Marcus Brown, Founder CreativeStudio'
    },
    {
      company: 'HelpOrg',
      industry: 'Non-Profit',
      challenge: 'Limited budget, lots of manual donor emails',
      solution: 'Email automation + personalization AI',
      results: ['40% increase in donor retention', '2 staff hours freed up daily', '$50K additional annual donations'],
      quote: 'We can focus on our mission, not admin.',
      author: 'Emily Park, Director HelpOrg'
    },
    {
      company: 'ConsultHub',
      industry: 'Service Business',
      challenge: 'Lead qualification and follow-up was chaotic',
      solution: 'AI lead scorer + automated nurture workflows',
      results: ['3x more qualified leads', '40% increase in close rate', '$150K additional annual revenue'],
      quote: 'This system finds our best customers automatically.',
      author: 'David Kim, CEO ConsultHub'
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
            See TechTenX In Action
          </h1>
          <p className="text-xl text-gray-400">
            Real businesses, real results. From solopreneurs to enterprises.
          </p>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {caseStudies.map((study, idx) => (
              <div
                key={idx}
                className="bg-zinc-900 border border-white/10 rounded-3xl p-8 hover:border-blue-500/50 transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-semibold mb-1">{study.company}</h3>
                    <p className="text-sm text-blue-400">{study.industry}</p>
                  </div>
                </div>

                {/* Challenge & Solution */}
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Challenge</p>
                    <p className="text-gray-300">{study.challenge}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Solution</p>
                    <p className="text-gray-300">{study.solution}</p>
                  </div>
                </div>

                {/* Results */}
                <div className="border-t border-white/10 pt-6 mb-6">
                  <p className="text-xs uppercase tracking-widest text-green-400 font-semibold mb-3">Results</p>
                  <ul className="space-y-2">
                    {study.results.map((result, ridx) => (
                      <li key={ridx} className="text-gray-300 flex items-start gap-2">
                        <span className="text-green-400 mt-1">✓</span>
                        <span>{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quote */}
                <div className="border-t border-white/10 pt-6">
                  <p className="text-gray-300 italic mb-3">"{study.quote}"</p>
                  <p className="text-sm text-gray-500">{study.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-20 bg-zinc-950 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-semibold mb-16">Real Results Across Industries</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-5xl font-bold text-blue-400 mb-2">500+</div>
              <p className="text-gray-400">Active Users</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-green-400 mb-2">$50M+</div>
              <p className="text-gray-400">Revenue Generated</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-purple-400 mb-2">10K+</div>
              <p className="text-gray-400">Hours Saved</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-semibold mb-8">Ready for Your Success Story?</h2>
          <p className="text-xl text-gray-400 mb-10">
            Join hundreds of businesses and individuals who've transformed their operations with TechTenX.
          </p>
          <a
            href="/pricing"
            className="inline-block px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-semibold hover:scale-105 transition-all"
          >
            Start Free Today
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 text-center text-sm text-gray-500">
        © 2026 TechTenX. Building the future, one AI system at a time.
      </footer>
    </main>
  );
}
