import React, { useState, useEffect, useMemo } from 'react';
import { Room, Booking, Review, Inquiry } from './types';
import { api } from './services/api';

import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SearchBar } from './components/SearchBar';
import { RoomCard } from './components/RoomCard';
import { RoomDetailModal } from './components/RoomDetailModal';
import { CheckoutModal } from './components/CheckoutModal';
import { BookingSuccessModal } from './components/BookingSuccessModal';
import { PrintableReceipt } from './components/PrintableReceipt';
import { AvailabilityCalendarModal } from './components/AvailabilityCalendarModal';
import { BookingLookupView } from './components/BookingLookupView';
import { ReviewsView } from './components/ReviewsView';
import { ViganGuideView } from './components/ViganGuideView';
import { ContactView } from './components/ContactView';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';

import {
  Compass,
  Heart,
  CalendarCheck,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Bed,
  MapPin,
  Building,
  Users,
  Layers,
  X
} from 'lucide-react';

export default function App() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('diversion_vigan_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeTab, setActiveTab] = useState<string>('explore');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [bookingDraft, setBookingDraft] = useState<any>(null);
  const [lastConfirmedBooking, setLastConfirmedBooking] = useState<Booking | null>(null);
  const [voucherToView, setVoucherToView] = useState<Booking | null>(null);
  const [isCalendarOverviewOpen, setIsCalendarOverviewOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [searchParams, setSearchParams] = useState({
    location: 'Diversion Road, Vigan City',
    checkIn: '',
    checkOut: '',
    guests: 1,
    search: '',
    maxPrice: 6000
  });

  // Fetch initial data from Express backend
  const loadAllData = async () => {
    try {
      setLoading(true);
      const [fetchedRooms, fetchedBookings, fetchedReviews, fetchedInquiries] = await Promise.all([
        api.getRooms(),
        api.getBookings(),
        api.getReviews(),
        api.getInquiries()
      ]);
      setRooms(fetchedRooms);
      setBookings(fetchedBookings);
      setReviews(fetchedReviews);
      setInquiries(fetchedInquiries);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('diversion_vigan_wishlist', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleWishlist = (id: string) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter(item => item !== id));
      triggerToast('Removed from saved list');
    } else {
      setWishlist([...wishlist, id]);
      triggerToast('Added to saved shortlist!');
    }
  };

  const handleConfirmBooking = async (newBooking: Booking) => {
    try {
      const saved = await api.createBooking(newBooking);
      setBookings([saved, ...bookings]);
      setBookingDraft(null);
      setSelectedRoom(null);
      setLastConfirmedBooking(saved);
      triggerToast(`Reservation Confirmed! Ref: ${saved.id}`);
      // Refresh rooms to update booked dates
      const updatedRooms = await api.getRooms();
      setRooms(updatedRooms);
    } catch (err) {
      triggerToast('Error creating booking');
    }
  };

  const handleCancelBooking = async (id: string) => {
    try {
      await api.cancelBooking(id);
      setBookings(bookings.filter(b => b.id !== id));
      triggerToast('Reservation cancelled');
      const updatedRooms = await api.getRooms();
      setRooms(updatedRooms);
    } catch (err) {
      triggerToast('Error cancelling booking');
    }
  };

  const handleUpdateBookingStatus = async (id: string, status: string) => {
    try {
      const updated = await api.updateBookingStatus(id, status);
      setBookings(bookings.map(b => b.id === id ? updated : b));
      triggerToast(`Booking status updated to ${status}`);
    } catch (err) {
      triggerToast('Error updating status');
    }
  };

  const handleSaveRoom = async (roomData: Partial<Room>) => {
    try {
      if (roomData.id && rooms.some(r => r.id === roomData.id)) {
        const updated = await api.updateRoom(roomData.id, roomData);
        setRooms(rooms.map(r => r.id === updated.id ? updated : r));
        triggerToast('Room updated successfully!');
      } else {
        const created = await api.createRoom(roomData);
        setRooms([created, ...rooms]);
        triggerToast('New room listing created!');
      }
    } catch (err) {
      triggerToast('Error saving room');
    }
  };

  const handleDeleteRoom = async (id: string) => {
    try {
      await api.deleteRoom(id);
      setRooms(rooms.filter(r => r.id !== id));
      triggerToast('Room listing removed');
    } catch (err) {
      triggerToast('Error deleting room');
    }
  };

  const handleToggleRoomDate = async (roomId: string, dateStr: string) => {
    try {
      const updatedDates = await api.toggleRoomDate(roomId, dateStr);
      setRooms(rooms.map(r => r.id === roomId ? { ...r, bookedDates: updatedDates } : r));
      triggerToast(`Date ${dateStr} availability updated`);
    } catch (err) {
      triggerToast('Error updating date');
    }
  };

  const handleUpdateBooking = async (updatedBooking: Booking) => {
    try {
      const saved = await api.updateBooking(updatedBooking.id, updatedBooking);
      setBookings(bookings.map(b => b.id === saved.id ? saved : b));
      triggerToast(`Reservation ${saved.id} rebooked successfully!`);
      const updatedRooms = await api.getRooms();
      setRooms(updatedRooms);
      return saved;
    } catch (err) {
      triggerToast('Error rebooking reservation');
      throw err;
    }
  };

  const handleWalkInBooking = async (newBooking: Booking) => {
    try {
      const saved = await api.createBooking(newBooking);
      setBookings([saved, ...bookings]);
      triggerToast(`Walk-in guest logged! Ref: ${saved.id}`);
      const updatedRooms = await api.getRooms();
      setRooms(updatedRooms);
    } catch (err) {
      triggerToast('Error registering walk-in');
    }
  };

  const handleSubmitReview = async (reviewData: { roomId: string; guestName: string; rating: number; comment: string }) => {
    try {
      const saved = await api.submitReview(reviewData);
      setReviews([saved, ...reviews]);
      triggerToast('Thank you! Your review was submitted for screening.');
      const updatedRooms = await api.getRooms();
      setRooms(updatedRooms);
    } catch (err) {
      triggerToast('Error submitting review');
    }
  };

  const handleUpdateReviewStatus = async (id: string, status: 'Approved' | 'Pending' | 'Rejected') => {
    try {
      const updated = await api.updateReviewStatus(id, status);
      setReviews(reviews.map(r => r.id === id ? updated : r));
      triggerToast(`Review marked as ${status}`);
      const updatedRooms = await api.getRooms();
      setRooms(updatedRooms);
    } catch (err) {
      triggerToast('Error updating review status');
    }
  };

  const handleDeleteReview = async (id: string) => {
    try {
      await api.deleteReview(id);
      setReviews(reviews.filter(r => r.id !== id));
      triggerToast('Review deleted successfully');
      const updatedRooms = await api.getRooms();
      setRooms(updatedRooms);
    } catch (err) {
      triggerToast('Error deleting review');
    }
  };

  const handleSubmitInquiry = async (inquiry: { name: string; email: string; phone: string; message: string; roomPreference?: string }) => {
    try {
      const saved = await api.submitInquiry(inquiry);
      setInquiries([saved, ...inquiries]);
      triggerToast('Inquiry submitted to host!');
    } catch (err) {
      triggerToast('Error sending inquiry');
    }
  };

  const handleResetDemoData = async () => {
    try {
      await api.resetDemoData();
      await loadAllData();
      triggerToast('Database reset to Diversion Vigan defaults');
    } catch (err) {
      triggerToast('Error resetting data');
    }
  };

  // Filtered rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      if (selectedCategory !== 'All' && room.category !== selectedCategory) return false;
      if (searchParams.guests > room.maxGuests) return false;
      if (searchParams.search) {
        const q = searchParams.search.toLowerCase();
        const matches =
          room.title.toLowerCase().includes(q) ||
          room.roomNumber.toLowerCase().includes(q) ||
          room.description.toLowerCase().includes(q) ||
          room.amenities.some(a => a.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [rooms, selectedCategory, searchParams]);

  const wishlistedRooms = useMemo(() => {
    return rooms.filter(r => wishlist.includes(r.id));
  }, [rooms, wishlist]);

  const categories = [
    { name: 'All', icon: Layers, count: rooms.length },
    { name: 'Family Suites', icon: Users, count: rooms.filter(r => r.category === 'Family Suites').length },
    { name: 'Studio Rooms', icon: Bed, count: rooms.filter(r => r.category === 'Studio Rooms').length },
    { name: 'Lofts', icon: Building, count: rooms.filter(r => r.category === 'Lofts').length }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between selection:bg-rose-500 selection:text-white">
      <div>
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          wishlistCount={wishlist.length}
          bookingsCount={bookings.length}
          onOpenCalendarOverview={() => setIsCalendarOverviewOpen(true)}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          
          {/* TAB: EXPLORE / ROOMS */}
          {activeTab === 'explore' && (
            <div>
              <HeroSection
                onQuickCategorySelect={(cat) => setSelectedCategory(cat)}
                onOpenCalendar={() => setIsCalendarOverviewOpen(true)}
                totalRooms={rooms.length}
              />

              <SearchBar
                searchParams={searchParams}
                setSearchParams={setSearchParams}
                onResetFilters={() => {
                  setSearchParams({
                    location: 'Diversion Road, Vigan City',
                    checkIn: '',
                    checkOut: '',
                    guests: 1,
                    search: '',
                    maxPrice: 6000
                  });
                  setSelectedCategory('All');
                }}
              />

              {/* Category Pills Bar */}
              <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-6">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.name;
                  return (
                    <button
                      key={cat.name}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                        isSelected
                          ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 scale-105'
                          : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-xs'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-rose-400' : 'text-slate-400'}`} />
                      <span>{cat.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Rooms Grid */}
              {loading ? (
                <div className="text-center py-20">
                  <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-xs font-bold text-slate-600">Loading Diversion Vigan Accommodations...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredRooms.map((room) => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      isWishlisted={wishlist.includes(room.id)}
                      onToggleWishlist={handleToggleWishlist}
                      onSelectRoom={(r) => setSelectedRoom(r)}
                      onDateClick={(r, dateStr) => {
                        setSearchParams(prev => ({ ...prev, checkIn: dateStr }));
                        setSelectedRoom(r);
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Empty state */}
              {!loading && filteredRooms.length === 0 && (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 my-6 shadow-xs">
                  <Bed className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="font-bold text-slate-800 text-sm">No transient rooms match your filter</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Try decreasing your guest count, clearing search terms, or browsing other room categories.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setSearchParams(prev => ({ ...prev, guests: 1, search: '' }));
                    }}
                    className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                  Shortlisted Stays
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-serif-heading">
                  Saved Transient Rooms
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Keep track of your preferred family suites and studios in Vigan City.
                </p>
              </div>

              {wishlistedRooms.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs">
                  <Heart className="w-12 h-12 text-rose-300 mx-auto mb-3" />
                  <h3 className="font-bold text-slate-800 text-sm">No saved rooms yet</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Click the heart button on any room to bookmark it for later comparison.
                  </p>
                  <button
                    onClick={() => setActiveTab('explore')}
                    className="mt-4 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-200"
                  >
                    Explore Rooms Now
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {wishlistedRooms.map((room) => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      isWishlisted={true}
                      onToggleWishlist={handleToggleWishlist}
                      onSelectRoom={(r) => setSelectedRoom(r)}
                      onDateClick={(r, dateStr) => {
                        setSearchParams(prev => ({ ...prev, checkIn: dateStr }));
                        setSelectedRoom(r);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: MY BOOKINGS */}
          {activeTab === 'bookings' && (
            <BookingLookupView
              bookings={bookings}
              rooms={rooms}
              onCancelBooking={handleCancelBooking}
              onViewVoucher={(booking) => setVoucherToView(booking)}
              onOpenReviewModal={() => setActiveTab('reviews')}
              onUpdateBooking={handleUpdateBooking}
            />
          )}

          {/* TAB: VIGAN TOURIST GUIDE */}
          {activeTab === 'guide' && <ViganGuideView />}

          {/* TAB: REVIEWS */}
          {activeTab === 'reviews' && (
            <ReviewsView
              reviews={reviews}
              rooms={rooms}
              onSubmitReview={handleSubmitReview}
            />
          )}

          {/* TAB: CONTACT */}
          {activeTab === 'contact' && (
            <ContactView onSubmitInquiry={handleSubmitInquiry} />
          )}

          {/* TAB: ADMIN PORTAL */}
          {activeTab === 'admin' && (
            <AdminDashboard
              rooms={rooms}
              bookings={bookings}
              inquiries={inquiries}
              reviews={reviews}
              onSaveRoom={handleSaveRoom}
              onDeleteRoom={handleDeleteRoom}
              onToggleDate={handleToggleRoomDate}
              onUpdateBookingStatus={handleUpdateBookingStatus}
              onCancelBooking={handleCancelBooking}
              onCreateWalkIn={handleWalkInBooking}
              onViewVoucher={(b) => setVoucherToView(b)}
              onResetDemoData={handleResetDemoData}
              onUpdateReviewStatus={handleUpdateReviewStatus}
              onDeleteReview={handleDeleteReview}
            />
          )}

        </main>
      </div>

      <Footer setActiveTab={setActiveTab} />

      {/* MODALS */}

      {/* Room Detail Modal */}
      {selectedRoom && (
        <RoomDetailModal
          room={selectedRoom}
          searchParams={searchParams}
          onClose={() => setSelectedRoom(null)}
          onProceedToCheckout={(draft) => {
            setBookingDraft(draft);
          }}
        />
      )}

      {/* Checkout Modal */}
      {bookingDraft && (
        <CheckoutModal
          bookingDraft={bookingDraft}
          onClose={() => setBookingDraft(null)}
          onConfirmBooking={handleConfirmBooking}
        />
      )}

      {/* Booking Success Modal */}
      {lastConfirmedBooking && (
        <BookingSuccessModal
          booking={lastConfirmedBooking}
          onClose={() => setLastConfirmedBooking(null)}
          onViewVoucher={() => {
            const b = lastConfirmedBooking;
            setLastConfirmedBooking(null);
            setVoucherToView(b);
          }}
          onCopyRef={() => {
            navigator.clipboard.writeText(lastConfirmedBooking.id);
            triggerToast("Reference ID copied to clipboard!");
          }}
        />
      )}

      {/* Printable Receipt / Voucher Modal */}
      {voucherToView && (
        <PrintableReceipt
          booking={voucherToView}
          onClose={() => setVoucherToView(null)}
        />
      )}

      {/* Full Month Master Availability Calendar */}
      {isCalendarOverviewOpen && (
        <AvailabilityCalendarModal
          rooms={rooms}
          onClose={() => setIsCalendarOverviewOpen(false)}
          onSelectRoomDate={(room, dateStr) => {
            setIsCalendarOverviewOpen(false);
            setSearchParams(prev => ({ ...prev, checkIn: dateStr }));
            setSelectedRoom(room);
          }}
        />
      )}

      {/* Toast Popup Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
}
