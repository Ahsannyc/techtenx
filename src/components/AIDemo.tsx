'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Message {
  type: 'user' | 'ai';
  content: string;
  suggestions?: string[];
}

export default function AIDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'ai',
      content: 'Hi! 👋 I\'m your AI assistant. Tell me what you need, and I\'ll suggest the perfect TechTenX solution for you.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mock AI responses based on keywords
  const getAISuggestion = (userInput: string): Message => {
    const input_lower = userInput.toLowerCase();

    // Email automation
    if (input_lower.includes('email') || input_lower.includes('inbox')) {
      return {
        type: 'ai',
        content: 'Great! I recommend our **Email Automation Agent**:',
        suggestions: [
          '✓ AI Email Classifier - Automatically categorize & prioritize emails',
          '✓ Smart Workflow - Route important emails to the right team',
          '✓ Time Saved - 5-10 hours per week on email management',
          '→ Get Started: $29/month with Starter plan'
        ]
      };
    }

    // Customer support
    if (input_lower.includes('customer support') || input_lower.includes('support chat') || input_lower.includes('chatbot')) {
      return {
        type: 'ai',
        content: 'Perfect! I recommend our **AI Customer Support Agent**:',
        suggestions: [
          '✓ 24/7 Support Bot - Handles 80% of customer tickets automatically',
          '✓ Smart Escalation - Complex issues go to your team',
          '✓ Cost Savings - Reduce support costs by 40-60%',
          '→ Enterprise solution with dedicated support'
        ]
      };
    }

    // Website building
    if (input_lower.includes('website') || input_lower.includes('landing page') || input_lower.includes('build site')) {
      return {
        type: 'ai',
        content: 'Excellent! I recommend our **AI-Powered Website Builder**:',
        suggestions: [
          '✓ AI Generation - Describe your site, we build it in minutes',
          '✓ Custom Design - Choose from 100+ templates or go fully custom',
          '✓ SEO Ready - Built-in optimization for search engines',
          '→ Start Free: Launch your first site today'
        ]
      };
    }

    // Social media automation
    if (input_lower.includes('social') || input_lower.includes('instagram') || input_lower.includes('twitter') || input_lower.includes('linkedin')) {
      return {
        type: 'ai',
        content: 'Great idea! I recommend our **Social Media Automation**:',
        suggestions: [
          '✓ Content Scheduler - Auto-post to all platforms',
          '✓ AI Copywriting - Generate engaging captions with AI',
          '✓ Growth Analytics - Track performance across channels',
          '→ Included in Pro plan ($99/month)'
        ]
      };
    }

    // Sales/lead generation
    if (input_lower.includes('sales') || input_lower.includes('leads') || input_lower.includes('forecast')) {
      return {
        type: 'ai',
        content: 'Smart! I recommend our **AI Sales Agent System**:',
        suggestions: [
          '✓ Lead Scoring - AI ranks leads by conversion probability',
          '✓ Pipeline Optimizer - Predict deal closure rates',
          '✓ Revenue Growth - Increase win rate by 15-30%',
          '→ Enterprise plan with custom training'
        ]
      };
    }

    // Document/file processing
    if (input_lower.includes('document') || input_lower.includes('invoice') || input_lower.includes('contract')) {
      return {
        type: 'ai',
        content: 'Perfect! I recommend our **Document Automation Agent**:',
        suggestions: [
          '✓ AI Extraction - Parse documents and extract data automatically',
          '✓ Auto-filing - Route documents to correct folders/teams',
          '✓ Compliance Ready - Secure handling of sensitive info',
          '→ Enterprise solution with HIPAA/GDPR compliance'
        ]
      };
    }

    // Default/general
    return {
      type: 'ai',
      content: 'Interesting! Based on your need, here\'s what I suggest:',
      suggestions: [
        '✓ **Option 1:** Custom AI Agent - Tailored to your exact workflow',
        '✓ **Option 2:** Automation Workflow - Connect your existing tools',
        '✓ **Option 3:** Complete Solution - AI Agent + Website + Automation',
        '→ Let\'s discuss your needs in detail!'
      ]
    };
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = { type: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI thinking
    setTimeout(() => {
      const aiResponse = getAISuggestion(input);
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-40 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-semibold text-white shadow-lg hover:scale-110 transition-all"
      >
        💬 Try AI Demo
      </button>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 z-40 w-96 h-[500px] bg-zinc-900 border border-white/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">TechTenX AI Assistant</h3>
          <p className="text-sm text-white/80">Powered by Claude</p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-3 rounded-lg ${
                msg.type === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-zinc-800 text-gray-100 rounded-bl-none'
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.content}</p>
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/20 space-y-1">
                  {msg.suggestions.map((suggestion, sidx) => (
                    <p key={sidx} className="text-xs text-gray-300">
                      {suggestion}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-zinc-800 text-gray-400 px-4 py-3 rounded-lg rounded-bl-none">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-white/10 p-4 bg-zinc-950">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tell me what you need..."
            className="flex-1 bg-zinc-800 text-white px-4 py-2 rounded-lg border border-white/10 focus:border-blue-500 focus:outline-none text-sm"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Send
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">Try: "automate email", "customer support", "build website"</p>
      </div>
    </div>
  );
}
