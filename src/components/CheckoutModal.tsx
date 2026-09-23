import React, { useState, useEffect } from 'react';
import { Room, Booking } from '../types';
import { formatCurrency, generateBookingRef } from '../services/api';
import confetti from 'canvas-confetti';
import {
  X,
  CreditCard,
  Wallet,
  Coins,
  ShieldCheck,
  Calendar,
  Users,
  MapPin,
  CheckCircle,
  FileText,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  KeyRound,
  UserCheck,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';

interface CheckoutModalProps {
  bookingDraft: {
    property: Room;
    checkIn: string;
    checkOut: string;
    nights: number;
    guests: number;
    grandTotal: number;
  };
  onClose: () => void;
  onConfirmBooking: (booking: Booking) => void;
}

interface StoredAccount {
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  bookingDraft,
  onClose,
  onConfirmBooking
}) => {
  const { property, checkIn, checkOut, nights, guests, grandTotal } = bookingDraft;

  // Authentication & Guest state
  const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signup');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('+63 9');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [specialRequests, setSpecialRequests] = useState('Van parking slot needed, ETA ~3:00 PM.');
  const [paymentMethod, setPaymentMethod] = useState<'gcash' | 'maya' | 'card' | 'paylater'>('gcash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Load existing current session if available
  useEffect(() => {
    try {
      const activeSession = localStorage.getItem('diversion_vigan_active_guest');
      if (activeSession) {
        const parsed = JSON.parse(activeSession);
        if (parsed.email) {
          setGuestName(parsed.name || '');
          setGuestEmail(parsed.email || '');
          setGuestPhone(parsed.phone || '+63 9');
          setIsSignedIn(true);
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const getStoredAccounts = (): StoredAccount[] => {
    try {
      const accs = localStorage.getItem('diversion_vigan_guest_accounts');
      return accs ? JSON.parse(accs) : [];
    } catch {
      return [];
    }
  };

  const handleSignIn = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);

    if (!guestEmail.trim() || !password) {
      setAuthError('Please enter both your email address and password.');
      return;
    }

    const accounts = getStoredAccounts();
    const found = accounts.find(
      (a) => a.email.toLowerCase() === guestEmail.trim().toLowerCase()
    );

    if (!found) {
      setAuthError('No account found with this email. Please switch to Sign Up.');
      return;
    }

    if (found.passwordHash !== password) {
      setAuthError('Incorrect password. Please try again.');
      return;
    }

    setGuestName(found.name);
    setGuestPhone(found.phone);
    setIsSignedIn(true);
    try {
      localStorage.setItem(
        'diversion_vigan_active_guest',
        JSON.stringify({ name: found.name, email: found.email, phone: found.phone })
      );
    } catch {}
  };

  const handleSignOutAccount = () => {
    setIsSignedIn(false);
    setPassword('');
    setConfirmPassword('');
    try {
      localStorage.removeItem('diversion_vigan_active_guest');
    } catch {}
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    // If not signed in yet, validate sign-up / sign-in first
    if (!isSignedIn) {
      if (authMode === 'signin') {
        if (!guestEmail.trim() || !password) {
          setAuthError('Please enter your email and password to proceed.');
          return;
        }
        const accounts = getStoredAccounts();
        const found = accounts.find(
          (a) => a.email.toLowerCase() === guestEmail.trim().toLowerCase()
        );
        if (!found) {
          setAuthError('Account not found. Please Sign Up with your email and password.');
          return;
        }
        if (found.passwordHash !== password) {
          setAuthError('Incorrect password for this account.');
          return;
        }
        setGuestName(found.name);
        setGuestPhone(found.phone);
        setIsSignedIn(true);
      } else {
        // Sign up validation
        if (!guestName.trim()) {
          setAuthError('Please enter your Full Legal Name.');
          return;
        }
        if (!guestEmail.trim() || !guestEmail.includes('@')) {
          setAuthError('Please provide a valid email address.');
          return;
        }
        if (!password || password.length < 6) {
          setAuthError('Password must be at least 6 characters long.');
          return;
        }
        if (password !== confirmPassword) {
          setAuthError('Passwords do not match. Please re-enter your password.');
          return;
        }
        if (!guestPhone.trim()) {
          setAuthError('Please provide your contact phone number.');
          return;
        }

        // Store new account
        const accounts = getStoredAccounts();
        const existingIndex = accounts.findIndex(
          (a) => a.email.toLowerCase() === guestEmail.trim().toLowerCase()
        );

        const newAccount: StoredAccount = {
          name: guestName.trim(),
          email: guestEmail.trim(),
          phone: guestPhone.trim(),
          passwordHash: password
        };

        if (existingIndex >= 0) {
          accounts[existingIndex] = newAccount;
        } else {
          accounts.push(newAccount);
        }

        try {
          localStorage.setItem('diversion_vigan_guest_accounts', JSON.stringify(accounts));
          localStorage.setItem(
            'diversion_vigan_active_guest',
            JSON.stringify({ name: newAccount.name, email: newAccount.email, phone: newAccount.phone })
          );
        } catch {}

        setIsSignedIn(true);
      }
    }

    setIsSubmitting(true);

    const refCode = generateBookingRef();
    const newBooking: Booking = {
      id: refCode,
      propertyId: property.id,
      roomNumber: property.roomNumber || '1',
      propertyTitle: property.title,
      propertyLocation: property.location,
      propertyImage: property.image,
      checkIn,
      checkOut,
      nights,
      guests,
      basePrice: property.price * nights,
      cleaningFee: 0,
      serviceFee: 0,
      grandTotal,
      guestName: guestName.trim() || 'Valued Guest',
      guestEmail: guestEmail.trim(),
      guestPhone: guestPhone.trim(),
      specialRequests,
      paymentMethod,
      paymentStatus: paymentMethod === 'paylater' ? 'Onsite' : 'Paid',
      bookingDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Confirmed'
    };

    // Confetti effect
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {}

    setTimeout(() => {
      setIsSubmitting(false);
      onConfirmBooking(newBooking);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 leading-tight">
                Confirm Guest Reservation
              </h2>
              <p className="text-[11px] text-slate-500">Sign up or sign in to finalize your booking</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Room Summary preview */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 flex items-center gap-3.5">
            <img
              src={property.image}
              alt={property.title}
              className="w-16 h-16 rounded-xl object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-rose-600 uppercase">{property.category}</span>
              <h4 className="text-xs font-bold text-slate-900 truncate">{property.title}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {checkIn} to {checkOut} • {nights} {nights === 1 ? 'night' : 'nights'} • {guests} guests
              </p>
              <p className="text-xs font-black text-rose-600 mt-1">
                Total: {formatCurrency(grandTotal)}
              </p>
            </div>
          </div>

          {/* Guest Account Sign Up / Sign In Panel */}
          <div className="bg-gradient-to-br from-slate-50 to-rose-50/30 p-4 rounded-2xl border border-slate-200/90 space-y-3">
            
            {isSignedIn ? (
              /* Signed In Guest Profile Card */
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-black tracking-wider text-emerald-600 block">
                        Guest Account Authenticated
                      </span>
                      <h4 className="text-xs font-extrabold text-slate-900">{guestName}</h4>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSignOutAccount}
                    className="text-[11px] font-bold text-rose-600 hover:text-rose-700 underline"
                  >
                    Switch Account
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-200/60">
                  <div className="bg-white/80 p-2 rounded-xl border border-slate-200/60">
                    <span className="text-[9px] text-slate-400 font-bold block uppercase">Email</span>
                    <span className="font-semibold text-slate-800 truncate block">{guestEmail}</span>
                  </div>
                  <div className="bg-white/80 p-2 rounded-xl border border-slate-200/60">
                    <span className="text-[9px] text-slate-400 font-bold block uppercase">Phone</span>
                    <span className="font-semibold text-slate-800 truncate block">{guestPhone}</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Sign Up / Sign In Form */
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-slate-200/70">
                  <div className="flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-rose-500" />
                    <span className="text-xs font-extrabold text-slate-900">
                      {authMode === 'signup' ? 'Guest Sign Up' : 'Guest Sign In'}
                    </span>
                  </div>

                  {/* Auth mode toggle pills */}
                  <div className="flex bg-slate-200/80 p-0.5 rounded-xl text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => { setAuthMode('signup'); setAuthError(null); }}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        authMode === 'signup'
                          ? 'bg-white text-rose-600 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Sign Up
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAuthMode('signin'); setAuthError(null); }}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        authMode === 'signin'
                          ? 'bg-white text-rose-600 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Sign In
                    </button>
                  </div>
                </div>

                {authError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-700 font-semibold flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                    <span>{authError}</span>
                  </div>
                )}

                {/* SIGN UP FORM FIELDS */}
                {authMode === 'signup' && (
                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Full Legal Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Maria Santos"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Email Address <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="your.email@example.com"
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Contact Phone (PH) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="+63 917 123 4567"
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Create Password <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            placeholder="Min. 6 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-none pr-8"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Confirm Password <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="Re-type password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* SIGN IN FORM FIELDS */}
                {authMode === 'signin' && (
                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Registered Email <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="your.email@example.com"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Password <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="Enter your account password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-none pr-8"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleSignIn}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Log In to Existing Account</span>
                    </button>
                  </div>
                )}

              </div>
            )}

          </div>

          {/* Special Requests */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Special Requests / ETA (Optional)
            </label>
            <input
              type="text"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="e.g. Need parking for 2 vehicles, late check-in"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2 pt-1">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Select Payment Method
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'gcash', label: 'GCash', icon: Wallet, desc: 'Instant QR / Number' },
                { id: 'maya', label: 'Maya', icon: Wallet, desc: 'E-wallet' },
                { id: 'card', label: 'Card', icon: CreditCard, desc: 'Visa / Mastercard' },
                { id: 'paylater', label: 'Pay Onsite', icon: Coins, desc: 'Cash / GCash at gate' }
              ].map((method) => {
                const Icon = method.icon;
                const isSelected = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id as any)}
                    className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50/60 text-rose-600 font-bold shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[11px] font-bold">{method.label}</span>
                    <span className="text-[9px] text-slate-400 truncate w-full">{method.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Official Bank & E-Wallet Accounts (with copy-paste buttons) */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-3 text-xs">
            <h4 className="font-black text-rose-400 uppercase tracking-wider text-[11px]">
              Payment Details & Account Information
            </h4>
            
            {/* BDO */}
            <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">BDO Saving Account</span>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-white text-xs">Mark Benedict V. Apelin</p>
                  <p className="font-mono text-xs text-amber-300 font-bold">0082 2007 7587</p>
                </div>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleCopyText('Mark Benedict V. Apelin', 'bdo-name')}
                    className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedField === 'bdo-name' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-300" />}
                    <span>{copiedField === 'bdo-name' ? 'Copied Name' : 'Copy Name'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopyText('008220077587', 'bdo-acc')}
                    className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedField === 'bdo-acc' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-300" />}
                    <span>{copiedField === 'bdo-acc' ? 'Copied Acc #' : 'Copy Acc #'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* GCASH */}
            <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">GCASH</span>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-white text-xs">Mark Benedict Apelin</p>
                  <p className="font-mono text-xs text-amber-300 font-bold">09175681408</p>
                </div>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleCopyText('Mark Benedict Apelin', 'gcash-name')}
                    className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedField === 'gcash-name' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-300" />}
                    <span>{copiedField === 'gcash-name' ? 'Copied Name' : 'Copy Name'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopyText('09175681408', 'gcash-num')}
                    className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedField === 'gcash-num' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-300" />}
                    <span>{copiedField === 'gcash-num' ? 'Copied Number' : 'Copy Number'}</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Security Guarantee */}
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-2.5 text-emerald-900 text-xs font-medium">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Secure reservation & account protection. Your stay is instantly reserved.</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white py-3.5 rounded-2xl font-black text-xs sm:text-sm shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            {isSubmitting ? (
              <span className="animate-pulse">Locking Reservation...</span>
            ) : (
              <span>
                {isSignedIn
                  ? `Confirm & Lock Booking (${formatCurrency(grandTotal)})`
                  : authMode === 'signup'
                  ? `Sign Up & Lock Booking (${formatCurrency(grandTotal)})`
                  : `Sign In & Lock Booking (${formatCurrency(grandTotal)})`}
              </span>
            )}
          </button>

        </form>

      </div>
    </div>
  );
};
