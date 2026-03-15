import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  MapPin,
  Settings,
  Menu,
  X,
  LogOut,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const NAVIGATION = [
  { name: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Feedback', icon: MessageSquare, path: '/dashboard/feedback' },
  { name: 'Locations', icon: MapPin, path: '/dashboard/locations' },
  { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col md:flex-row font-sans text-[#202124]">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-[#E0E0E0] sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#1A73E8] rounded-lg flex items-center justify-center">
            <Star size={15} className="text-white fill-white" />
          </div>
          <span className="font-semibold text-lg text-[#202124]">ReviewFlow</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-[#5F6368] hover:bg-[#F8F9FA] rounded-md transition-colors">
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#E0E0E0] transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:w-60 md:flex md:flex-col',
        isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      )}>
        {/* Logo area */}
        <div className="flex items-center justify-between px-5 py-4 min-h-[60px] border-b border-[#E0E0E0]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1A73E8] rounded-lg flex items-center justify-center">
              <Star size={15} className="text-white fill-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-[#202124]">ReviewFlow</span>
          </div>
          {/* Mobile close button */}
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden p-2 -mr-2 text-[#5F6368] hover:bg-[#F8F9FA] rounded-md">
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-0.5 px-3">
            {NAVIGATION.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard'}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-[#E8F0FE] text-[#1A73E8]'
                    : 'text-[#5F6368] hover:bg-[#F8F9FA] hover:text-[#202124]'
                )}
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={18} className={isActive ? 'text-[#1A73E8]' : 'text-[#5F6368]'} />
                    {item.name}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User footer */}
        <div className="p-3 border-t border-[#E0E0E0] space-y-1">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-[#1A73E8] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              {profile?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#202124] truncate">{profile?.name || 'User'}</p>
              <p className="text-xs text-[#5F6368] truncate">{profile?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#5F6368] hover:text-[#EA4335] hover:bg-[#FEF7F6] rounded-lg transition-colors"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/20 z-20 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}
    </div>
  );
}
