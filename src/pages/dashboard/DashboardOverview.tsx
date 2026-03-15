import React, { useEffect, useState } from 'react';
import { Star, TrendingUp, MessageSquare, CheckCircle2, MapPin } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Stats {
  total: number;
  avgRating: number;
  complaints: number;
  resolved: number;
}

interface RatingDist {
  stars: number;
  count: number;
}

export default function DashboardOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({ total: 0, avgRating: 0, complaints: 0, resolved: 0 });
  const [ratingDist, setRatingDist] = useState<RatingDist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadStats();
  }, [user]);

  async function loadStats() {
    setLoading(true);

    // Step 1: get business ID for this user
    const { data: bizArray } = await supabase
      .from('businesses')
      .select('id')
      .eq('owner_id', user!.id)
      .limit(1);

    const biz = bizArray?.[0];

    if (!biz) {
      setLoading(false);
      return;
    }

    // Step 2: get all location IDs for this business
    const { data: locs } = await supabase
      .from('locations')
      .select('id')
      .eq('business_id', biz.id);

    const locationIds = (locs || []).map(l => l.id);

    if (locationIds.length === 0) {
      setLoading(false);
      return;
    }

    // Step 3: get feedback for those locations
    const { data: feedbackData } = await supabase
      .from('feedback')
      .select('rating, resolved')
      .in('location_id', locationIds);

    if (feedbackData) {
      const total = feedbackData.length;
      const avgRating = total > 0 ? feedbackData.reduce((s, f) => s + f.rating, 0) / total : 0;
      const complaints = feedbackData.filter(f => f.rating <= 3).length;
      const resolved = feedbackData.filter(f => f.resolved).length;
      setStats({ total, avgRating: Math.round(avgRating * 10) / 10, complaints, resolved });

      const dist: RatingDist[] = [1, 2, 3, 4, 5].map(stars => ({
        stars,
        count: feedbackData.filter(f => f.rating === stars).length,
      }));
      setRatingDist(dist);
    }
    setLoading(false);
  }

  const STAT_CARDS = [
    { label: 'Total Feedback', value: stats.total, icon: MessageSquare, color: 'text-[#1A73E8]', bg: 'bg-[#E8F0FE]' },
    { label: 'Avg. Rating', value: `${stats.avgRating} ★`, icon: Star, color: 'text-[#FBBC04]', bg: 'bg-[#FEF7E0]' },
    { label: 'Complaints', value: stats.complaints, icon: TrendingUp, color: 'text-[#EA4335]', bg: 'bg-[#FCE8E6]' },
    { label: 'Resolved', value: stats.resolved, icon: CheckCircle2, color: 'text-[#34A853]', bg: 'bg-[#E6F4EA]' },
  ];

  if (loading) return (
    <div className="flex justify-center items-center h-48">
      <div className="w-8 h-8 border-4 border-[#1A73E8] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-semibold text-[#202124]">Overview</h1>
        <p className="text-[#5F6368] mt-1 text-sm">Your feedback summary at a glance.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(stat => (
          <Card key={stat.label} className="border-[#E8EAED] shadow-sm">
            <CardContent className="p-5">
              <div className={`w-9 h-9 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                <stat.icon size={18} className={stat.color} />
              </div>
              <p className="text-xs text-[#5F6368] font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-[#202124] mt-1">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Rating distribution chart */}
      <Card className="border-[#E8EAED] shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Rating Distribution</CardTitle>
          <CardDescription className="text-xs">How customers rated their experience</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.total === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-[#5F6368]">
              <MapPin size={32} className="mb-3 text-[#DADCE0]" />
              <p className="text-sm font-medium">No feedback yet</p>
              <p className="text-xs text-[#9AA0A6] mt-1">Create a location and share your QR code to start collecting feedback.</p>
            </div>
          ) : (
            <div className="h-52 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ratingDist} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8EAED" />
                  <XAxis dataKey="stars" axisLine={false} tickLine={false} tick={{ fill: '#5F6368', fontSize: 12 }} tickFormatter={v => `${v}★`} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#5F6368', fontSize: 12 }} allowDecimals={false} />
                  <Tooltip
                    cursor={{ fill: '#F8F9FA' }}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #E0E0E0', fontSize: 13 }}
                  />
                  <Bar dataKey="count" name="Responses" fill="#1A73E8" radius={[4, 4, 0, 0]} barSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
