import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Location, Business } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import QRCodeCard from '@/components/QRCodeCard';
import { Plus, MapPin, X } from 'lucide-react';

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Math.random().toString(36).slice(2, 6);
}

const APP_URL = typeof window !== 'undefined' ? window.location.origin : 'https://reviewflow.app';

export default function DashboardLocations() {
  const { user } = useAuth();
  const [locations, setLocations] = useState<Location[]>([]);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [placeId, setPlaceId] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  async function loadData() {
    setLoading(true);
    setLoadError('');

    // Ensure profile row exists (handles users who signed up before schema was applied)
    await supabase.from('profiles').upsert({
      id: user!.id,
      name: user!.user_metadata?.name || '',
      email: user!.email || '',
    }, { onConflict: 'id' });

    // Get or create business
    let { data: bizArray, error: bizErr } = await supabase
      .from('businesses')
      .select('*')
      .eq('owner_id', user!.id)
      .limit(1);

    let biz = bizArray?.[0];

    if (!biz) {
      const { data: profile } = await supabase.from('profiles').select('name').eq('id', user!.id).limit(1).single();
      const { data: newBiz, error: createErr } = await supabase
        .from('businesses')
        .insert({ owner_id: user!.id, name: profile?.name ? `${profile.name}'s Business` : 'My Business' })
        .select()
        .single();

      if (createErr) {
        setLoadError(`Failed to create business: ${createErr.message}`);
        setLoading(false);
        return;
      }
      biz = newBiz;
    }

    if (!biz) {
      setLoadError('Could not load or create your business. Check Supabase console for errors.');
      setLoading(false);
      return;
    }

    setBusiness(biz);

    const { data: locs } = await supabase
      .from('locations')
      .select('*')
      .eq('business_id', biz.id)
      .order('created_at', { ascending: false });

    setLocations(locs || []);
    setLoading(false);
  }


  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!business) return;
    setSaving(true);
    setError('');

    const qr_slug = slugify(name);
    const { error: err } = await supabase.from('locations').insert({
      business_id: business.id,
      name,
      google_place_id: placeId,
      qr_slug,
    });

    if (err) {
      setError(err.message);
    } else {
      setName('');
      setPlaceId('');
      setShowForm(false);
      loadData();
    }
    setSaving(false);
  }

  if (loading) return (
    <div className="flex justify-center items-center h-48">
      <div className="w-8 h-8 border-4 border-[#1A73E8] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (loadError) return (
    <div className="p-4 bg-[#FCE8E6] border border-[#EA4335]/20 rounded-xl text-sm text-[#C5221F]">
      <strong>Error loading data:</strong> {loadError}
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#202124]">Locations</h1>
          <p className="text-[#5F6368] text-sm mt-1">Manage your QR code locations.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-[#1A73E8] hover:bg-[#1557B0] text-white text-sm font-medium px-4 py-2.5 rounded-xl transition"
        >
          <Plus size={16} /> Add location
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <Card className="border-[#1A73E8]/30 shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">New Location</CardTitle>
              <button onClick={() => setShowForm(false)} className="text-[#5F6368] hover:text-[#202124]"><X size={18} /></button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#202124] mb-1.5">Location name</label>
                <input
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Main Branch, Indiranagar"
                  className="w-full border border-[#DADCE0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202124] mb-1.5">Google Place ID</label>
                <input
                  required
                  value={placeId}
                  onChange={e => setPlaceId(e.target.value)}
                  placeholder="ChIJN1t_tDeuEmsRUsoyG83frY4"
                  className="w-full border border-[#DADCE0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8]"
                />
                <p className="text-xs text-[#9AA0A6] mt-1">
                  Find your Place ID at{' '}
                  <a href="https://developers.google.com/maps/documentation/places/web-service/place-id" target="_blank" rel="noopener noreferrer" className="text-[#1A73E8] hover:underline">
                    Google Place ID Finder
                  </a>
                </p>
              </div>
              {error && <p className="text-sm text-[#EA4335]">{error}</p>}
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-[#5F6368] hover:bg-[#F8F9FA] rounded-lg">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-medium bg-[#1A73E8] hover:bg-[#1557B0] text-white rounded-lg disabled:opacity-60">
                  {saving ? 'Creating...' : 'Create location'}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Locations list */}
      {locations.length === 0 ? (
        <Card className="border-[#E8EAED] shadow-sm">
          <CardContent className="flex flex-col items-center justify-center h-52 text-center">
            <MapPin size={32} className="text-[#DADCE0] mb-3" />
            <p className="text-sm font-medium text-[#202124]">No locations yet</p>
            <p className="text-xs text-[#9AA0A6] mt-1">Add your first location to generate a QR code.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {locations.map(loc => {
            const feedbackUrl = `${APP_URL}/f/${loc.qr_slug}`;
            return (
              <Card key={loc.id} className="border-[#E8EAED] shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{loc.name}</CardTitle>
                  <CardDescription className="text-xs font-mono break-all">/f/{loc.qr_slug}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                  <QRCodeCard url={feedbackUrl} locationName={loc.name} />
                  <div className="w-full">
                    <label className="text-xs text-[#9AA0A6] font-medium">Direct Link</label>
                    <div className="flex mt-1 gap-2">
                      <input readOnly value={feedbackUrl} className="flex-1 bg-[#F8F9FA] border border-[#DADCE0] rounded-lg px-3 py-1.5 text-xs text-[#5F6368] font-mono" />
                      <button
                        onClick={() => navigator.clipboard.writeText(feedbackUrl)}
                        className="text-xs font-medium bg-[#E8F0FE] text-[#1A73E8] hover:bg-[#D2E3FC] px-3 py-1.5 rounded-lg transition"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
