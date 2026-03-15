import React, { useEffect, useState } from 'react';
import { useTitle } from '@/hooks/useTitle';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Feedback, Location } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Phone, MessageSquare, CheckCircle2, Clock } from 'lucide-react';

interface FeedbackWithLocation extends Feedback {
  location_name?: string;
}

const ISSUE_COLORS: Record<string, string> = {
  'Food quality': 'bg-orange-50 text-orange-600',
  'Service delay': 'bg-yellow-50 text-yellow-700',
  'Staff behaviour': 'bg-red-50 text-red-600',
  'Cleanliness': 'bg-purple-50 text-purple-600',
  'Other': 'bg-gray-100 text-gray-600',
};

export default function DashboardFeedback() {
  useTitle('Feedback');
  const { user } = useAuth();
  const [items, setItems] = useState<FeedbackWithLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unresolved' | 'resolved'>('unresolved');

  useEffect(() => {
    if (user) loadFeedback();
  }, [user]);

  async function loadFeedback() {
    setLoading(true);

    // Get business for this user
    const { data: bizArray } = await supabase
      .from('businesses')
      .select('id')
      .eq('owner_id', user!.id)
      .limit(1);

    const biz = bizArray?.[0];

    if (!biz) { setLoading(false); return; }

    // Get all locations with their names
    const { data: locs } = await supabase
      .from('locations')
      .select('id, name')
      .eq('business_id', biz.id);

    if (!locs || locs.length === 0) { setLoading(false); return; }

    const locationIds = locs.map(l => l.id);
    const locationMap = Object.fromEntries(locs.map(l => [l.id, l.name]));

    // Get feedback for those locations
    const { data } = await supabase
      .from('feedback')
      .select('*')
      .in('location_id', locationIds)
      .lte('rating', 3)
      .order('created_at', { ascending: false });

    if (data) {
      setItems(data.map(f => ({
        ...f,
        location_name: locationMap[f.location_id] || '',
      })));
    }
    setLoading(false);
  }

  async function toggleResolved(id: string, current: boolean) {
    await supabase.from('feedback').update({ resolved: !current }).eq('id', id);
    setItems(prev => prev.map(f => f.id === id ? { ...f, resolved: !current } : f));
  }

  const filtered = items.filter(f =>
    filter === 'all' ? true :
    filter === 'resolved' ? f.resolved :
    !f.resolved
  );

  function formatDate(ts: string) {
    const d = new Date(ts);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) + ' · ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#202124]">Feedback</h1>
          <p className="text-[#5F6368] text-sm mt-1">Manage and resolve customer complaints.</p>
        </div>
        <div className="flex gap-2">
          {(['unresolved', 'resolved', 'all'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition capitalize ${filter === f ? 'bg-[#1A73E8] text-white' : 'bg-white border border-[#DADCE0] text-[#5F6368] hover:bg-[#F8F9FA]'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="w-8 h-8 border-4 border-[#1A73E8] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-[#E8EAED] shadow-sm">
          <CardContent className="flex flex-col items-center justify-center h-52 text-center">
            <CheckCircle2 size={32} className="text-[#34A853] mb-3" />
            <p className="text-sm font-medium text-[#202124]">
              {filter === 'unresolved' ? 'No unresolved complaints!' : 'No feedback yet'}
            </p>
            <p className="text-xs text-[#9AA0A6] mt-1">
              {filter === 'unresolved' ? 'Great job keeping up with customer feedback.' : 'Complaints will appear here when customers submit them.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(fb => (
            <Card key={fb.id} className={`border shadow-sm transition ${fb.resolved ? 'border-[#E8EAED] opacity-70' : 'border-[#E8EAED] hover:border-[#1A73E8]/30'}`}>
              <CardContent className="p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2 flex-1">
                    {/* Header row */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} size={14} className={s <= fb.rating ? 'fill-[#FBBC04] text-[#FBBC04]' : 'fill-[#DADCE0] text-[#DADCE0]'} />
                        ))}
                      </div>
                      {fb.issues?.map(issue => (
                        <span key={issue} className={`text-xs px-2 py-0.5 rounded-full font-medium ${ISSUE_COLORS[issue] || 'bg-gray-100 text-gray-600'}`}>{issue}</span>
                      ))}
                      <span className="text-xs text-[#9AA0A6] ml-auto flex items-center gap-1">
                        <Clock size={11} /> {formatDate(fb.created_at)}
                      </span>
                    </div>

                    {fb.location_name && (
                      <p className="text-xs text-[#9AA0A6]">📍 {fb.location_name}</p>
                    )}

                    {fb.comment && (
                      <p className="text-sm text-[#202124] italic">"{fb.comment}"</p>
                    )}

                    {fb.customer_phone && (
                      <div className="flex items-center gap-2 bg-[#F8F9FA] px-3 py-1.5 rounded-lg inline-flex">
                        <Phone size={13} className="text-[#5F6368]" />
                        <span className="text-sm text-[#202124]">{fb.customer_phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-wrap md:flex-col md:items-end">
                    {fb.customer_phone && (
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${fb.customer_phone.replace(/[^0-9]/g, '')}`}
                          className="flex items-center gap-1.5 text-xs font-medium text-[#1A73E8] border border-[#1A73E8]/30 bg-[#E8F0FE] hover:bg-[#D2E3FC] px-3 py-1.5 rounded-lg transition"
                        >
                          <Phone size={13} /> Call
                        </a>
                        <a
                          href={`https://wa.me/${fb.customer_phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-medium text-[#128C7E] border border-[#128C7E]/30 bg-[#E7F7F5] hover:bg-[#D4F1ED] px-3 py-1.5 rounded-lg transition"
                        >
                          <MessageSquare size={13} /> WhatsApp
                        </a>
                      </div>
                    )}
                    <button
                      onClick={() => toggleResolved(fb.id, fb.resolved)}
                      className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition ${fb.resolved ? 'text-[#5F6368] border border-[#DADCE0] hover:bg-[#F8F9FA]' : 'text-[#34A853] border border-[#34A853]/30 bg-[#E6F4EA] hover:bg-[#D4EDD8]'}`}
                    >
                      <CheckCircle2 size={13} />
                      {fb.resolved ? 'Reopen' : 'Mark resolved'}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
