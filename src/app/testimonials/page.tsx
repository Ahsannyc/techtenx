'use client';

import React from 'react';

export default function TestimonialsPage() {
  const testimonials = [
    {
      name: 'Sarah Martinez',
      title: 'Freelance Designer',
      company: 'Independent',
      industry: 'Creative',
      quote: 'TechTenX saved me 15 hours every week. I automated my entire email workflow in minutes.',
      avatar: '👩‍💼',
      rating: 5
    },
    {
      name: 'James Chen',
      title: 'VP Operations',
      company: 'TechCorp',
      industry: 'SaaS',
      quote: 'Our customer support costs dropped 40% after implementing the AI agent.',
      avatar: '👨‍💼',
      rating: 5
    },
    {
      name: 'Alex Johnson',
      title: 'Product Manager',
      company: 'StartupXYZ',
      industry: 'Tech',
      quote: 'Built my entire portfolio website with AI. It looks professional and took just 1 day.',
      avatar: '👨‍💻',
      rating: 5
    },
    {
      name: 'Emily Park',
      title: 'Executive Director',
      company: 'HelpOrg',
      industry: 'Non-Profit',
      quote: 'We can focus on our mission, not admin work. Email automation saved us hours daily.',
      avatar: '👩‍🦰',
      rating: 5
    },
    {
      name: 'Marcus Brown',
      title: 'Founder',
      company: 'CreativeStudio',
      industry: 'Agency',
      quote: 'We tripled our capacity without hiring. The AI website builder is incredible.',
      avatar: '👨‍🦱',
      rating: 5
    },
    {
      name: 'Lisa Wong',
      title: 'Support Director',
      company: 'SalesCorp',
      industry: 'Sales',
      quote: 'Our support team actually has time to think now. Response times dropped from 2 hours to 5 minutes.',
      avatar: '👩‍🏫',
      rating: 5
    },
    {
      name: 'David Kim',
      title: 'CEO',
      company: 'ConsultHub',
      industry: 'Consulting',
      quote: 'This system finds our best customers automatically. Close rate increased by 40%.',
      avatar: '👨‍⚖️',
      rating: 5
    },
    {
      name: 'Rachel Green',
      title: 'Marketing Manager',
      company: 'BrandCo',
      industry: 'Marketing',
      quote: 'Social media automation is incredible. We post 10x more content with less effort.',
      avatar: '👱‍♀️',
      rating: 5
    },
    {
      name: 'Tom Wilson',
      title: 'E-Commerce Owner',
      company: 'ShopHub',
      industry: 'E-Commerce',
      quote: 'Product descriptions used to take 40 hours/month. Now, AI generates them in minutes.',
      avatar: '👴',
      rating: 5
    },
    {
      name: 'Jessica Lee',
      title: 'Content Creator',
      company: 'Digital Creators',
      industry: 'Content',
      quote: 'The content creator assistant helps me write 3x faster. Game changer for my productivity.',
      avatar: '👩‍🎨',
      rating: 5
    },
    {
      name: 'John Smith',
      title: 'Operations Lead',
      company: 'TechWare',
      industry: 'Manufacturing',
      quote: 'Streamlined our entire workflow. Document processing automation alone saves $50K/year.',
      avatar: '👨‍🔧',
      rating: 5
    },
    {
      name: 'Nicole Davis',
      title: 'HR Manager',
      company: 'PeopleFirst',
      industry: 'HR Tech',
      quote: 'Automation freed up my team to focus on strategic HR work. Best investment we made.',
      avatar: '👩‍💼',
      rating: 5
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
            <a href="/pricing" className="hover:text-blue-400">Pricing</a>
          </div>
          <a href="/contact" className="px-6 py-2.5 bg-white text-black font-medium rounded-full hover:bg-white/90">Get Started</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6">What Our Users Say</h1>
          <p className="text-xl text-gray-400">Trusted by 500+ individuals and businesses worldwide</p>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-zinc-900 border border-white/10 rounded-2xl p-6 hover:border-blue-500/50 transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.title}</p>
                    <p className="text-xs text-blue-400">{testimonial.company}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-gray-300 italic mb-4">"{testimonial.quote}"</p>
                <span className="text-xs bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full inline-block">{testimonial.industry}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 py-20 bg-zinc-950 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-semibold mb-16">The Impact</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-5xl font-bold text-blue-400 mb-2">500+</div>
              <p className="text-gray-400">Happy Users</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-green-400 mb-2">4.9/5</div>
              <p className="text-gray-400">Average Rating</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-purple-400 mb-2">50K+</div>
              <p className="text-gray-400">Hours Saved</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-semibold mb-8">Ready to Join Them?</h2>
          <p className="text-xl text-gray-400 mb-10">See why 500+ users trust TechTenX</p>
          <a href="/pricing" className="inline-block px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-semibold hover:scale-105">Start Free Today</a>
        </div>
      </section>

      <footer className="py-12 border-t border-white/10 text-center text-sm text-gray-500">© 2026 TechTenX.</footer>
    </main>
  );
}
