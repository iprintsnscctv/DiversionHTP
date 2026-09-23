import React, { useState, useMemo } from 'react';
import { Room, Booking } from '../types';
import { formatCurrency, generateBookingRef } from '../services/api';
import { calculateCustomStayPrice } from '../services/pricing';
import { X, UserPlus, Calendar, CreditCard, Coins, CheckCircle, Users } from 'lucide-react';

interface WalkInBookingModalProps {
  rooms: Room[];
  onClose: () => void;
  onCreateWalkIn: (booking: Booking) => void;
}

export const WalkInBookingModal: React.FC<WalkInBookingModalProps> = ({
  rooms,
  onClose,
  onCreateWalkIn
}) => {
  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0]?.id || '');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [checkIn, setCheckIn] = useState(new Date().toISOString().split('T')[0]);

  const defaultNextDay = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [checkOut, setCheckOut] = useState(defaultNextDay());
  const [guests, setGuests] = useState(2);
  const [paymentMethod, setPaymentMethod] = useState<'cash_onsite' | 'gcash' | 'card'>('cash_onsite');

  const selectedRoom = rooms.find(r => r.id === selectedRoomId) || rooms[0];

  const stayCalculation = useMemo(() => {
    if (!selectedRoom) {
      return { nights: 1, baseTotal: 0, cleaningFee: 0, grandTotal: 0, breakdown: [] };
    }
    return calculateCustomStayPrice(selectedRoom, checkIn, checkOut, guests);
  }, [selectedRoom, checkIn, checkOut, guests]);

  const { nights, baseTotal, grandTotal } = stayCalculation;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) return;

    const refId = generateBookingRef();
    const newBooking: Booking = {
      id: refId,
      propertyId: selectedRoom.id,
      roomNumber: selectedRoom.roomNumber,
      propertyTitle: selectedRoom.title,
      propertyLocation: selectedRoom.location,
      propertyImage: selectedRoom.image,
      checkIn,
      checkOut,
      nights,
      guests: Number(guests),
      basePrice: baseTotal,
      cleaningFee: 0,
      serviceFee: 0,
      grandTotal,
      guestName: guestName.includes('(Walk-in)') ? guestName : `${guestName} (Walk-in)`,
      guestEmail: 'walkin@diversionvigan.ph',
      guestPhone: guestPhone || '+63 900 000 0000',
      paymentMethod,
      paymentStatus: 'Paid',
      bookingDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Checked In'
    };

    onCreateWalkIn(newBooking);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative max-h-[92vh] overflow-y-auto">
        
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              Fast Walk-In Guest Check-In
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          <div>
            <label className="block font-bold text-slate-700 mb-1">Assign Room Unit</label>
            <select
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900 focus:ring-2 focus:ring-rose-500"
            >
              {rooms.map(r => (
                <option key={r.id} value={r.id}>
                  {r.title} — from {formatCurrency(r.price)}/nt (Max {r.maxGuests} pax)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Guest Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Maria Santos"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-900 focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
            <input
              type="tel"
              required
              placeholder="+63 917 123 4567"
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-900 focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Check-in</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Check-out</label>
              <input
                type="date"
                min={checkIn}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Pax Count (Max {selectedRoom ? selectedRoom.maxGuests : 8} pax)
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 font-semibold"
            >
              {[...Array(selectedRoom ? selectedRoom.maxGuests : 8)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Payment Received Via</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'cash_onsite', label: 'Cash Onsite' },
                { id: 'gcash', label: 'GCash / QR' },
                { id: 'card', label: 'POS Card' }
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`py-2 rounded-xl border text-center font-bold text-[11px] transition-all ${
                    paymentMethod === m.id
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing summary */}
          <div className="p-3.5 bg-slate-900 text-white rounded-2xl flex items-center justify-between font-bold">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">
                Total Custom Rate ({nights} {nights === 1 ? 'night' : 'nights'}, {guests} pax)
              </span>
              <span className="text-emerald-400 text-base font-black">{formatCurrency(grandTotal)}</span>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
              STATUS: CHECKED IN
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-2xl font-black shadow-md transition-all active:scale-95 cursor-pointer"
          >
            Register & Check In Walk-In Guest
          </button>

        </form>

      </div>
    </div>
  );
};
