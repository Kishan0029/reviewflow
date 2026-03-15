import React, { useEffect, useState } from 'react';
import { useTitle } from '@/hooks/useTitle';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Business } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export default function DashboardSettings() {
  useTitle('Settings');
  const { user, profile } = useAuth();
  const [business, setBusiness] = useState<Business | null>(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) loadBusiness();
  }, [user]);

  async function loadBusiness() {
    setLoading(true);
    // Ensure profile exists for users who signed up before schema was applied
    await supabase.from('profiles').upsert({
      id: user!.id,
      name: user!.user_metadata?.name || '',
      email: user!.email || '',
    }, { onConflict: 'id' });

    const { data: bizArray } = await supabase
      .from('businesses')
      .select('*')
      .eq('owner_id', user!.id)
      .limit(1);
    const data = bizArray?.[0];
    if (data) {
      setBusiness(data);
      setName(data.name);
    }
    setLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!business) return;
    setSaving(true);
    setError('');
    setSaved(false);

    const { error: err } = await supabase
      .from('businesses')
      .update({ name })
      .eq('id', business.id);

    if (err) {
      setError(err.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  }

  if (loading) return (
    <div className="flex justify-center items-center h-48">
      <div className="w-8 h-8 border-4 border-[#1A73E8] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-xl">
      <div>
        <h1 className="text-2xl font-semibold text-[#202124]">Settings</h1>
        <p className="text-[#5F6368] text-sm mt-1">Manage your business profile.</p>
      </div>

      {/* Account info */}
      <Card className="border-[#E8EAED] shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Account</CardTitle>
          <CardDescription className="text-xs">Your personal account details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-[#5F6368] mb-1.5 uppercase tracking-wider">Name</label>
            <input readOnly value={profile?.name || ''} className="w-full bg-[#F8F9FA] border border-[#DADCE0] rounded-lg px-3 py-2.5 text-sm text-[#202124]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#5F6368] mb-1.5 uppercase tracking-wider">Email</label>
            <input readOnly value={profile?.email || ''} className="w-full bg-[#F8F9FA] border border-[#DADCE0] rounded-lg px-3 py-2.5 text-sm text-[#202124]" />
          </div>
        </CardContent>
      </Card>

      {/* Business profile */}
      {business && (
        <Card className="border-[#E8EAED] shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Business Profile</CardTitle>
            <CardDescription className="text-xs">This name appears on your feedback pages.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#202124] mb-1.5">Business name</label>
                <input
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full border border-[#DADCE0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#5F6368] mb-1.5 uppercase tracking-wider">Plan</label>
                <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${business.plan === 'pro' ? 'bg-[#1A73E8] text-white' : 'bg-[#F8F9FA] border border-[#DADCE0] text-[#5F6368]'}`}>
                  {business.plan === 'pro' ? '⚡ Pro' : '🆓 Free'}
                </span>
              </div>
              {error && <p className="text-sm text-[#EA4335]">{error}</p>}
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-sm font-medium bg-[#1A73E8] hover:bg-[#1557B0] text-white rounded-lg disabled:opacity-60 transition"
                >
                  {saving ? 'Saving...' : 'Save changes'}
                </button>
                {saved && (
                  <span className="flex items-center gap-1.5 text-sm text-[#34A853] animate-in fade-in">
                    <CheckCircle2 size={15} /> Saved!
                  </span>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
