import React from 'react';
import { MapPin, Phone, Mail, Clock, Heart, ShieldCheck } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900 mt-16 pt-12 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-900">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-600 flex items-center justify-center text-white font-serif font-black text-sm shrink-0">
                DV
              </div>
              <div className="flex flex-col">
                <span className="text-base font-black text-white font-serif-heading leading-tight">
                  Diversion Vigan
                </span>
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                  Transient & Private Villa
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
              Premier heritage-adjacent transient accommodations along Diversion Road, Vigan City, Ilocos Sur.
            </p>
            <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
              24/7 Gated Parking & Caretaker On-Duty
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">
              Quick Navigation
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><button onClick={() => setActiveTab('explore')} className="hover:text-rose-400 transition-colors">Browse Rooms & Suites</button></li>
              <li><button onClick={() => setActiveTab('bookings')} className="hover:text-rose-400 transition-colors">Track Reservation by Ref ID</button></li>
              <li><button onClick={() => setActiveTab('guide')} className="hover:text-rose-400 transition-colors">Vigan City Tourist Guide</button></li>
              <li><button onClick={() => setActiveTab('reviews')} className="hover:text-rose-400 transition-colors">Verified Guest Reviews</button></li>
              <li><button onClick={() => setActiveTab('admin')} className="hover:text-rose-400 transition-colors">Admin Portal</button></li>
            </ul>
          </div>

          {/* Room Categories */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">
              Room Categories
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><span>Family Suites (Rooms 1, 3, 4, 7, 9, 11, 12, 16)</span></li>
              <li><span>Studio Rooms (Rooms 0, 2, 5, 8, 14)</span></li>
              <li><span>High-Ceiling Lofts (Rooms 6, 10, 15)</span></li>
              <li><span>Whole Floor Group Rentals</span></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">
              Direct Contact
            </h4>
            <div className="space-y-1.5 text-[11px]">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>Diversion Road, Vigan City, Ilocos Sur</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>+63 917 890 1234 (Calls / WhatsApp / Viber)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>diversionvigan@gmail.com</span>
              </p>
            </div>
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} Diversion Vigan Transient House. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Crafted for visitors of Vigan City Heritage Village</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
