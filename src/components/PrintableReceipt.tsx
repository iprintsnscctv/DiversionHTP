import React from 'react';
import { Booking } from '../types';
import { formatCurrency } from '../services/api';
import {
  Printer,
  X,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Calendar,
  User,
  CreditCard,
  QrCode
} from 'lucide-react';

interface PrintableReceiptProps {
  booking: Booking;
  onClose: () => void;
}

export const PrintableReceipt: React.FC<PrintableReceiptProps> = ({
  booking,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[92vh] overflow-y-auto">
        
        {/* Top Control Bar (Hidden on print) */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg">
              Official Guest Voucher
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Voucher</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div id="printable-receipt" className="space-y-6 text-left">
          
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-600 flex items-center justify-center text-white font-serif font-black text-sm">
                  DV
                </div>
                <div>
                  <h1 className="text-xl font-black text-slate-900 font-serif-heading leading-tight">
                    Diversion Vigan
                  </h1>
                  <p className="text-xs font-bold text-rose-600 uppercase tracking-wide">
                    Transient & Private Villa
                  </p>
                  <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                    Diversion Road, Vigan City, Ilocos Sur 2700
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Voucher Status</span>
              <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 inline-block mt-0.5">
                {booking.status}
              </span>
            </div>
          </div>

          {/* Booking Reference Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Booking Reference</span>
              <p className="font-mono font-black text-slate-900 text-sm mt-0.5">{booking.id}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Date Booked</span>
              <p className="font-bold text-slate-900 mt-0.5">{booking.bookingDate}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Payment Method</span>
              <p className="font-bold text-slate-900 uppercase mt-0.5">{booking.paymentMethod}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Payment Status</span>
              <p className="font-bold text-emerald-600 mt-0.5">{booking.paymentStatus}</p>
            </div>
          </div>

          {/* Guest & Room Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1.5 text-xs">
              <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-rose-500" /> Guest Details
              </h3>
              <p><span className="text-slate-500 font-medium">Guest Name:</span> <span className="font-bold text-slate-900">{booking.guestName}</span></p>
              <p><span className="text-slate-500 font-medium">Email:</span> <span className="font-semibold text-slate-800">{booking.guestEmail}</span></p>
              <p><span className="text-slate-500 font-medium">Phone:</span> <span className="font-semibold text-slate-800">{booking.guestPhone}</span></p>
              {booking.specialRequests && (
                <p><span className="text-slate-500 font-medium">Note:</span> <span className="text-slate-700 italic">{booking.specialRequests}</span></p>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1.5 text-xs">
              <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-rose-500" /> Stay Details
              </h3>
              <p><span className="text-slate-500 font-medium">Room Unit:</span> <span className="font-bold text-slate-900">{booking.propertyTitle}</span></p>
              <p><span className="text-slate-500 font-medium">Check-In:</span> <span className="font-bold text-emerald-700">{booking.checkIn} (From 2:00 PM)</span></p>
              <p><span className="text-slate-500 font-medium">Check-Out:</span> <span className="font-bold text-rose-700">{booking.checkOut} (Until 12:00 PM)</span></p>
              <p><span className="text-slate-500 font-medium">Duration / Guests:</span> <span className="font-bold text-slate-900">{booking.nights} nights • {booking.guests} guests</span></p>
            </div>
          </div>

          {/* Pricing Summary Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3">Description</th>
                  <th className="p-3 text-right">Rate</th>
                  <th className="p-3 text-right">Nights / Qty</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr>
                  <td className="p-3 font-semibold text-slate-900">{booking.propertyTitle}</td>
                  <td className="p-3 text-right">{formatCurrency(booking.nights > 0 ? (booking.basePrice / booking.nights) : booking.basePrice)}</td>
                  <td className="p-3 text-right">{booking.nights}</td>
                  <td className="p-3 text-right font-bold text-slate-900">{formatCurrency(booking.basePrice)}</td>
                </tr>
                {booking.cleaningFee > 0 && (
                  <tr>
                    <td className="p-3 text-slate-600">Cleaning</td>
                    <td className="p-3 text-right">{formatCurrency(booking.cleaningFee)}</td>
                    <td className="p-3 text-right">1</td>
                    <td className="p-3 text-right font-bold text-slate-900">{formatCurrency(booking.cleaningFee)}</td>
                  </tr>
                )}
                <tr className="bg-slate-50/80 font-bold">
                  <td colSpan={3} className="p-3 text-right text-slate-900 uppercase text-[11px]">Total Paid / Due:</td>
                  <td className="p-3 text-right text-rose-600 text-sm font-black">{formatCurrency(booking.grandTotal)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Important Transient House Policies */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <h4 className="font-bold text-slate-900 uppercase text-[10px]">House Rules & Information</h4>
            <p>• <strong>Check-in:</strong> 2:00 PM | <strong>Check-out:</strong> 12:00 PM</p>
            <p>• Free secure gated parking available for cars and vans. Gate accessible 24/7.</p>
            <p>• Please present this voucher or provide Ref ID <strong>{booking.id}</strong> upon arrival.</p>
            <p>• Contact Transient Caretaker/Host: <strong>+63 917 890 1234</strong> / <strong>diversionvigan@gmail.com</strong></p>
          </div>

        </div>

      </div>
    </div>
  );
};
