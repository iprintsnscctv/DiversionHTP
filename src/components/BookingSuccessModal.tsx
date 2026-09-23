import React from 'react';
import { Booking } from '../types';
import { formatCurrency } from '../services/api';
import {
  CheckCircle2,
  Printer,
  Copy,
  Calendar,
  MapPin,
  MessageSquare,
  Share2,
  X,
  Sparkles,
  Phone
} from 'lucide-react';

interface BookingSuccessModalProps {
  booking: Booking;
  onClose: () => void;
  onViewVoucher: () => void;
  onCopyRef: () => void;
}

export const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({
  booking,
  onClose,
  onViewVoucher,
  onCopyRef
}) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 text-center relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Big Success Icon */}
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full mb-2">
          <Sparkles className="w-3 h-3" /> Reservation Confirmed
        </span>

        <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-serif-heading">
          You're All Set for Vigan!
        </h2>
        
        <p className="text-xs text-slate-500 mt-1">
          Your room has been locked at Diversion Vigan Transient House. A confirmation voucher has been generated.
        </p>

        {/* Reference Code Card */}
        <div className="my-5 p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 text-left space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-slate-400">Booking Reference</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">
              {booking.status}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="text-base sm:text-lg font-mono font-black text-amber-300 tracking-wider">
              {booking.id}
            </span>
            <button
              onClick={onCopyRef}
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
            >
              <Copy className="w-3 h-3" /> Copy
            </button>
          </div>

          <div className="border-t border-slate-800 pt-2 text-xs text-slate-300 space-y-1">
            <p className="font-semibold text-white truncate">{booking.propertyTitle}</p>
            <p className="text-[11px] text-slate-400">{booking.checkIn} to {booking.checkOut} ({booking.nights} nights)</p>
            <p className="text-[11px] font-bold text-rose-400">Total: {formatCurrency(booking.grandTotal)}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          <button
            onClick={onViewVoucher}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-2xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <Printer className="w-4 h-4 text-rose-400" />
            <span>View & Print Booking Voucher</span>
          </button>

          <button
            onClick={onClose}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-2xl font-bold text-xs transition-colors"
          >
            Done / Browse Other Rooms
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-center gap-1">
          <Phone className="w-3 h-3 text-rose-500" /> Need assistance? Call Host at +63 917 890 1234
        </div>

      </div>
    </div>
  );
};
