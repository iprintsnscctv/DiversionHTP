import React, { useState } from 'react';
import {
  Compass,
  CalendarCheck,
  ShieldCheck,
  MapPin,
  Sparkles,
  Phone,
  Menu,
  X,
  CalendarDays,
  Map
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  wishlistCount?: number;
  bookingsCount: number;
  onOpenCalendarOverview: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  wishlistCount,
  bookingsCount,
  onOpenCalendarOverview
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'explore', label: 'Rooms & Suites', icon: Compass },
    { id: 'calendar', label: 'Availability', icon: CalendarDays, action: onOpenCalendarOverview },
    { id: 'bookings', label: 'My Bookings', icon: CalendarCheck, badge: bookingsCount },
    { id: 'guide', label: 'Vigan Guide', icon: Map },
    { id: 'reviews', label: 'Guest Reviews', icon: Sparkles },
    { id: 'contact', label: 'Contact & Map', icon: Phone }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      {/* Top Banner Notice for transient house guests */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-rose-100 text-[11px] py-1.5 px-4 font-medium flex items-center justify-between border-b border-slate-800">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-rose-500 text-white text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wider">
              Prime Location
            </span>
            <span className="hidden sm:inline">Located directly along Diversion Road, Vigan City — 5 mins to Calle Crisologo.</span>
            <span className="sm:hidden">Diversion Road, Vigan City — 5 mins to Calle Crisologo</span>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-semibold text-slate-300">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-rose-400" /> +63 917 890 1234
            </span>
            <span className="hidden md:flex items-center gap-1 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Open 24/7 Gated Parking
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('explore')} 
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-all shrink-0">
              <span className="font-serif font-black text-xl tracking-tighter">DV</span>
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 font-serif-heading leading-tight group-hover:text-rose-600 transition-colors">
                Diversion Vigan
              </span>
              <span className="text-[10px] sm:text-[11px] font-extrabold text-rose-600 tracking-wider uppercase leading-snug">
                Transient & Private Villa
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1 rounded-full border border-slate-200">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1.5 relative ${
                    isActive
                      ? 'bg-white text-rose-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-rose-600' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full leading-tight">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('admin')}
              title="Admin Portal"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900/10 hover:bg-slate-900/20 text-slate-500 hover:text-slate-800 backdrop-blur-md border border-slate-200/80 transition-all opacity-60 hover:opacity-100"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Admin</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-1 animate-fade-in shadow-xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (item.action) {
                    item.action();
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                  isActive ? 'bg-rose-50 text-rose-600' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-slate-500" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
