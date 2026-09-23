import React, { useState, useMemo } from 'react';
import { Room } from '../types';
import { formatCurrency } from '../services/api';
import {
  calculateCustomStayPrice,
  ROOM_TIER_CONFIGS,
  getRoomPricingTier,
  isWeekendStayDate
} from '../services/pricing';
import {
  X,
  Star,
  Users,
  Bed,
  Bath,
  MapPin,
  Calendar,
  Check,
  ShieldCheck,
  Car,
  Wifi,
  Phone,
  MessageSquare,
  Sparkles,
  ChevronRight,
  Info,
  CalendarDays,
  TableProperties
} from 'lucide-react';

interface RoomDetailModalProps {
  room: Room;
  searchParams: { checkIn: string; checkOut: string; guests: number };
  onClose: () => void;
  onProceedToCheckout: (bookingDraft: {
    property: Room;
    checkIn: string;
    checkOut: string;
    nights: number;
    guests: number;
    grandTotal: number;
  }) => void;
}

export const RoomDetailModal: React.FC<RoomDetailModalProps> = ({
  room,
  searchParams,
  onClose,
  onProceedToCheckout
}) => {
  const [checkIn, setCheckIn] = useState(
    searchParams.checkIn || new Date().toISOString().split('T')[0]
  );

  const defaultOutDate = () => {
    const d = new Date(checkIn || new Date());
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  };

  const [checkOut, setCheckOut] = useState(searchParams.checkOut || defaultOutDate());
  const [guests, setGuests] = useState(
    Math.min(searchParams.guests || 2, room.maxGuests)
  );
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  const pricingTier = useMemo(() => getRoomPricingTier(room), [room]);
  const tierConfig = ROOM_TIER_CONFIGS[pricingTier];

  const stayCalculation = useMemo(() => {
    return calculateCustomStayPrice(room, checkIn, checkOut, guests);
  }, [room, checkIn, checkOut, guests]);

  const { nights, grandTotal, breakdown, baseTotal } = stayCalculation;

  const imagesList = room.images && room.images.length > 0 ? room.images : [room.image];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col relative">
        
        {/* Modal Sticky Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="min-w-0 pr-4">
            <span className="text-xs font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
              {room.category}
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 truncate mt-1">
              {room.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Media & Room Information */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Gallery Image Display */}
            <div className="space-y-2.5">
              <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 shadow-inner relative">
                <img
                  src={imagesList[activeImgIndex] || room.image}
                  alt={room.title}
                  className="w-full h-full object-cover transition-all duration-300"
                />
                <span className="absolute bottom-3 right-3 bg-slate-950/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md">
                  Photo {activeImgIndex + 1} of {imagesList.length}
                </span>
              </div>

              {imagesList.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {imagesList.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImgIndex(idx)}
                      className={`w-18 h-13 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        activeImgIndex === idx
                          ? 'border-rose-500 scale-95 shadow-md'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <div>
                <span className="block text-[11px] text-slate-400 font-bold uppercase tracking-wider">Guest Capacity</span>
                <span className="text-sm font-extrabold text-slate-900 mt-0.5 block">Up to {room.maxGuests} guests</span>
              </div>
              <div className="border-x border-slate-200">
                <span className="block text-[11px] text-slate-400 font-bold uppercase tracking-wider">Beds</span>
                <span className="text-sm font-extrabold text-slate-900 mt-0.5 block">{room.beds} Quality Beds</span>
              </div>
              <div>
                <span className="block text-[11px] text-slate-400 font-bold uppercase tracking-wider">Bathrooms</span>
                <span className="text-sm font-extrabold text-slate-900 mt-0.5 block">{room.baths} Hot Rain-Bath</span>
              </div>
            </div>

            {/* Official Custom Room Rates Table */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-3xl space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TableProperties className="w-4 h-4 text-rose-400" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-rose-300">
                    Official Rate Schedule (Days & Pax)
                  </h3>
                </div>
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full font-bold text-slate-300">
                  {tierConfig.name}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-700 text-slate-400 text-[10px] uppercase font-bold">
                      <th className="py-2 pr-2">Guest Occupancy</th>
                      <th className="py-2 px-2 text-amber-300">Rate (Mon to Thu)</th>
                      <th className="py-2 pl-2 text-rose-300">Rate (Fri to Sun)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                    {pricingTier === 'PRIVATE_VILLA' ? (
                      <>
                        <tr className="hover:bg-slate-800/40">
                          <td className="py-2.5 pr-2 font-sans font-bold text-white">1 - 10 pax (Base)</td>
                          <td className="py-2.5 px-2 font-bold text-amber-400">₱7,000 / nt</td>
                          <td className="py-2.5 pl-2 font-bold text-rose-400">₱8,000 / nt</td>
                        </tr>
                        <tr className="hover:bg-slate-800/40">
                          <td className="py-2.5 pr-2 font-sans font-bold text-white">Extra Pax (11-20 pax)</td>
                          <td className="py-2.5 px-2 font-bold text-amber-400">+₱400 / extra pax</td>
                          <td className="py-2.5 pl-2 font-bold text-rose-400">+₱500 / extra pax</td>
                        </tr>
                      </>
                    ) : (
                      tierConfig.rows.map((row, idx) => {
                        const isCurrentPaxSelected = guests >= row.minPax && guests <= row.maxPax;
                        return (
                          <tr
                            key={idx}
                            className={`transition-colors ${
                              isCurrentPaxSelected
                                ? 'bg-rose-500/20 text-white font-black'
                                : 'hover:bg-slate-800/40 text-slate-300'
                            }`}
                          >
                            <td className="py-2 pr-2 font-sans flex items-center gap-1.5">
                              {isCurrentPaxSelected && (
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
                              )}
                              <span>{row.paxLabel}</span>
                            </td>
                            <td className="py-2 px-2 text-amber-400 font-bold">
                              {formatCurrency(row.weekdayRate)}
                            </td>
                            <td className="py-2 pl-2 text-rose-400 font-bold">
                              {formatCurrency(row.weekendRate)}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 mb-2 flex items-center gap-2">
                <Info className="w-4 h-4 text-rose-500" /> About this accommodation
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {room.description}
              </p>
            </div>

            {/* Amenities Included */}
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" /> What this room offers
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {room.amenities.map((amenity, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <Check className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>



          </div>

          {/* Right Column: Pricing & Booking Calculator Box */}
          <div className="lg:col-span-5">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/90 sticky top-20 shadow-xs space-y-5">
              
              {/* Price header */}
              <div className="flex items-baseline justify-between pb-4 border-b border-slate-200">
                <div>
                  <span className="text-2xl font-black text-slate-900">
                    {formatCurrency(stayCalculation.averageNightly)}
                  </span>
                  <span className="text-xs text-slate-500 font-medium"> / night (avg)</span>
                </div>
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1 bg-amber-100/80 px-2 py-0.5 rounded-md text-amber-900">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {room.rating} ({room.reviewsCount} reviews)
                </span>
              </div>

              {/* Date Inputs */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">
                    Guests (Max {room.maxGuests})
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  >
                    {[...Array(room.maxGuests)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Day-by-Day Nightly Breakdown */}
              <div className="space-y-2 pt-2 pb-4 border-b border-slate-200">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                  Daily Nightly Breakdown ({guests} {guests === 1 ? 'Guest' : 'Guests'})
                </span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {breakdown.map((b, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs bg-white p-2 rounded-xl border border-slate-200/70">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-700">{b.date} ({b.dayOfWeek})</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                          b.isWeekend ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {b.isWeekend ? 'Fri-Sun' : 'Mon-Thu'}
                        </span>
                      </div>
                      <span className="font-bold text-slate-900">{formatCurrency(b.rate)}</span>
                    </div>
                  ))}
                </div>


              </div>

              {/* Grand Total */}
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-slate-400 block uppercase">Total Amount ({nights} {nights === 1 ? 'night' : 'nights'})</span>
                  <span className="text-xl font-black text-rose-600">{formatCurrency(grandTotal)}</span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">All inclusive</span>
              </div>

              {/* Checkout Action */}
              <button
                type="button"
                onClick={() => onProceedToCheckout({
                  property: room,
                  checkIn,
                  checkOut,
                  nights,
                  guests,
                  grandTotal
                })}
                className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white py-3.5 rounded-2xl font-black text-xs sm:text-sm shadow-lg shadow-rose-200 transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Reserve Room</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-500" /> Free cancellation up to 24h prior to check-in.
              </p>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

