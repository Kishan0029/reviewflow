import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Eye, EyeOff, Star } from 'lucide-react';

export default function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (signupError) {
      setError(signupError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      // Upsert profile (trigger should handle it, this is a fallback)
      await supabase.from('profiles').upsert({
        id: data.user.id,
        name,
        email,
      });
      navigate('/dashboard');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] via-white to-[#EBF3FD] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#1A73E8] rounded-xl flex items-center justify-center shadow-md">
              <Star size={20} className="text-white fill-white" />
            </div>
            <span className="text-xl font-bold text-[#202124] tracking-tight">ReviewFlow</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-[#E8EAED] p-8">
          <h1 className="text-2xl font-semibold text-[#202124] mb-1">Create your account</h1>
          <p className="text-[#5F6368] text-sm mb-6">Start collecting smarter feedback today — it's free</p>

          {error && (
            <div className="mb-4 p-3 bg-[#FCE8E6] border border-[#EA4335]/20 rounded-lg text-sm text-[#C5221F]">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#202124] mb-1.5">Your name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full border border-[#DADCE0] rounded-lg px-4 py-2.5 text-[15px] text-[#202124] placeholder:text-[#9AA0A6] focus:outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#202124] mb-1.5">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-[#DADCE0] rounded-lg px-4 py-2.5 text-[15px] text-[#202124] placeholder:text-[#9AA0A6] focus:outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#202124] mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full border border-[#DADCE0] rounded-lg px-4 py-2.5 pr-12 text-[15px] text-[#202124] placeholder:text-[#9AA0A6] focus:outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5F6368] hover:text-[#202124]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A73E8] hover:bg-[#1557B0] disabled:opacity-60 text-white font-medium rounded-xl py-3 text-[15px] transition-colors mt-2"
            >
              {loading ? 'Creating account...' : 'Create free account'}
            </button>
          </form>

          <p className="text-xs text-center text-[#9AA0A6] mt-4">
            By signing up you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>

        <p className="text-center text-sm text-[#5F6368] mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#1A73E8] font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
