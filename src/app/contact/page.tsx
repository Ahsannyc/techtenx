'use client';

import React, { useState } from 'react';
import CalendlyEmbed from '@/components/CalendlyEmbed';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
    phone: '',
    planInterest: 'Not Sure'
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          company: '',
          message: '',
          phone: '',
          planInterest: 'Not Sure'
        });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
            <a href="/" className="hover:text-blue-400 transition-colors">Home</a>
            <a href="/pricing" className="hover:text-blue-400 transition-colors">Pricing</a>
            <a href="/contact" className="text-blue-400">Contact</a>
          </div>

          <a href="/pricing" className="px-6 py-2.5 bg-white text-black font-medium rounded-full hover:bg-white/90 transition-all">
            Get Started
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6">
            Let's Build Your AI Future
          </h1>
          <p className="text-xl text-gray-400">
            Questions? Want a demo? Let's chat. We're here to help.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8">
              <h2 className="text-3xl font-semibold mb-8">Send us a Message</h2>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">✓</div>
                  <h3 className="text-2xl font-semibold mb-2">Thanks!</h3>
                  <p className="text-gray-400">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Company</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                      placeholder="Your company"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Interested in Plan</label>
                    <select
                      name="planInterest"
                      value={formData.planInterest}
                      onChange={handleChange}
                      className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option>Not Sure</option>
                      <option>Starter - $29/mo</option>
                      <option>Pro - $99/mo</option>
                      <option>Enterprise - Custom</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none h-32"
                      placeholder="Tell us about your needs..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* Calendly & Info */}
            <div>
              <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 mb-8">
                <h2 className="text-3xl font-semibold mb-4">Schedule a Demo</h2>
                <p className="text-gray-400 mb-6">
                  See TechTenX in action. Our team will show you exactly how we can help.
                </p>
                <CalendlyEmbed />
              </div>

              <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8">
                <h2 className="text-2xl font-semibold mb-6">Other Ways to Reach Us</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-500 text-sm">Email</p>
                    <p className="text-blue-400 font-semibold">contact@techtenx.com</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Response Time</p>
                    <p className="text-gray-300">24 hours during business days</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Follow Us</p>
                    <div className="flex gap-4 mt-2">
                      <a href="#" className="text-blue-400 hover:text-blue-300">Twitter</a>
                      <a href="#" className="text-blue-400 hover:text-blue-300">LinkedIn</a>
                      <a href="#" className="text-blue-400 hover:text-blue-300">GitHub</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
