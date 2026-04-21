'use client';

import React from 'react';
import AIDemo from '@/components/AIDemo';
import TestimonialSlider from '@/components/TestimonialSlider';
import AnimatedTitle from '@/components/AnimatedTitle';
import AnimatedCard from '@/components/AnimatedCard';
import Navigation from '@/components/Navigation';
import NewsletterSignup from '@/components/NewsletterSignup';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6 relative">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full mb-6">
            <span className="text-xs uppercase tracking-widest text-blue-400">AI-Powered Solutions</span>
          </div>

          <AnimatedTitle className="text-6xl md:text-7xl font-bold tracking-tighter mb-6">
            AI Agents, Automation<br />
            &amp; Websites — <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Built for You</span>
          </AnimatedTitle>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            From personal AI assistants to enterprise automation and stunning AI-generated websites. 
            Turn ideas into intelligent systems in minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-semibold text-lg hover:scale-105 transition-all">
              Start Building Free
            </button>
            <button className="px-10 py-4 border border-white/30 rounded-2xl font-semibold text-lg hover:bg-white/5 transition-all">
              Watch 1-min Demo
            </button>
          </div>

          <div className="mt-16 text-sm text-gray-500">
            Trusted by individuals &amp; growing businesses
          </div>
        </div>
      </section>

      {/* Simple Services Teaser */}
      <section id="services" className="py-20 bg-zinc-950 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-semibold text-center mb-12">What We Build</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "AI Agents & Assistants", desc: "Smart agents that work 24/7 for you or your team" },
              { title: "AI Automation Workflows", desc: "No-code + custom automations that save hours every day" },
              { title: "AI-Powered Websites", desc: "Beautiful, fast websites generated or custom-built with AI" }
            ].map((service, i) => (
              <AnimatedCard key={i} className="bg-zinc-900 border border-white/10 p-8 rounded-3xl hover:border-blue-500/50 transition-all group">
                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-400">{service.desc}</p>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-semibold text-center mb-12">What Our Users Say</h2>
          <div className="min-h-80">
            <TestimonialSlider />
          </div>
          <div className="text-center mt-8">
            <a href="/testimonials" className="text-blue-400 hover:text-blue-300 font-semibold">
              Read all testimonials →
            </a>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <NewsletterSignup />
        </div>
      </section>

      <footer className="py-12 border-t border-white/10 text-center text-sm text-gray-500">
        © 2026 TechTenX. Building the future, one AI system at a time.
      </footer>

      {/* AI Demo Widget */}
      <AIDemo />
    </main>
  );
}