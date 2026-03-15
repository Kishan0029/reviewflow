import React, { useState } from 'react';
import { X, Info, Star, CheckCircle2 } from 'lucide-react';

export default function CustomerFlow() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  
  const [subRatings, setSubRatings] = useState({
    food: 0,
    service: 0,
    atmosphere: 0
  });
  const [comment, setComment] = useState('');
  const [issues, setIssues] = useState<string[]>([]);
  const [phone, setPhone] = useState('');

  const handleRating = (value: number) => {
    setRating(value);
    if (step === 1) {
      // Small delay for visual feedback before transitioning
      setTimeout(() => {
        if (value >= 4) {
          setStep(4);
        } else {
          setStep(2);
        }
      }, 300);
    }
  };

  const toggleIssue = (issue: string) => {
    setIssues(prev => 
      prev.includes(issue) 
        ? prev.filter(i => i !== issue)
        : [...prev, issue]
    );
  };

  const renderStars = (
    currentRating: number, 
    hoverValue: number, 
    onClick: (val: number) => void, 
    onHover: (val: number) => void,
    size: number = 40,
    spacing: string = "gap-2"
  ) => {
    return (
      <div className={`flex ${spacing}`}>
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = (hoverValue || currentRating) >= star;
          return (
            <button
              key={star}
              className="focus:outline-none transition-transform active:scale-95"
              onMouseEnter={() => onHover(star)}
              onMouseLeave={() => onHover(0)}
              onClick={() => onClick(star)}
            >
              <Star
                size={size}
                className="transition-colors"
                fill={isFilled ? "#FABB05" : "transparent"}
                color={isFilled ? "#FABB05" : "#BDC1C6"}
                strokeWidth={isFilled ? 1 : 1.5}
              />
            </button>
          );
        })}
      </div>
    );
  };

  const Pill = ({ 
    label, 
    selected, 
    onClick 
  }: { 
    label: string; 
    selected: boolean; 
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full border text-sm transition-colors ${
        selected 
          ? 'bg-[#E8F0FE] border-[#E8F0FE] text-[#1967D2]' 
          : 'bg-white border-[#DADCE0] text-[#3C4043] hover:bg-[#F8F9FA]'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className={`min-h-screen bg-[#F8F9FA] flex flex-col items-center px-4 font-sans ${(step === 3 || step === 4) ? 'justify-center py-4' : 'py-8'}`}>
      {step === 4 ? (
        /* Step 4: Positive Feedback Completion */
        <div className="w-full max-w-[420px] bg-white rounded-[16px] shadow-[0_2px_10px_rgba(0,0,0,0.06)] p-6 m-auto animate-in fade-in duration-500">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-[16px] font-medium text-[#202124]">1969 Coffee House</h2>
          </div>

          {/* Success Icon & Title */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="mb-4 animate-in zoom-in duration-500 delay-150 fill-mode-both">
              <div className="w-16 h-16 bg-[#E8F0FE] rounded-full flex items-center justify-center">
                <Star size={32} className="text-[#1A73E8] fill-[#1A73E8]" />
              </div>
            </div>
            <h1 className="text-[22px] font-medium text-[#202124] mb-3">We're thrilled you loved it!</h1>
            <p className="text-[14px] text-[#5F6368] leading-relaxed px-2">
              Thank you for the {rating}-star rating. It would mean the world to our small team if you could take 10 seconds to share your experience on Google.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-2 bg-[#1A73E8] hover:bg-[#1557B0] text-white rounded-[24px] py-[14px] text-[16px] font-medium transition-colors active:scale-[0.98]">
              <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="bg-white rounded-full p-0.5">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Post review on Google
            </button>
          </div>
        </div>
      ) : step === 3 ? (
        /* Step 3: Negative Feedback Completion */
        <div className="w-full max-w-[420px] bg-white rounded-[16px] shadow-[0_2px_10px_rgba(0,0,0,0.06)] p-5 m-auto animate-in fade-in duration-500">
          {/* Header */}
          <div className="text-center mb-5">
            <h2 className="text-[16px] font-medium text-[#202124]">1969 Coffee House</h2>
          </div>

          {/* Success Icon & Title */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="mb-3 animate-in zoom-in duration-500 delay-150 fill-mode-both">
              <CheckCircle2 size={28} className="text-[#34A853]" />
            </div>
            <h1 className="text-[22px] font-medium text-[#202124] mb-2">Thanks for your feedback</h1>
            <p className="text-[14px] text-[#5F6368] leading-relaxed">
              Your feedback helps us improve.
            </p>
          </div>

          {/* Contact Option */}
          <div className="mb-6">
            <label className="block text-[14px] font-medium text-[#202124] mb-2 text-center">
              Would you like the manager to contact you?
            </label>
            <input 
              type="tel"
              placeholder="Phone number (optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-[#DADCE0] rounded-lg p-3 text-[14px] text-[#202124] placeholder:text-[#9AA0A6] focus:outline-none focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] transition-shadow mb-2"
            />
            <p className="text-[12px] text-[#9AA0A6]">
              We will only use your number to follow up about your feedback.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button className="w-full bg-[#1A73E8] hover:bg-[#1557B0] text-white rounded-[24px] py-[12px] text-[15px] font-medium transition-colors active:scale-[0.98]">
              Submit
            </button>
            <button onClick={() => setStep(1)} className="w-full bg-transparent text-[#1A73E8] hover:bg-[#F8F9FA] rounded-[24px] py-[12px] text-[14px] font-medium transition-colors active:scale-[0.98]">
              Skip
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-[450px] bg-white rounded-2xl shadow-sm border border-[#E8EAED] overflow-hidden">
          
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <button className="p-1 -ml-1 text-[#5F6368] hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} />
              </button>
              <span className="text-[22px] text-[#202124]">cafe</span>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm overflow-hidden flex-shrink-0">
                {/* Google G Logo SVG */}
                <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              <div>
                <div className="text-[#202124] text-[15px] font-medium leading-tight">Google User</div>
                <div className="text-[#5F6368] text-[13px] flex items-center gap-1 mt-0.5">
                  Posting publicly <Info size={14} className="text-[#5F6368]" />
                </div>
              </div>
            </div>

            {step === 1 ? (
              /* Step 1: Initial Rating */
              <div className="flex flex-col items-center mt-8 mb-4 animate-in fade-in duration-300">
                <h1 className="text-[24px] text-[#202124] mb-2">How was your experience?</h1>
                <p className="text-[#5F6368] text-[15px] mb-8">Tap a star to rate</p>
                {renderStars(rating, hoveredRating, handleRating, setHoveredRating, 44, "gap-3")}
              </div>
            ) : (
              /* Step 2: Detailed Feedback */
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-400">
                
                {/* Main Rating (Smaller) */}
                <div className="mb-8">
                  {renderStars(rating, hoveredRating, handleRating, setHoveredRating, 36, "gap-1")}
                </div>

                {/* Sub Ratings */}
                <div className="space-y-4 mb-8">
                  {(['food', 'service', 'atmosphere'] as const).map((category) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-[#202124] text-[15px] capitalize">{category}</span>
                      {renderStars(
                        subRatings[category], 
                        0, 
                        (val) => setSubRatings(prev => ({ ...prev, [category]: val })), 
                        () => {}, 
                        28, 
                        "gap-1"
                      )}
                    </div>
                  ))}
                </div>

                {/* Textarea */}
                <div className="mb-8">
                  <h3 className="text-[#202124] text-[15px] font-medium mb-3">Share more about your experience</h3>
                  <textarea 
                    className="w-full border border-[#DADCE0] rounded-lg p-3 min-h-[120px] text-[15px] text-[#202124] placeholder:text-[#70757A] focus:outline-none focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] resize-none"
                    placeholder="Share details of your experience at this place"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>

                {/* Questions */}
                <div className="space-y-6 mb-8">
                  <div>
                    <h3 className="text-[#202124] text-[15px] font-medium mb-3">What went wrong?</h3>
                    <div className="flex flex-wrap gap-2">
                      {['Food quality', 'Service delay', 'Staff behaviour', 'Cleanliness', 'Other'].map(option => (
                        <Pill 
                          key={option} 
                          label={option} 
                          selected={issues.includes(option)} 
                          onClick={() => toggleIssue(option)} 
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button 
                  onClick={() => setStep(3)}
                  className="w-full bg-[#1A73E8] hover:bg-[#1557B0] text-white rounded-full py-2.5 text-[15px] font-medium transition-colors"
                >
                  Post
                </button>

              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
