import React, { useState, useEffect, useMemo } from 'react';
import { Booking, Room } from '../types';
import { formatCurrency, api } from '../services/api';
import { calculateCustomStayPrice } from '../services/pricing';
import {
  CalendarCheck,
  Search,
  Printer,
  Copy,
  Calendar,
  User,
  MapPin,
  XCircle,
  MessageSquare,
  Sparkles,
  CheckCircle,
  AlertCircle,
  LogOut,
  LogIn,
  KeyRound,
  ShieldCheck,
  Phone,
  Mail,
  Info,
  ChevronRight,
  Eye,
  X,
  CreditCard,
  Building,
  Bed,
  Users,
  RefreshCw,
  Check
} from 'lucide-react';

interface BookingLookupViewProps {
  bookings: Booking[];
  rooms?: Room[];
  onCancelBooking: (id: string) => void;
  onViewVoucher: (booking: Booking) => void;
  onOpenReviewModal: (booking: Booking) => void;
  onUpdateBooking?: (booking: Booking) => Promise<any> | void;
}

interface ActiveGuest {
  name: string;
  email: string;
  phone: string;
}

interface StoredAccount {
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
}

export const BookingLookupView: React.FC<BookingLookupViewProps> = ({
  bookings,
  rooms = [],
  onCancelBooking,
  onViewVoucher,
  onOpenReviewModal,
  onUpdateBooking
}) => {
  const [activeGuest, setActiveGuest] = useState<ActiveGuest | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [detailedBooking, setDetailedBooking] = useState<Booking | null>(null);

  // Rebooking state inside customer reservation details
  const [isRebooking, setIsRebooking] = useState(false);
  const [rebookCheckIn, setRebookCheckIn] = useState('');
  const [rebookCheckOut, setRebookCheckOut] = useState('');
  const [rebookGuests, setRebookGuests] = useState(2);
  const [rebookSuccessMsg, setRebookSuccessMsg] = useState<string | null>(null);
  const [isSavingRebook, setIsSavingRebook] = useState(false);

  // Find room details for custom rate recalculation
  const rebookingRoom = useMemo(() => {
    if (!detailedBooking) return null;
    const found = rooms.find((r) => r.id === detailedBooking.propertyId || r.roomNumber === detailedBooking.roomNumber);
    if (found) return found;

    return {
      id: detailedBooking.propertyId || 'room-rebook',
      roomNumber: detailedBooking.roomNumber || '1',
      title: detailedBooking.propertyTitle || 'Diversion Vigan Room',
      category: 'Family Suites',
      price: detailedBooking.nights > 0 ? Math.round(detailedBooking.basePrice / detailedBooking.nights) : 1000,
      maxGuests: Math.max(detailedBooking.guests || 5, 8)
    } as Room;
  }, [rooms, detailedBooking]);

  // Compute stay price for new selected dates (from total booking amount, not partial)
  const rebookingCalculation = useMemo(() => {
    if (!detailedBooking || !rebookingRoom || !rebookCheckIn || !rebookCheckOut) return null;
    return calculateCustomStayPrice(rebookingRoom, rebookCheckIn, rebookCheckOut, rebookGuests);
  }, [rebookingRoom, rebookCheckIn, rebookCheckOut, rebookGuests, detailedBooking]);

  const originalBookingTotal = detailedBooking ? detailedBooking.grandTotal : 0;
  const rebookingFee = originalBookingTotal * 0.40;
  const newBookingTotal = rebookingCalculation ? rebookingCalculation.grandTotal : originalBookingTotal;
  const finalRebookGrandTotal = newBookingTotal + rebookingFee;
  const rebookDifference = finalRebookGrandTotal - originalBookingTotal;

  const handleConfirmRebooking = async () => {
    if (!detailedBooking || !rebookingCalculation) return;
    setIsSavingRebook(true);
    try {
      const updated: Booking = {
        ...detailedBooking,
        checkIn: rebookCheckIn,
        checkOut: rebookCheckOut,
        nights: rebookingCalculation.nights,
        guests: rebookGuests,
        basePrice: rebookingCalculation.baseTotal,
        cleaningFee: 0,
        grandTotal: finalRebookGrandTotal,
        status: detailedBooking.status === 'Cancelled' ? 'Confirmed' : detailedBooking.status
      };

      if (onUpdateBooking) {
        await onUpdateBooking(updated);
      } else {
        await api.updateBooking(updated.id, updated);
      }

      setDetailedBooking(updated);
      setIsRebooking(false);
      setRebookSuccessMsg(`Reservation rebooked successfully! Stay updated to ${rebookCheckIn} — ${rebookCheckOut}. Auto-computed total: ${formatCurrency(updated.grandTotal)}.`);
    } catch (err) {
      alert('Error updating reservation dates. Please try again.');
    } finally {
      setIsSavingRebook(false);
    }
  };

  // Sign in state for guest
  const [showLoginBox, setShowLoginBox] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Check current guest session on mount
  useEffect(() => {
    try {
      const session = localStorage.getItem('diversion_vigan_active_guest');
      if (session) {
        const parsed = JSON.parse(session);
        if (parsed && parsed.email) {
          setActiveGuest(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('diversion_vigan_active_guest');
    } catch {
      // ignore
    }
    setActiveGuest(null);
    setSearchQuery('');
  };

  const getStoredAccounts = (): StoredAccount[] => {
    try {
      const accs = localStorage.getItem('diversion_vigan_guest_accounts');
      return accs ? JSON.parse(accs) : [];
    } catch {
      return [];
    }
  };

  const handleGuestLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginEmail.trim() || !loginPassword) {
      setLoginError('Please enter both your email address and password.');
      return;
    }

    const accounts = getStoredAccounts();
    const found = accounts.find(
      (a) => a.email.toLowerCase() === loginEmail.trim().toLowerCase()
    );

    if (!found) {
      // Check if there is any booking with this email
      const matchedBooking = bookings.find(
        (b) => b.guestEmail.toLowerCase() === loginEmail.trim().toLowerCase()
      );

      if (matchedBooking) {
        const newSession = {
          name: matchedBooking.guestName,
          email: matchedBooking.guestEmail,
          phone: matchedBooking.guestPhone
        };
        try {
          localStorage.setItem('diversion_vigan_active_guest', JSON.stringify(newSession));
        } catch {}
        setActiveGuest(newSession);
        setShowLoginBox(false);
        setLoginEmail('');
        setLoginPassword('');
        return;
      }

      setLoginError('No guest account found with this email. Please check your credentials.');
      return;
    }

    if (found.passwordHash !== loginPassword) {
      setLoginError('Incorrect password. Please try again.');
      return;
    }

    const session = {
      name: found.name,
      email: found.email,
      phone: found.phone
    };
    try {
      localStorage.setItem('diversion_vigan_active_guest', JSON.stringify(session));
    } catch {}
    setActiveGuest(session);
    setShowLoginBox(false);
    setLoginEmail('');
    setLoginPassword('');
  };

  // Filter bookings: If active guest is logged in, show their bookings by default
  const filteredBookings = bookings.filter((b) => {
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      return (
        b.id.toLowerCase().includes(q) ||
        b.guestName.toLowerCase().includes(q) ||
        b.guestEmail.toLowerCase().includes(q) ||
        b.guestPhone.toLowerCase().includes(q) ||
        b.propertyTitle.toLowerCase().includes(q)
      );
    }

    if (activeGuest && activeGuest.email) {
      return (
        b.guestEmail.toLowerCase() === activeGuest.email.toLowerCase() ||
        (activeGuest.phone && b.guestPhone === activeGuest.phone) ||
        b.guestName.toLowerCase() === activeGuest.name.toLowerCase()
      );
    }

    return true;
  });

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Guest Account Session Banner (When Logged In) */}
      {activeGuest ? (
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-5 sm:p-6 rounded-3xl shadow-lg border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white font-black text-lg shadow-md shrink-0">
              {activeGuest.name.charAt(0).toUpperCase() || 'G'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full">
                  Authenticated Guest
                </span>
                <span className="text-xs text-slate-400 font-mono">{activeGuest.phone}</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white mt-0.5">
                {activeGuest.name}
              </h2>
              <p className="text-xs text-slate-300 flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-400" />
                <span>{activeGuest.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-700">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-white border border-rose-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out from Account</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Have an existing guest account?
              </h3>
              <p className="text-xs text-slate-500">
                Log in with your account to view your private reservations and stay vouchers.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowLoginBox(!showLoginBox)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
          >
            <LogIn className="w-3.5 h-3.5 text-rose-400" />
            <span>{showLoginBox ? 'Hide Sign In' : 'Guest Sign In'}</span>
          </button>
        </div>
      )}

      {/* Guest Login Form Dropdown */}
      {!activeGuest && showLoginBox && (
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-md animate-fade-in space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-rose-500" />
              Guest Account Sign In
            </h4>
            <span className="text-[11px] text-slate-400">Created during room booking</span>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleGuestLogin} className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
            <div className="sm:col-span-5">
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                Account Email Address
              </label>
              <input
                type="email"
                required
                placeholder="e.g. maria@gmail.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-900 focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                Account Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-900 focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="sm:col-span-3 flex items-end">
              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-xl font-bold cursor-pointer transition-all shadow-md shadow-rose-200 active:scale-95"
              >
                Log In & View
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
            Reservation Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-serif-heading">
            {activeGuest ? `${activeGuest.name}'s Reservations` : 'My Transient Reservations'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {activeGuest
              ? 'Here are your confirmed stay records, room vouchers, and booking details.'
              : 'View booking vouchers, check payment status, and manage your upcoming stays in Vigan City.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-full border border-slate-200">
            {filteredBookings.length} {filteredBookings.length === 1 ? 'Stay' : 'Stays'} Recorded
          </span>
        </div>
      </div>

      {/* Search Bar for Ref ID / Guest info */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Search by Reference Code (e.g. DVG-VG782-4192), room title, or date..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-slate-400 hover:text-slate-600 font-bold px-2 cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <CalendarCheck className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {searchQuery ? 'No matching reservations found' : 'No reservations found for this account'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? 'Please double check your Reference Number or search term.'
              : 'Browse our heritage transient rooms along Diversion Road to reserve your stay.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row gap-5 items-start md:items-center justify-between"
            >
              {/* Left: Image & Details */}
              <div className="flex gap-4 items-center min-w-0">
                <img
                  src={booking.propertyImage}
                  alt={booking.propertyTitle}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0 border border-slate-100"
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        booking.status === 'Confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : booking.status === 'Checked In'
                          ? 'bg-blue-100 text-blue-800'
                          : booking.status === 'Checked Out'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {booking.status}
                    </span>

                    <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                      Ref: {booking.id}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
                    {booking.propertyTitle}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>{booking.checkIn} — {booking.checkOut} ({booking.nights} {booking.nights === 1 ? 'night' : 'nights'})</span>
                  </p>

                  <div className="flex items-center gap-3 text-xs font-semibold text-slate-700 mt-2">
                    <span>Guest: <strong>{booking.guestName}</strong></span>
                    <span>•</span>
                    <span className="text-rose-600 font-extrabold">{formatCurrency(booking.grandTotal)}</span>
                    <span>({booking.paymentStatus})</span>
                  </div>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                {/* View Details Button */}
                <button
                  onClick={() => setDetailedBooking(booking)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  title="View full booking details"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-600" />
                  <span>View Details</span>
                </button>

                <button
                  onClick={() => handleCopy(booking.id)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedId === booking.id ? 'Copied!' : 'Copy Ref'}</span>
                </button>

                <button
                  onClick={() => onViewVoucher(booking)}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-rose-400" />
                  <span>Voucher</span>
                </button>

                <button
                  onClick={() => onOpenReviewModal(booking)}
                  className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 border border-amber-200 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Review</span>
                </button>

                {booking.status !== 'Cancelled' && (
                  <button
                    onClick={() => {
                      if (confirm(`Cancel reservation ${booking.id}?`)) {
                        onCancelBooking(booking.id);
                      }
                    }}
                    className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Complete Customer Reservation Details Modal */}
      {detailedBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                  Customer Reservation Details
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  Reference: {detailedBooking.id}
                </h3>
              </div>
              <button
                onClick={() => setDetailedBooking(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Property Card */}
              <div className="flex gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <img
                  src={detailedBooking.propertyImage}
                  alt={detailedBooking.propertyTitle}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{detailedBooking.propertyTitle}</h4>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                    <span>{detailedBooking.propertyLocation || 'Diversion Road, Vigan City, Ilocos Sur'}</span>
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.2 rounded-md">
                    Status: {detailedBooking.status}
                  </span>
                </div>
              </div>

              {/* REBOOKING VIEW (When customer clicks Rebook) */}
              {isRebooking ? (
                <div className="p-4 bg-slate-50 rounded-2xl border-2 border-rose-300 space-y-3.5 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-xs font-black text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 text-rose-600 animate-spin" />
                      Rebooking & Date Rescheduling
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsRebooking(false)}
                      className="text-[11px] font-bold text-slate-500 hover:text-slate-800 underline cursor-pointer"
                    >
                      Back
                    </button>
                  </div>

                  <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[11px] text-rose-900">
                    <p className="font-bold flex items-center gap-1 text-rose-700 mb-0.5">
                      <Sparkles className="w-3.5 h-3.5" /> Auto-Compute from Total Booking Amount
                    </p>
                    <p className="text-slate-600 leading-tight">
                      Rates for new dates are automatically computed from your Total Booking Amount (<strong>{formatCurrency(originalBookingTotal)}</strong>), not from partial payments.
                    </p>
                  </div>

                  {/* New Dates Pickers */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase text-slate-600 mb-1">
                        New Check-In Date
                      </label>
                      <input
                        type="date"
                        value={rebookCheckIn}
                        onChange={(e) => setRebookCheckIn(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase text-slate-600 mb-1">
                        New Check-Out Date
                      </label>
                      <input
                        type="date"
                        value={rebookCheckOut}
                        min={rebookCheckIn}
                        onChange={(e) => setRebookCheckOut(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Guests Adjustment */}
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-slate-600 mb-1">
                      Guest Count (Pax)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={rebookingRoom?.maxGuests || 20}
                      value={rebookGuests}
                      onChange={(e) => setRebookGuests(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                  </div>

                  {/* Auto-Compute Calculation Details Box */}
                  {rebookingCalculation && (
                    <div className="p-3 bg-slate-900 text-white rounded-xl space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-300">
                        <span>Original Total Booking Amount:</span>
                        <span className="font-bold text-white">{formatCurrency(originalBookingTotal)}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>40% Rebooking Fee (Auto-computed):</span>
                        <span className="font-bold text-rose-400">+{formatCurrency(rebookingFee)}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>New Stay Total ({rebookingCalculation.nights} {rebookingCalculation.nights === 1 ? 'night' : 'nights'} • {rebookGuests} pax):</span>
                        <span className="font-bold text-amber-400">{formatCurrency(newBookingTotal)}</span>
                      </div>

                      {/* Final Total with 40% Rebooking Fee */}
                      <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-black text-rose-400">
                        <span>New Grand Total (incl. 40% Fee):</span>
                        <span>{formatCurrency(finalRebookGrandTotal)}</span>
                      </div>
                    </div>
                  )}

                  {/* Confirm Rebooking Buttons */}
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      disabled={isSavingRebook}
                      onClick={handleConfirmRebooking}
                      className="flex-1 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isSavingRebook ? (
                        <span>Updating Reservation...</span>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Confirm & Save Rebooking</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsRebooking(false)}
                      className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Stay Dates Grid */}
                  <div className="grid grid-cols-2 gap-2.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Check-in</span>
                      <span className="font-bold text-slate-900 text-xs mt-0.5 block">{detailedBooking.checkIn}</span>
                      <span className="text-[10px] text-slate-500">Standard Check-in: 2:00 PM</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Check-out</span>
                      <span className="font-bold text-slate-900 text-xs mt-0.5 block">{detailedBooking.checkOut}</span>
                      <span className="text-[10px] text-slate-500">Standard Check-out: 12:00 NN</span>
                    </div>
                  </div>

                  {/* Guest & Pax Details */}
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <span className="text-[10px] font-black uppercase text-slate-400 block">Guest Information</span>
                    <div className="grid grid-cols-2 gap-2 text-slate-700">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Primary Guest</span>
                        <span className="font-bold text-slate-900">{detailedBooking.guestName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Party Size</span>
                        <span className="font-bold text-slate-900">{detailedBooking.guests} Guests</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Contact Phone</span>
                        <span className="font-mono text-slate-800">{detailedBooking.guestPhone}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Email Address</span>
                        <span className="text-slate-800 truncate block">{detailedBooking.guestEmail}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Breakdown (Clean zero sanitization fee) */}
                  <div className="p-3.5 bg-slate-900 text-white rounded-2xl space-y-2 font-mono">
                    <div className="flex justify-between text-slate-300 text-xs font-sans">
                      <span>Stay ({detailedBooking.nights} {detailedBooking.nights === 1 ? 'night' : 'nights'})</span>
                      <span>{formatCurrency(detailedBooking.basePrice)}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-black font-sans text-rose-400">
                      <span>Total Amount Booking</span>
                      <span>{formatCurrency(detailedBooking.grandTotal)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-sans pt-1">
                      <span>Payment Method: <strong className="text-white uppercase">{detailedBooking.paymentMethod}</strong></span>
                      <span className="text-emerald-400 font-bold">{detailedBooking.paymentStatus}</span>
                    </div>
                  </div>

                  {/* Rebooking Feature Box */}
                  <div className="p-3.5 bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl border border-rose-200/80 flex items-center justify-between gap-3">
                    <div>
                      <span className="font-extrabold text-slate-900 block text-xs">Need to change dates or rebook?</span>
                      <span className="text-[10px] text-slate-600 block">Auto-computes difference from total amount booking (<strong>{formatCurrency(detailedBooking.grandTotal)}</strong>)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setRebookCheckIn(detailedBooking.checkIn);
                        setRebookCheckOut(detailedBooking.checkOut);
                        setRebookGuests(detailedBooking.guests || 2);
                        setIsRebooking(true);
                        setRebookSuccessMsg(null);
                      }}
                      className="px-3 py-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-xl font-extrabold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-all active:scale-95 shrink-0"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Rebook Stay</span>
                    </button>
                  </div>

                  {/* Actions inside details modal */}
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        onViewVoucher(detailedBooking);
                        setDetailedBooking(null);
                      }}
                      className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Printer className="w-4 h-4 text-rose-400" />
                      <span>Print Stay Voucher</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDetailedBooking(null)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
