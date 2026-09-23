import React, { useState } from 'react';
import { Room } from '../types';
import { formatCurrency } from '../services/api';
import {
  Heart,
  Star,
  Users,
  Bed,
  Bath,
  MapPin,
  Calendar,
  ChevronDown,
  ChevronUp,
  Check,
  Sparkles,
  ShieldCheck,
  Car
} from 'lucide-react';

interface RoomCardProps {
  room: Room;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  onSelectRoom: (room: Room) => void;
  onDateClick: (room: Room, dateStr: string) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  room,
  isWishlisted,
  onToggleWishlist,
  onSelectRoom,
  onDateClick
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  // September 2026 dates (1 to 30)
  const daysInSeptember = 30;
  const datesList = Array.from({ length: daysInSeptember }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `2026-09-${dayNum < 10 ? '0' + dayNum : dayNum}`;
    const isBooked = room.bookedDates && room.bookedDates.includes(dateStr);
    return { dayNum, dateStr, isBooked };
  });

  const displayImage = room.images && room.images.length > 0 ? room.images[currentImgIdx] || room.image : room.image;

  return (
    <div className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Cover Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 cursor-pointer" onClick={() => onSelectRoom(room)}>
          <img
            src={displayImage}
            alt={room.title}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80";
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            <span className="bg-emerald-500/95 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              Ready for Booking
            </span>
            {room.featured && (
              <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Popular Choice
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(room.id);
            }}
            aria-label="Save room"
            className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              isWishlisted
                ? 'bg-rose-500 text-white shadow-md scale-110'
                : 'bg-white/85 backdrop-blur-md text-slate-700 hover:bg-white hover:text-rose-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white text-white' : ''}`} />
          </button>

          {/* Category overlay */}
          <span className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg border border-white/10">
            {room.category}
          </span>
        </div>

        {/* Card Details */}
        <div className="p-4 cursor-pointer" onClick={() => onSelectRoom(room)}>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-semibold">
            <span className="truncate flex items-center gap-1 text-rose-600 font-bold">
              <MapPin className="w-3.5 h-3.5" /> {room.location}
            </span>
            <span className="flex items-center gap-0.5 text-[10px] font-bold text-slate-700 bg-amber-50/90 px-1.5 py-0.5 rounded-md border border-amber-200/60 leading-tight">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" /> {room.rating} ({room.reviewsCount})
            </span>
          </div>

          <h3 className="font-extrabold text-slate-900 text-sm line-clamp-1 group-hover:text-rose-600 transition-colors">
            {room.title}
          </h3>

          <div className="flex items-center gap-3 text-xs text-slate-500 mt-2 font-medium">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400" /> Max {room.maxGuests}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5 text-slate-400" /> {room.beds} Beds
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5 text-slate-400" /> {room.baths} Bath
            </span>
          </div>

          {/* Quick amenity pills */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {room.amenities.slice(0, 3).map((a, i) => (
              <span key={i} className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                {a}
              </span>
            ))}
            {room.amenities.length > 3 && (
              <span className="text-[10px] font-bold text-slate-400 px-1 py-0.5">
                +{room.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Room Availability Mini Calendar Toggle */}
        <div className="px-4 pb-3">
          <button
            type="button"
            onClick={() => setShowCalendar(!showCalendar)}
            className="w-full py-1.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-between transition-colors"
          >
            <span className="flex items-center gap-1.5 text-[11px]">
              <Calendar className="w-3.5 h-3.5 text-rose-500" /> Check Room Calendar
            </span>
            {showCalendar ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {showCalendar && (
            <div className="mt-2.5 p-3 bg-slate-900 text-white rounded-2xl animate-fade-in space-y-2 border border-slate-800">
              <div className="flex items-center justify-between text-[11px] font-bold border-b border-slate-800 pb-1.5">
                <span>September 2026</span>
                <span className="text-[9px] text-slate-400 flex items-center gap-2 font-medium">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span> Open
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span> Booked
                  </span>
                </span>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, idx) => (
                  <span key={idx} className="text-[9px] font-bold text-slate-400">{d}</span>
                ))}
                {datesList.map((item) => (
                  <button
                    key={item.dateStr}
                    type="button"
                    disabled={item.isBooked}
                    onClick={() => onDateClick(room, item.dateStr)}
                    className={`text-[10px] font-bold py-1 rounded-md transition-all ${
                      item.isBooked
                        ? 'bg-rose-950/80 text-rose-400/50 cursor-not-allowed line-through'
                        : 'bg-slate-800 hover:bg-emerald-500 hover:text-white text-emerald-300'
                    }`}
                    title={item.isBooked ? 'Reserved date' : `Click to book for ${item.dateStr}`}
                  >
                    {item.dayNum}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Price & Action */}
      <div className="p-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-xs text-slate-500 font-bold">From</span>
            <span className="text-lg font-black text-slate-900">{formatCurrency(room.price)}</span>
            <span className="text-xs text-slate-500 font-medium"> / nt</span>
          </div>
          <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">
            Custom Day Rates Apply
          </span>
        </div>

        <button
          type="button"
          onClick={() => onSelectRoom(room)}
          className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-xl font-extrabold text-xs shadow-md shadow-rose-500/20 transition-all active:scale-95 cursor-pointer"
        >
          Reserve Room
        </button>
      </div>
    </div>
  );
};
