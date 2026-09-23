import React from 'react';
import {
  Sparkles,
  Car,
  Wifi,
  Wind,
  Clock,
  MapPin
} from 'lucide-react';

interface HeroSectionProps {
  onQuickCategorySelect?: (cat: string) => void;
  onOpenCalendar?: () => void;
  totalRooms?: number;
}

export const HeroSection: React.FC<HeroSectionProps> = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950 text-white p-6 sm:p-10 mb-8 border border-slate-800 shadow-2xl">
      {/* Background Graphic Accents */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            Official Booking Platform
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 text-slate-200 backdrop-blur-xs">
            <MapPin className="w-3 h-3 text-rose-400" /> Diversion Road, Vigan City
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-serif-heading leading-tight mb-4">
          Experience Comfort & Heritage at <span className="bg-gradient-to-r from-rose-400 via-pink-300 to-amber-200 bg-clip-text text-transparent">Diversion Vigan</span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed mb-6 font-medium">
          Modern transient rooms, spacious family suites, and high-ceiling glass lofts. Complete with fiber Wi-Fi, split-type aircon, hot rain showers, and secure gated parking just 5 minutes away from historic Calle Crisologo.
        </p>

        {/* Feature badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Wide Parking Space</p>
              <p className="text-[10px] text-slate-400">Gated 24/7 Security</p>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Wind className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Full Aircon</p>
              <p className="text-[10px] text-slate-400">Silent Inverter</p>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <Wifi className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Fiber Wi-Fi</p>
              <p className="text-[10px] text-slate-400">High-Speed 100Mbps</p>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">5 Mins Away</p>
              <p className="text-[10px] text-slate-400">Calle Crisologo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
