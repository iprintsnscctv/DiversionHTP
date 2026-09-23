import React, { useState } from 'react';
import { Room, Booking, Inquiry, Review, AdminStats } from '../types';
import { formatCurrency } from '../services/api';
import { AddEditRoomModal } from './AddEditRoomModal';
import { WalkInBookingModal } from './WalkInBookingModal';
import {
  ShieldCheck,
  Plus,
  UserPlus,
  Vault,
  Receipt,
  DoorOpen,
  TrendingUp,
  Search,
  Filter,
  Edit,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  MessageSquare,
  Sparkles,
  RotateCcw,
  Printer,
  Eye,
  EyeOff,
  AlertTriangle,
  Lock,
  KeyRound,
  LogIn,
  LogOut,
  UserCheck,
  Users,
  Star,
  Check,
  XCircle,
  ThumbsUp
} from 'lucide-react';

interface StaffAccount {
  id: string;
  name: string;
  username: string;
  password: string;
  role: string;
  createdAt: string;
}

interface AdminDashboardProps {
  rooms: Room[];
  bookings: Booking[];
  inquiries: Inquiry[];
  reviews: Review[];
  onSaveRoom: (room: Partial<Room>) => void;
  onDeleteRoom: (id: string) => void;
  onToggleDate: (roomId: string, dateStr: string) => void;
  onUpdateBookingStatus: (id: string, status: string) => void;
  onCancelBooking: (id: string) => void;
  onCreateWalkIn: (booking: Booking) => void;
  onViewVoucher: (booking: Booking) => void;
  onResetDemoData: () => void;
  onUpdateReviewStatus?: (id: string, status: 'Approved' | 'Pending' | 'Rejected') => void;
  onDeleteReview?: (id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  rooms,
  bookings,
  inquiries,
  reviews,
  onSaveRoom,
  onDeleteRoom,
  onToggleDate,
  onUpdateBookingStatus,
  onCancelBooking,
  onCreateWalkIn,
  onViewVoucher,
  onResetDemoData,
  onUpdateReviewStatus,
  onDeleteReview
}) => {
  // Authentication State
  const [sessionUser, setSessionUser] = useState<{ username: string; name: string; role: string } | null>(() => {
    try {
      const saved = localStorage.getItem('diversion_vigan_admin_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Staff Management State
  const [staffAccounts, setStaffAccounts] = useState<StaffAccount[]>(() => {
    try {
      const saved = localStorage.getItem('diversion_vigan_staff_list');
      return saved ? JSON.parse(saved) : [
        {
          id: 'staff-1',
          name: 'Maria Santos (Front Desk)',
          username: 'staff_maria',
          password: 'vigan@staff2025',
          role: 'Front Desk / Receptionist',
          createdAt: 'Jan 15, 2025'
        }
      ];
    } catch {
      return [];
    }
  });

  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffUsername, setNewStaffUsername] = useState('');
  const [newStaffPassword, setNewStaffPassword] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('Front Desk / Receptionist');
  const [showNewStaffPassword, setShowNewStaffPassword] = useState(false);
  const [staffSuccessMsg, setStaffSuccessMsg] = useState<string | null>(null);
  const [staffErrorMsg, setStaffErrorMsg] = useState<string | null>(null);
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});

  const [adminTab, setAdminTab] = useState<'overview' | 'rooms' | 'bookings' | 'reviews' | 'staff' | 'inquiries'>('overview');
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isWalkInOpen, setIsWalkInOpen] = useState(false);
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>('All');
  const [bookingSearch, setBookingSearch] = useState('');
  const [roomSearch, setRoomSearch] = useState('');
  const [reviewFilterStatus, setReviewFilterStatus] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [reviewSearch, setReviewSearch] = useState('');

  // Persist staff accounts
  const saveStaffAccounts = (accounts: StaffAccount[]) => {
    setStaffAccounts(accounts);
    try {
      localStorage.setItem('diversion_vigan_staff_list', JSON.stringify(accounts));
    } catch {}
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const userClean = loginUsername.trim();
    const passClean = loginPassword;

    // Check Master Admin (admin / apelin@123)
    if (userClean.toLowerCase() === 'admin' && passClean === 'apelin@123') {
      const adminSession = {
        username: 'admin',
        name: 'Master Administrator',
        role: 'Super Admin'
      };
      setSessionUser(adminSession);
      try {
        localStorage.setItem('diversion_vigan_admin_session', JSON.stringify(adminSession));
      } catch {}
      return;
    }

    // Check Staff Accounts
    const foundStaff = staffAccounts.find(
      s => s.username.toLowerCase() === userClean.toLowerCase() && s.password === passClean
    );

    if (foundStaff) {
      const staffSession = {
        username: foundStaff.username,
        name: foundStaff.name,
        role: foundStaff.role
      };
      setSessionUser(staffSession);
      try {
        localStorage.setItem('diversion_vigan_admin_session', JSON.stringify(staffSession));
      } catch {}
      return;
    }

    setLoginError('Invalid username or password. Please verify your credentials.');
  };

  const handleLogout = () => {
    setSessionUser(null);
    setLoginUsername('');
    setLoginPassword('');
    try {
      localStorage.removeItem('diversion_vigan_admin_session');
    } catch {}
  };

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    setStaffErrorMsg(null);
    setStaffSuccessMsg(null);

    const trimmedUser = newStaffUsername.trim().toLowerCase();
    if (!trimmedUser || !newStaffPassword || !newStaffName.trim()) {
      setStaffErrorMsg('Please fill in all staff fields.');
      return;
    }

    if (trimmedUser === 'admin') {
      setStaffErrorMsg('The username "admin" is reserved for the Master Administrator.');
      return;
    }

    if (staffAccounts.some(s => s.username.toLowerCase() === trimmedUser)) {
      setStaffErrorMsg('This username already exists. Please choose a different username.');
      return;
    }

    const newStaff: StaffAccount = {
      id: `staff-${Date.now()}`,
      name: newStaffName.trim(),
      username: trimmedUser,
      password: newStaffPassword,
      role: newStaffRole,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    const updated = [newStaff, ...staffAccounts];
    saveStaffAccounts(updated);
    setStaffSuccessMsg(`Staff account "${newStaff.username}" created successfully!`);
    setNewStaffName('');
    setNewStaffUsername('');
    setNewStaffPassword('');
  };

  const handleDeleteStaff = (id: string, username: string) => {
    if (confirm(`Are you sure you want to revoke credentials for "${username}"?`)) {
      const updated = staffAccounts.filter(s => s.id !== id);
      saveStaffAccounts(updated);
      setStaffSuccessMsg(`Account for "${username}" has been removed.`);
    }
  };

  // Calculations
  const activeBookings = bookings.filter(b => b.status !== 'Cancelled');
  const totalRevenue = activeBookings.reduce((sum, b) => sum + b.grandTotal, 0);
  const confirmedCount = bookings.filter(b => b.status === 'Confirmed').length;
  const checkedInCount = bookings.filter(b => b.status === 'Checked In').length;
  const checkedOutCount = bookings.filter(b => b.status === 'Checked Out').length;
  const occupancyRate = rooms.length > 0 ? Math.round(((confirmedCount + checkedInCount) / rooms.length) * 100) : 0;

  const filteredBookings = bookings.filter(b => {
    if (bookingFilterStatus !== 'All' && b.status !== bookingFilterStatus) return false;
    if (bookingSearch) {
      const q = bookingSearch.toLowerCase();
      return (
        b.id.toLowerCase().includes(q) ||
        b.guestName.toLowerCase().includes(q) ||
        b.guestPhone.toLowerCase().includes(q) ||
        b.propertyTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredRooms = rooms.filter(r => {
    if (!roomSearch) return true;
    const q = roomSearch.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.roomNumber.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q)
    );
  });

  // Review screening calculations
  const pendingReviewsCount = reviews.filter(r => (r.status || 'Approved') === 'Pending').length;
  const approvedReviewsCount = reviews.filter(r => (r.status || 'Approved') === 'Approved').length;
  const rejectedReviewsCount = reviews.filter(r => r.status === 'Rejected').length;

  const filteredReviews = reviews.filter(r => {
    const currentStatus = r.status || 'Approved';
    if (reviewFilterStatus !== 'All' && currentStatus !== reviewFilterStatus) return false;
    if (reviewSearch) {
      const q = reviewSearch.toLowerCase();
      return (
        r.guestName.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q) ||
        r.roomTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // If not logged in, render Admin & Staff Sign-In Gate
  if (!sessionUser) {
    return (
      <div className="max-w-md mx-auto my-12 animate-fade-in">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-900 to-rose-950 text-white flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-6 h-6 text-amber-400" />
            </div>
            <h2 className="text-xl font-black text-slate-900 font-serif-heading">
              Admin & Staff Portal
            </h2>
            <p className="text-xs text-slate-500">
              Sign in with your administrator or staff credentials
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="admin or staff username"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter account password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-none pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-slate-900 to-rose-950 hover:from-slate-800 hover:to-rose-900 text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-amber-400" />
              <span>Sign In to Admin Panel</span>
            </button>
          </form>

        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 border border-slate-800">
        <div className="z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-black uppercase px-3 py-0.5 rounded-full tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Transient Management Portal
            </span>
            <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-0.5 rounded-full text-[11px] text-slate-200 font-semibold">
              <UserCheck className="w-3 h-3 text-emerald-400" />
              <span>{sessionUser.name} ({sessionUser.role})</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight font-serif-heading">
            Diversion Vigan Admin Central
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Live occupancy dashboard, walk-in registration, room rates, calendar date locks, staff credentials, and guest vouchers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 z-10 w-full sm:w-auto">
          <button
            onClick={() => setIsWalkInOpen(true)}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Walk-In Guest</span>
          </button>

          <button
            onClick={() => { setEditingRoom(null); setIsAddRoomOpen(true); }}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Room</span>
          </button>

          <button
            onClick={handleLogout}
            title="Log Out of Portal"
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider">Total Revenue</span>
            <Vault className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{formatCurrency(totalRevenue)}</p>
          <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> From confirmed stays
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider">Total Reservations</span>
            <Receipt className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{bookings.length}</p>
          <span className="text-[10px] font-bold text-slate-500 mt-1 block">
            {checkedInCount} Checked In • {confirmedCount} Confirmed
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider">Room Units</span>
            <DoorOpen className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{rooms.length}</p>
          <span className="text-[10px] font-bold text-slate-500 mt-1 block">
            Rooms 0 to 12 & 14 to 16
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider">Occupancy Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{occupancyRate}%</p>
          <span className="text-[10px] font-bold text-slate-500 mt-1 block">
            Based on active occupancy
          </span>
        </div>

      </div>

      {/* Admin Tab Controls */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        {[
          { id: 'overview', label: 'Overview', icon: TrendingUp },
          { id: 'rooms', label: `Rooms (${rooms.length})`, icon: DoorOpen },
          { id: 'bookings', label: `Bookings (${bookings.length})`, icon: Receipt },
          {
            id: 'reviews',
            label: `Reviews (${reviews.length})`,
            icon: Star,
            badge: pendingReviewsCount > 0 ? `${pendingReviewsCount} Pending` : undefined
          },
          { id: 'staff', label: `Staff & Access (${staffAccounts.length + 1})`, icon: Users },
          { id: 'inquiries', label: `Inquiries (${inquiries.length})`, icon: MessageSquare }
        ].map(tab => {
          const Icon = tab.icon;
          const isSelected = adminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer relative ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-rose-400" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="px-1.5 py-0.2 bg-amber-400 text-slate-900 text-[10px] rounded-full font-black animate-pulse">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => {
              if (confirm("Reset demo data to initial factory defaults?")) {
                onResetDemoData();
              }
            }}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Demo</span>
          </button>

          <button
            onClick={handleLogout}
            title="Log Out of Portal"
            className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {adminTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-500" /> Recent Guest Check-ins & Bookings
              </h3>
              <button
                onClick={() => setAdminTab('bookings')}
                className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
              >
                View all ({bookings.length})
              </button>
            </div>

            {bookings.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No reservations recorded yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Ref ID</th>
                      <th className="py-2.5 px-3">Guest</th>
                      <th className="py-2.5 px-3">Room</th>
                      <th className="py-2.5 px-3">Dates</th>
                      <th className="py-2.5 px-3">Total</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {bookings.slice(0, 5).map(b => (
                      <tr key={b.id} className="hover:bg-slate-50/80">
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">{b.id}</td>
                        <td className="py-3 px-3">
                          <p className="font-bold text-slate-900">{b.guestName}</p>
                          <p className="text-[10px] text-slate-400">{b.guestPhone}</p>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-700">{b.propertyTitle}</td>
                        <td className="py-3 px-3 text-slate-500">{b.checkIn} → {b.checkOut}</td>
                        <td className="py-3 px-3 font-bold text-slate-900">{formatCurrency(b.grandTotal)}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            b.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                            b.status === 'Checked In' ? 'bg-blue-100 text-blue-800' :
                            b.status === 'Checked Out' ? 'bg-slate-100 text-slate-700' :
                            'bg-rose-100 text-rose-700'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right space-x-1">
                          <button
                            onClick={() => onViewVoucher(b)}
                            className="p-1 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
                            title="Print Voucher"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ROOMS DIRECTORY */}
      {adminTab === 'rooms' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search rooms by name or number..."
                value={roomSearch}
                onChange={(e) => setRoomSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <button
              onClick={() => { setEditingRoom(null); setIsAddRoomOpen(true); }}
              className="w-full sm:w-auto px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Room Unit
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRooms.map((room) => (
              <div key={room.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
                <div>
                  <div className="relative h-40">
                    <img src={room.image} alt={room.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg text-[10px] font-black">
                      Room #{room.roomNumber}
                    </span>
                    <span className="absolute top-3 right-3 bg-rose-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-black">
                      {formatCurrency(room.price)}/nt
                    </span>
                  </div>
                  <div className="p-4 space-y-1.5">
                    <span className="text-[10px] font-bold text-rose-600 uppercase">{room.category}</span>
                    <h4 className="font-extrabold text-slate-900 text-sm">{room.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">{room.description}</p>
                    <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-500">
                      <span>Max {room.maxGuests} Guests</span>
                      <span>•</span>
                      <span>{room.beds} Beds</span>
                      <span>•</span>
                      <span>{room.baths} Baths</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between mt-2">
                  <div className="text-[11px] font-bold text-slate-600">
                    {room.bookedDates?.length || 0} locked dates
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => { setEditingRoom(room); setIsAddRoomOpen(true); }}
                      className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl cursor-pointer"
                      title="Edit Room"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete room "${room.title}"?`)) {
                          onDeleteRoom(room.id);
                        }
                      }}
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl cursor-pointer"
                      title="Delete Room"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: BOOKINGS */}
      {adminTab === 'bookings' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, ref ID, phone..."
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {['All', 'Confirmed', 'Checked In', 'Checked Out', 'Cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setBookingFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    bookingFilterStatus === st
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {filteredBookings.length === 0 ? (
            <p className="text-xs text-slate-400 py-10 text-center">No bookings found matching filter.</p>
          ) : (
            <div className="space-y-3">
              {filteredBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <img src={b.propertyImage} alt={b.propertyTitle} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-xs text-rose-600">{b.id}</span>
                        <span className="text-xs font-bold text-slate-900">• {b.guestName}</span>
                      </div>
                      <p className="text-xs text-slate-700 font-semibold">{b.propertyTitle} (Room #{b.roomNumber})</p>
                      <p className="text-[11px] text-slate-500">
                        {b.checkIn} to {b.checkOut} ({b.nights} {b.nights === 1 ? 'nt' : 'nts'}) • {b.guests} guests • Phone: {b.guestPhone}
                      </p>
                      {b.specialRequests && (
                        <p className="text-[10px] text-slate-400 italic">Req: "{b.specialRequests}"</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-right">
                      <p className="text-xs font-black text-slate-900">{formatCurrency(b.grandTotal)}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{b.paymentMethod} ({b.paymentStatus})</p>
                    </div>

                    <button
                      onClick={() => onViewVoucher(b)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" /> Voucher
                    </button>

                    <div className="flex items-center gap-1.5">
                      <select
                        value={b.status}
                        onChange={(e) => onUpdateBookingStatus(b.id, e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-rose-500"
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Checked In">Checked In</option>
                        <option value="Checked Out">Checked Out</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(`Cancel reservation ${b.id}?`)) {
                          onCancelBooking(b.id);
                        }
                      }}
                      className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-bold text-xs cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* TAB: REVIEWS SCREENING */}
      {adminTab === 'reviews' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header & Stats */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                  Review Screening & Moderation
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Screen, approve, set pending, or delete guest feedback before or after publication.
                </p>
              </div>

              {/* Stat badges */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                <div className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl border border-slate-200 flex items-center gap-1.5">
                  <span>Total:</span>
                  <span className="font-extrabold text-slate-900">{reviews.length}</span>
                </div>
                <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${pendingReviewsCount > 0 ? 'bg-amber-50 text-amber-900 border-amber-300 ring-2 ring-amber-400/30' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                  <span>Pending:</span>
                  <span className="font-extrabold">{pendingReviewsCount}</span>
                </div>
                <div className="px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                  <span>Approved:</span>
                  <span className="font-extrabold">{approvedReviewsCount}</span>
                </div>
                <div className="px-3 py-1.5 bg-rose-50 text-rose-800 rounded-xl border border-rose-200 flex items-center gap-1.5">
                  <span>Rejected:</span>
                  <span className="font-extrabold">{rejectedReviewsCount}</span>
                </div>
              </div>
            </div>

            {/* Filter toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setReviewFilterStatus(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      reviewFilterStatus === st
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                    {st === 'Pending' && pendingReviewsCount > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.2 bg-amber-400 text-slate-900 text-[10px] rounded-full font-black">
                        {pendingReviewsCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search guest, comment..."
                  value={reviewSearch}
                  onChange={(e) => setReviewSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Reviews List */}
          {filteredReviews.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Star className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-700">No reviews found matching criteria</p>
              <p className="text-xs text-slate-400">Try selecting a different filter or clearing your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredReviews.map((rev) => {
                const currentStatus = rev.status || 'Approved';
                return (
                  <div
                    key={rev.id}
                    className={`bg-white rounded-3xl p-5 border shadow-xs flex flex-col justify-between transition-all ${
                      currentStatus === 'Pending'
                        ? 'border-amber-300 ring-2 ring-amber-200/50 bg-amber-50/20'
                        : currentStatus === 'Rejected'
                        ? 'border-rose-200 bg-rose-50/20 opacity-85'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Reviewer Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-extrabold text-slate-900 text-sm">{rev.guestName}</span>
                            {rev.verified && (
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full inline-flex items-center gap-0.5">
                                <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] font-semibold text-rose-600 mt-0.5">{rev.roomTitle}</p>
                          <p className="text-[10px] text-slate-400">
                            Stay: {rev.stayDate} • Submitted: {rev.date}
                          </p>
                        </div>

                        {/* Status Badge */}
                        <div className="shrink-0">
                          {currentStatus === 'Approved' && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 flex items-center gap-1 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" /> Approved
                            </span>
                          )}
                          {currentStatus === 'Pending' && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 flex items-center gap-1 border border-amber-300 animate-pulse">
                              <Clock className="w-3 h-3" /> Pending Screening
                            </span>
                          )}
                          {currentStatus === 'Rejected' && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 flex items-center gap-1 border border-rose-200">
                              <XCircle className="w-3 h-3" /> Rejected
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Rating Stars */}
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < rev.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                        <span className="text-xs font-bold text-slate-700 ml-1.5">{rev.rating}.0 / 5.0</span>
                      </div>

                      {/* Comment */}
                      <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100">
                        <p className="text-xs text-slate-700 font-medium leading-relaxed italic">
                          "{rev.comment}"
                        </p>
                      </div>
                    </div>

                    {/* Action screening buttons */}
                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Approve Button */}
                        {currentStatus !== 'Approved' && (
                          <button
                            type="button"
                            onClick={() => onUpdateReviewStatus?.(rev.id, 'Approved')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                            title="Approve and publish review"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                        )}

                        {/* Set Pending Button */}
                        {currentStatus !== 'Pending' && (
                          <button
                            type="button"
                            onClick={() => onUpdateReviewStatus?.(rev.id, 'Pending')}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                            title="Set to Pending for further review"
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>Pending</span>
                          </button>
                        )}
                      </div>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Permanently delete review by "${rev.guestName}"?`)) {
                            onDeleteReview?.(rev.id);
                          }
                        }}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 hover:border-rose-300 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ml-auto cursor-pointer"
                        title="Delete review permanently"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: STAFF & ACCESS MANAGEMENT */}
      {adminTab === 'staff' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Create New Staff Account Form */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <UserPlus className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Create Staff Credentials</h3>
                <p className="text-xs text-slate-500">Provide staff members with individual username and password logins</p>
              </div>
            </div>

            {staffSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{staffSuccessMsg}</span>
              </div>
            )}

            {staffErrorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{staffErrorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateStaff} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Staff Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maria Santos"
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Username <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. maria_vigan"
                  value={newStaffUsername}
                  onChange={(e) => setNewStaffUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewStaffPassword ? 'text' : 'password'}
                    required
                    placeholder="Set password"
                    value={newStaffPassword}
                    onChange={(e) => setNewStaffPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-none pr-8"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewStaffPassword(!showNewStaffPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showNewStaffPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Role / Position
                </label>
                <select
                  value={newStaffRole}
                  onChange={(e) => setNewStaffRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-none"
                >
                  <option value="Front Desk / Receptionist">Front Desk / Receptionist</option>
                  <option value="Housekeeping Supervisor">Housekeeping Supervisor</option>
                  <option value="Night Shift Admin">Night Shift Admin</option>
                  <option value="Property Staff">Property Staff</option>
                </select>
              </div>

              <div className="sm:col-span-2 lg:col-span-4 pt-1">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-rose-200 transition-all cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Staff Account</span>
                </button>
              </div>
            </form>
          </div>

          {/* Active Accounts Table */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">Authorized System Accounts</h3>
              <span className="text-xs text-slate-400 font-semibold">{staffAccounts.length + 1} accounts active</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Account Holder</th>
                    <th className="py-2.5 px-3">Username</th>
                    <th className="py-2.5 px-3">Password</th>
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  
                  {/* Master Admin Row */}
                  <tr className="bg-rose-50/40">
                    <td className="py-3 px-3">
                      <p className="font-extrabold text-slate-900">Master Administrator</p>
                      <p className="text-[10px] text-slate-400">System Owner</p>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-rose-700">admin</td>
                    <td className="py-3 px-3 font-mono text-slate-600">
                      {revealedPasswords['master'] ? 'apelin@123' : '••••••••••'}
                      <button
                        type="button"
                        onClick={() => setRevealedPasswords(prev => ({ ...prev, master: !prev.master }))}
                        className="ml-2 text-slate-400 hover:text-slate-700 inline-block align-middle cursor-pointer"
                      >
                        {revealedPasswords['master'] ? <EyeOff className="w-3.5 h-3.5 inline" /> : <Eye className="w-3.5 h-3.5 inline" />}
                      </button>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800">
                        Super Administrator
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Permanent Master
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-slate-400 font-semibold text-[11px]">
                      Default Protected
                    </td>
                  </tr>

                  {/* Staff Accounts Rows */}
                  {staffAccounts.map((staff) => (
                    <tr key={staff.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3">
                        <p className="font-bold text-slate-900">{staff.name}</p>
                        <p className="text-[10px] text-slate-400">Created: {staff.createdAt}</p>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-800">{staff.username}</td>
                      <td className="py-3 px-3 font-mono text-slate-600">
                        {revealedPasswords[staff.id] ? staff.password : '••••••••••'}
                        <button
                          type="button"
                          onClick={() => setRevealedPasswords(prev => ({ ...prev, [staff.id]: !prev[staff.id] }))}
                          className="ml-2 text-slate-400 hover:text-slate-700 inline-block align-middle cursor-pointer"
                        >
                          {revealedPasswords[staff.id] ? <EyeOff className="w-3.5 h-3.5 inline" /> : <Eye className="w-3.5 h-3.5 inline" />}
                        </button>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {staff.role}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] font-bold text-emerald-600">Active</span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleDeleteStaff(staff.id, staff.username)}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                        >
                          Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 5: INQUIRIES */}
      {adminTab === 'inquiries' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-black text-slate-900">Guest Messages & Inquiries</h3>
          
          {inquiries.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center">No inquiries received yet.</p>
          ) : (
            <div className="space-y-3">
              {inquiries.map(inq => (
                <div key={inq.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{inq.name}</span>
                    <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-md font-bold">
                      {inq.roomPreference || 'General Inquiry'}
                    </span>
                  </div>
                  <p className="text-slate-500">Email: {inq.email} • Phone: {inq.phone}</p>
                  <p className="text-slate-800 font-medium pt-1 italic">"{inq.message}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {isAddRoomOpen && (
        <AddEditRoomModal
          roomToEdit={editingRoom}
          onClose={() => { setIsAddRoomOpen(false); setEditingRoom(null); }}
          onSaveRoom={(room) => {
            onSaveRoom(room);
            setIsAddRoomOpen(false);
            setEditingRoom(null);
          }}
        />
      )}

      {isWalkInOpen && (
        <WalkInBookingModal
          rooms={rooms}
          onClose={() => setIsWalkInOpen(false)}
          onCreateWalkIn={(booking) => {
            onCreateWalkIn(booking);
            setIsWalkInOpen(false);
          }}
        />
      )}

    </div>
  );
};
