import React, { useState, useEffect } from 'react';
import { useTitle } from '@/hooks/useTitle';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Star, CheckCircle2, ExternalLink, AlertCircle } from 'lucide-react';
import { Location } from '@/types';

const ISSUE_OPTIONS = ['Food quality', 'Service delay', 'Staff behaviour', 'Cleanliness', 'Other'];

type Step = 'rating' | 'positive' | 'negative' | 'success' | 'not-found';

export default function CustomerFeedbackPage() {
  const { slug } = useParams<{ slug: string }>();
  const [location, setLocation] = useState<Location | null>(null);
  useTitle(location?.name || 'Customer Feedback');
  const [loadingLocation, setLoadingLocation] = useState(true);

  const [step, setStep] = useState<Step>('rating');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const [issues, setIssues] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    async function fetchLocation() {
      if (!slug) return;
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('qr_slug', slug)
        .single();

      if (error || !data) {
        setStep('not-found');
      } else {
        setLocation(data);
      }
      setLoadingLocation(false);
    }
    fetchLocation();
  }, [slug]);

  async function handleRating(value: number) {
    setRating(value);
    // Store the feedback row immediately (positive path)
    if (value >= 4) {
      await supabase.from('feedback').insert({
        location_id: location!.id,
        rating: value,
      });
      setTimeout(() => setStep('positive'), 300);
    } else {
      setTimeout(() => setStep('negative'), 300);
    }
  }

  async function handleNegativeSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!location) return;
    setSubmitting(true);
    setSubmitError('');

    const { error } = await supabase.from('feedback').insert({
      location_id: location.id,
      rating,
      comment: comment || null,
      issues: issues.length > 0 ? issues : null,
      customer_phone: phone || null,
    });

    if (error) {
      setSubmitError('Something went wrong. Please try again.');
      setSubmitting(false);
    } else {
      setStep('success');
    }
  }

  function toggleIssue(issue: string) {
    setIssues(prev => prev.includes(issue) ? prev.filter(i => i !== issue) : [...prev, issue]);
  }

  function renderStars(
    currentRating: number,
    hoverValue: number,
    onClick: (val: number) => void,
    onHover: (val: number) => void,
    size = 44,
    spacing = 'gap-3'
  ) {
    return (
      <div className={`flex ${spacing}`}>
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = (hoverValue || currentRating) >= star;
          return (
            <button
              key={star}
              className="focus:outline-none transition-transform active:scale-90"
              onMouseEnter={() => onHover(star)}
              onMouseLeave={() => onHover(0)}
              onClick={() => onClick(star)}
            >
              <Star
                size={size}
                className="transition-colors"
                fill={isFilled ? '#FABB05' : 'transparent'}
                color={isFilled ? '#FABB05' : '#BDC1C6'}
                strokeWidth={isFilled ? 1 : 1.5}
              />
            </button>
          );
        })}
      </div>
    );
  }

  const Pill = ({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full border text-sm transition-colors ${
        selected ? 'bg-[#E8F0FE] border-[#E8F0FE] text-[#1967D2]' : 'bg-white border-[#DADCE0] text-[#3C4043] hover:bg-[#F8F9FA]'
      }`}
    >
      {label}
    </button>
  );

  if (loadingLocation) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#1A73E8] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (step === 'not-found') {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle size={48} className="text-[#EA4335] mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-[#202124] mb-2">Location not found</h1>
          <p className="text-[#5F6368] text-sm">This QR code may be invalid or expired.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#F8F9FA] flex flex-col items-center px-4 font-sans ${['success', 'positive', 'rating', 'negative'].includes(step) ? 'justify-center py-4' : 'py-8'}`}>

      {/* Positive → redirect to Google */}
      {step === 'positive' && (
        <div className="w-full max-w-[420px] bg-white rounded-[16px] shadow-[0_2px_10px_rgba(0,0,0,0.06)] p-6 m-auto animate-in fade-in duration-500">
          <div className="text-center mb-6">
            <h2 className="text-[16px] font-medium text-[#202124]">{location?.name}</h2>
          </div>
          <div className="flex flex-col items-center text-center mb-8">
            <div className="mb-4 w-16 h-16 bg-[#E8F0FE] rounded-full flex items-center justify-center animate-in zoom-in duration-500">
              <Star size={32} className="text-[#1A73E8] fill-[#1A73E8]" />
            </div>
            <h1 className="text-[22px] font-medium text-[#202124] mb-3">We're thrilled you loved it!</h1>
            <p className="text-[14px] text-[#5F6368] leading-relaxed px-2">
              Thank you for the {rating}-star rating. It would mean the world to our small team if you could share your experience on Google.
            </p>
          </div>
          <a
            href={`https://search.google.com/local/writereview?placeid=${location?.google_place_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-[#1A73E8] hover:bg-[#1557B0] text-white rounded-[24px] py-[14px] text-[16px] font-medium transition-colors active:scale-[0.98]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="bg-white rounded-full p-0.5">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Post review on Google
            <ExternalLink size={14} />
          </a>
        </div>
      )}

      {/* Negative → complaint form */}
      {step === 'negative' && (
        <div className="w-full max-w-[450px] bg-white rounded-2xl shadow-sm border border-[#E8EAED] overflow-hidden m-auto animate-in fade-in duration-500">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-[18px] font-medium text-[#202124]">{location?.name}</span>
              <a
                href={`https://search.google.com/local/writereview?placeid=${location?.google_place_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] text-[#9AA0A6] hover:underline hover:text-[#1A73E8] transition-colors"
              >
                Google Review
              </a>
            </div>

            <form onSubmit={handleNegativeSubmit}>
              {/* Star row */}
              <div className="mb-6">
                {renderStars(rating, hoveredRating, (v) => setRating(v), setHoveredRating, 36, 'gap-1')}
              </div>

              {/* Issues */}
              <div className="mb-6">
                <h3 className="text-[#202124] text-[15px] font-medium mb-3">What went wrong?</h3>
                <div className="flex flex-wrap gap-2">
                  {ISSUE_OPTIONS.map(option => (
                    <Pill key={option} label={option} selected={issues.includes(option)} onClick={() => toggleIssue(option)} />
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="mb-6">
                <h3 className="text-[#202124] text-[15px] font-medium mb-3">Share more about your experience</h3>
                <textarea
                  className="w-full border border-[#DADCE0] rounded-lg p-3 min-h-[100px] text-[15px] text-[#202124] placeholder:text-[#70757A] focus:outline-none focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] resize-none"
                  placeholder="Share details of your experience at this place"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                />
              </div>

              {/* Phone */}
              <div className="mb-6">
                <h3 className="text-[#202124] text-[15px] font-medium mb-2">We'd love to make this right for you - share your number so we can reach you.</h3>
                <input
                  type="tel"
                  placeholder="Phone number (to resolve this issue)"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full border border-[#DADCE0] rounded-lg p-3 text-[14px] text-[#202124] placeholder:text-[#9AA0A6] focus:outline-none focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] mb-1"
                />
                <p className="text-[12px] text-[#9AA0A6]">We will only use your number to follow up about your feedback.</p>
              </div>

              {submitError && (
                <p className="text-[13px] text-[#EA4335] mb-4">{submitError}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#1A73E8] hover:bg-[#1557B0] disabled:opacity-60 text-white rounded-full py-2.5 text-[15px] font-medium transition-colors"
              >
                {submitting ? 'Submitting...' : 'Post'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Rating step */}
      {step === 'rating' && (
        <div className="w-full max-w-[420px] bg-white rounded-[16px] shadow-[0_2px_10px_rgba(0,0,0,0.06)] p-6 m-auto animate-in fade-in duration-500">
          <div className="flex items-center gap-4 mb-6">
              <span className="text-[22px] text-[#202124] font-medium">{location?.name}</span>
            </div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              <div>
                <div className="text-[#202124] text-[15px] font-medium">Google User</div>
                <div className="text-[#5F6368] text-[13px]">Posting publicly</div>
              </div>
            </div>
            <div className="flex flex-col items-center mt-4 mb-4 animate-in fade-in duration-300">
              <h1 className="text-[24px] text-[#202124] mb-2">How was your experience?</h1>
              <p className="text-[#5F6368] text-[15px] mb-8">Tap a star to rate</p>
              {renderStars(rating, hoveredRating, handleRating, setHoveredRating)}
            </div>
          </div>
      )}

      {/* Success screen */}
      {step === 'success' && (
        <div className="w-full max-w-[420px] bg-white rounded-[16px] shadow-[0_2px_10px_rgba(0,0,0,0.06)] p-5 m-auto animate-in fade-in duration-500">
          <div className="text-center mb-5">
            <h2 className="text-[16px] font-medium text-[#202124]">{location?.name}</h2>
          </div>
          <div className="flex flex-col items-center text-center mb-6">
            <div className="mb-4 w-12 h-12 bg-[#1A73E8] rounded-xl flex items-center justify-center animate-in zoom-in duration-500 shadow-sm">
              <Star size={24} className="text-white fill-white" />
            </div>
            <h1 className="text-[22px] font-medium text-[#202124] mb-2">Thanks for your feedback</h1>
            <p className="text-[14px] text-[#5F6368] leading-relaxed">
              Your feedback helps us improve.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
