'use client';

import React, { useState, useEffect } from 'react';

interface Testimonial {
  id: number;
  name: string;
  title: string;
  company: string;
  quote: string;
  avatar: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Martinez',
    title: 'Freelance Designer',
    company: 'Independent',
    quote: 'TechTenX saved me 15 hours every week. I automated my entire email workflow in minutes. Absolutely game-changing.',
    avatar: '👩‍💼',
    rating: 5
  },
  {
    id: 2,
    name: 'James Chen',
    title: 'VP Operations',
    company: 'TechCorp',
    quote: 'Our customer support costs dropped 40% after implementing the AI agent. It handles the easy stuff so our team focuses on complex issues.',
    avatar: '👨‍💼',
    rating: 5
  },
  {
    id: 3,
    name: 'Alex Johnson',
    title: 'Product Manager',
    company: 'StartupXYZ',
    quote: 'Built my entire portfolio website with AI. It looks professional and took just 1 day. No coding required!',
    avatar: '👨‍💻',
    rating: 5
  }
];

export default function TestimonialSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const testimonial = testimonials[current];

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-6 animate-in fade-in duration-500">
        <div className="text-6xl mb-6">{testimonial.avatar}</div>
        <p className="text-xl md:text-2xl text-white mb-6 italic">"{testimonial.quote}"</p>
        <div className="mb-4">
          <div className="flex justify-center gap-1">
            {[...Array(testimonial.rating)].map((_, i) => (
              <span key={i} className="text-yellow-400">★</span>
            ))}
          </div>
        </div>
        <p className="font-semibold text-lg">{testimonial.name}</p>
        <p className="text-gray-400">{testimonial.title} at {testimonial.company}</p>
      </div>
    </div>
  );
}

export { testimonials };
