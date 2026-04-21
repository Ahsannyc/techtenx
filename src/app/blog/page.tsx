'use client';

import React from 'react';
import NewsletterSignup from '@/components/NewsletterSignup';

export default function BlogPage() {
  const posts = [
    {
      slug: 'how-to-build-ai-agents',
      title: 'How to Build AI Agents in 2026: A Complete Guide',
      excerpt: 'Learn everything you need to know about designing, building, and deploying AI agents.',
      date: 'Mar 15, 2026',
      readTime: 12,
      category: 'Tutorial',
      image: '🤖'
    },
    {
      slug: 'email-automation-guide',
      title: 'Save 20 Hours/Week: Automating Your Email Workflow',
      excerpt: 'Step-by-step guide to automate email management and reclaim 20+ hours every week.',
      date: 'Mar 10, 2026',
      readTime: 8,
      category: 'How-To',
      image: '✉️'
    },
    {
      slug: 'ai-website-tools',
      title: 'The 5 AI Tools That Changed How We Build Websites',
      excerpt: 'Review of the best AI website builders and when to use custom development instead.',
      date: 'Mar 5, 2026',
      readTime: 10,
      category: 'Review',
      image: '🌐'
    },
    {
      slug: 'business-needs-ai',
      title: 'Why Your Business Needs AI Automation (And It\'s Easier Than You Think)',
      excerpt: 'Business case for AI automation with ROI calculations and implementation strategies.',
      date: 'Feb 28, 2026',
      readTime: 9,
      category: 'Strategy',
      image: '📈'
    },
    {
      slug: 'choosing-ai-solution',
      title: 'From No-Code to Custom: Choosing the Right AI Solution',
      excerpt: 'Decision framework for choosing between no-code, low-code, and custom AI solutions.',
      date: 'Feb 20, 2026',
      readTime: 11,
      category: 'Guide',
      image: '🎯'
    },
    {
      slug: 'ai-customer-support',
      title: 'Building an AI Customer Support System: The Complete Checklist',
      excerpt: 'Everything you need to know to deploy an AI customer support agent.',
      date: 'Feb 15, 2026',
      readTime: 14,
      category: 'Tutorial',
      image: '🎧'
    }
  ];

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
            <a href="/" className="hover:text-blue-400">Home</a>
            <a href="/blog" className="text-blue-400">Blog</a>
            <a href="/pricing" className="hover:text-blue-400">Pricing</a>
          </div>
          <a href="/contact" className="px-6 py-2.5 bg-white text-black font-medium rounded-full hover:bg-white/90">Get Started</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6">TechTenX Blog</h1>
          <p className="text-xl text-gray-400">Learn how to build AI agents, automate workflows, and transform your business.</p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-3xl p-8">
          <div className="text-6xl mb-6">{posts[0].image}</div>
          <div className="inline-block px-3 py-1 bg-blue-600 rounded-full text-xs font-semibold mb-4">{posts[0].category}</div>
          <h2 className="text-4xl font-bold mb-4">{posts[0].title}</h2>
          <p className="text-gray-300 text-lg mb-6">{posts[0].excerpt}</p>
          <div className="flex items-center gap-4 text-gray-400 text-sm">
            <span>{posts[0].date}</span>
            <span>•</span>
            <span>{posts[0].readTime} min read</span>
          </div>
          <a href={`/blog/${posts[0].slug}`} className="inline-block mt-6 px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700">Read Article →</a>
        </div>
      </section>

      {/* All Posts */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold mb-12">Latest Articles</h2>
          <div className="space-y-8">
            {posts.slice(1).map((post, idx) => (
              <div key={idx} className="border-b border-white/10 pb-8 hover:bg-zinc-900/30 p-6 rounded-xl transition-all group">
                <div className="flex items-start gap-6">
                  <div className="text-5xl flex-shrink-0">{post.image}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs bg-blue-900/40 text-blue-300 px-3 py-1 rounded-full">{post.category}</span>
                      <span className="text-xs text-gray-500">{post.date}</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">{post.readTime} min read</span>
                    </div>
                    <h3 className="text-2xl font-semibold mb-2 group-hover:text-blue-400 transition-colors">{post.title}</h3>
                    <p className="text-gray-400 mb-4">{post.excerpt}</p>
                    <a href={`/blog/${post.slug}`} className="text-blue-400 hover:text-blue-300 font-semibold text-sm">Read More →</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="px-6 py-20 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <NewsletterSignup />
        </div>
      </section>

      <footer className="py-12 border-t border-white/10 text-center text-sm text-gray-500">© 2026 TechTenX.</footer>
    </main>
  );
}
