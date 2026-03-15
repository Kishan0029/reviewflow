import React from 'react';
import { Link } from 'react-router-dom';
import { Star, QrCode, TrendingUp, Shield, CheckCircle2, ArrowRight, MessageSquare, BarChart3 } from 'lucide-react';

const HOW_IT_WORKS = [
  { step: '01', title: 'Sign up & add your cafe', desc: 'Create your account and add your cafe location with your Google Place ID in minutes.' },
  { step: '02', title: 'Print your QR code', desc: 'Download your unique QR code and place it on tables, receipts, or counters.' },
  { step: '03', title: 'Collect smarter feedback', desc: 'Happy customers get sent to Google Reviews. Unhappy ones are captured privately so you can fix it.' },
];

const BENEFITS = [
  { icon: TrendingUp, title: 'More Google Reviews', desc: 'Automatically redirect 4–5 star customers to your Google Reviews page.' },
  { icon: Shield, title: 'Protect your reputation', desc: 'Capture negative experiences privately before they become public 1-star reviews.' },
  { icon: MessageSquare, title: 'Resolve complaints fast', desc: 'Get instant alerts for negative feedback and contact unhappy customers directly.' },
  { icon: BarChart3, title: 'Actionable analytics', desc: 'Track trends, spot repeat issues, and measure improvement over time.' },
];

const PRICING = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    features: ['1 location', 'Unlimited feedback', 'QR code download', 'Basic dashboard'],
    cta: 'Get started free',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '₹999',
    period: 'per month',
    features: ['Up to 10 locations', 'Priority alerts', 'CSV export', 'WhatsApp integration', 'Advanced analytics'],
    cta: 'Start free trial',
    highlight: true,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-[#E8EAED]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1A73E8] rounded-lg flex items-center justify-center">
              <Star size={16} className="text-white fill-white" />
            </div>
            <span className="font-bold text-[#202124] text-lg tracking-tight">ReviewFlow</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/login" className="hidden sm:inline-flex text-sm font-medium text-[#5F6368] hover:text-[#202124] transition px-4 py-2 rounded-lg hover:bg-[#F8F9FA]">
              Sign in
            </Link>
            <Link to="/signup" className="text-sm font-medium bg-[#1A73E8] hover:bg-[#1557B0] text-white px-4 py-2 sm:px-5 rounded-full transition whitespace-nowrap">
              Get started <span className="hidden sm:inline ml-1">free</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#EBF3FD] to-white pt-20 pb-28 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-[#DADCE0] text-[#1A73E8] text-sm font-medium px-4 py-1.5 rounded-full mb-6 shadow-sm">
            <Star size={14} className="fill-[#FBBC04] text-[#FBBC04]" />
            Trusted by cafes across India
          </div>
          <h1 className="text-[52px] leading-[1.1] font-bold text-[#202124] mb-6 tracking-tight">
            Turn every customer into<br />
            <span className="text-[#1A73E8]">a Google Review</span>
          </h1>
          <p className="text-xl text-[#5F6368] leading-relaxed mb-10 max-w-xl mx-auto">
            ReviewFlow helps cafes and restaurants collect feedback, boost their Google rating, and resolve complaints before they go public.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/signup" className="flex items-center justify-center gap-2 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-semibold px-8 py-4 rounded-full text-base transition shadow-lg shadow-[#1A73E8]/25">
              Start for free <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="flex items-center justify-center gap-2 bg-white hover:bg-[#F8F9FA] text-[#202124] font-medium px-8 py-4 rounded-full text-base transition border border-[#DADCE0]">
              See demo
            </Link>
          </div>
          <p className="text-sm text-[#9AA0A6] mt-5">No credit card required. Free plan available.</p>
        </div>

        {/* Decorative blobs */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#1A73E8]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-[#FBBC04]/10 rounded-full blur-2xl pointer-events-none" />
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-[#202124] mb-3">How it works</h2>
            <p className="text-[#5F6368] text-lg">Set up in under 5 minutes. Start getting reviews today.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map(item => (
              <div key={item.step} className="relative">
                <div className="text-5xl font-bold text-[#E8F0FE] mb-4">{item.step}</div>
                <h3 className="text-lg font-semibold text-[#202124] mb-2">{item.title}</h3>
                <p className="text-[#5F6368] text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 px-6 bg-[#F8F9FA]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-[#202124] mb-3">Built for cafes & restaurants</h2>
            <p className="text-[#5F6368] text-lg">Everything you need to manage your online reputation.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {BENEFITS.map(item => (
              <div key={item.title} className="bg-white rounded-2xl p-6 border border-[#E8EAED] shadow-sm hover:shadow-md transition">
                <div className="w-10 h-10 bg-[#E8F0FE] rounded-xl flex items-center justify-center mb-4">
                  <item.icon size={20} className="text-[#1A73E8]" />
                </div>
                <h3 className="font-semibold text-[#202124] mb-1">{item.title}</h3>
                <p className="text-sm text-[#5F6368] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-[#202124] mb-3">Simple pricing</h2>
            <p className="text-[#5F6368] text-lg">Start free. Upgrade when you're ready.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {PRICING.map(plan => (
              <div key={plan.name} className={`flex flex-col rounded-2xl p-8 border ${plan.highlight ? 'bg-[#1A73E8] border-[#1A73E8] text-white shadow-xl shadow-[#1A73E8]/20' : 'bg-white border-[#E8EAED]'}`}>
                <p className={`text-sm font-medium mb-2 ${plan.highlight ? 'text-blue-200' : 'text-[#5F6368]'}`}>{plan.name}</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className={`text-sm ${plan.highlight ? 'text-blue-100' : 'text-[#9AA0A6]'}`}>/{plan.period}</span>
                </div>
                <ul className="space-y-2.5 my-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 size={16} className={plan.highlight ? 'text-blue-100' : 'text-[#34A853]'} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/signup"
                  className={`mt-auto block text-center font-medium py-3 rounded-xl text-sm transition ${plan.highlight ? 'bg-white text-[#1A73E8] hover:bg-blue-50' : 'bg-[#1A73E8] text-white hover:bg-[#1557B0]'}`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#1A73E8] to-[#1557B0] text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to grow your Google rating?</h2>
        <p className="text-blue-100 mb-8 text-lg max-w-xl mx-auto">Join cafes already using ReviewFlow to protect their reputation and get more 5-star reviews.</p>
        <Link to="/signup" className="inline-flex items-center gap-2 bg-white text-[#1A73E8] font-semibold px-8 py-4 rounded-full hover:bg-blue-50 transition text-base shadow-lg">
          Get started free <ArrowRight size={18} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[#E8EAED] text-center text-sm text-[#9AA0A6]">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 bg-[#1A73E8] rounded flex items-center justify-center">
            <Star size={12} className="text-white fill-white" />
          </div>
          <span className="font-semibold text-[#202124]">ReviewFlow</span>
        </div>
        <p>© {new Date().getFullYear()} ReviewFlow. All rights reserved.</p>
      </footer>
    </div>
  );
}
