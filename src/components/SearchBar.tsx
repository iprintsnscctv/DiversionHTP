import React from 'react';
import { MapPin, Calendar, Users, Search, RotateCcw, SlidersHorizontal } from 'lucide-react';

interface SearchParams {
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  search: string;
  maxPrice: number;
}

interface SearchBarProps {
  searchParams: SearchParams;
  setSearchParams: React.Dispatch<React.SetStateAction<SearchParams>>;
  onResetFilters: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchParams,
  setSearchParams,
  onResetFilters
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-xl shadow-slate-200/70 border border-slate-200 mb-8 max-w-5xl mx-auto relative z-10 -mt-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
        
        {/* Search by room keyword */}
        <div className="md:col-span-3">
          <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-rose-500" /> Search Room / Amenity
          </label>
          <input
            type="text"
            placeholder="e.g. Room 1, Balcony, Loft..."
            value={searchParams.search}
            onChange={(e) => setSearchParams(prev => ({ ...prev, search: e.target.value }))}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all"
          />
        </div>

        {/* Check-In / Check-Out */}
        <div className="md:col-span-5">
          <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-rose-500" /> Check-in & Check-out Dates
          </label>
          <div className="flex items-center gap-1.5">
            <input
              type="date"
              value={searchParams.checkIn}
              onChange={(e) => setSearchParams(prev => ({ ...prev, checkIn: e.target.value }))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
            <span className="text-slate-400 font-bold text-xs">—</span>
            <input
              type="date"
              value={searchParams.checkOut}
              min={searchParams.checkIn}
              onChange={(e) => setSearchParams(prev => ({ ...prev, checkOut: e.target.value }))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Guests count */}
        <div className="md:col-span-3">
          <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-rose-500" /> Total Guests
          </label>
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-2 py-1">
            <button
              type="button"
              onClick={() => setSearchParams(prev => ({ ...prev, guests: Math.max(1, prev.guests - 1) }))}
              className="w-7 h-7 rounded-lg bg-white shadow-xs border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center justify-center font-bold text-xs active:scale-95"
            >
              -
            </button>
            <span className="text-xs font-bold text-slate-800">
              {searchParams.guests} {searchParams.guests === 1 ? 'Guest' : 'Guests'}
            </span>
            <button
              type="button"
              onClick={() => setSearchParams(prev => ({ ...prev, guests: prev.guests + 1 }))}
              className="w-7 h-7 rounded-lg bg-white shadow-xs border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center justify-center font-bold text-xs active:scale-95"
            >
              +
            </button>
          </div>
        </div>

        {/* Clear Filter button */}
        <div className="md:col-span-1 flex items-end">
          <button
            type="button"
            onClick={onResetFilters}
            title="Reset Filters"
            className="w-full h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
