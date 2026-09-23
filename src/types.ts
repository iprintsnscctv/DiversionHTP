export interface SpecialDateRate {
  id: string;
  date: string;
  label: string;
  rate: number;
}

export interface DayRates {
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
}

export interface Room {
  id: string;
  roomNumber: string;
  title: string;
  category: string;
  location: string;
  address: string;
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  images: string[];
  bedrooms: number;
  beds: number;
  baths: number;
  maxGuests: number;
  isSuperhost: boolean;
  featured?: boolean;
  description: string;
  amenities: string[];
  host: {
    name: string;
    avatar: string;
    responseRate: string;
    phone: string;
  };
  bookedDates: string[];
  dayRates?: DayRates;
  specialDateRates?: SpecialDateRate[];
  extraPaxRate?: number;
  childUnder5Rate?: number;
  child6AndAboveRate?: number;
}

export interface Booking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyImage: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  basePrice: number;
  cleaningFee: number;
  serviceFee: number;
  grandTotal: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
  paymentMethod: 'gcash' | 'maya' | 'card' | 'paylater' | 'cash_onsite';
  paymentStatus: 'Paid' | 'Pending' | 'Onsite';
  bookingDate: string;
  status: 'Confirmed' | 'Checked In' | 'Checked Out' | 'Cancelled';
}

export interface Review {
  id: string;
  roomId: string;
  roomTitle: string;
  guestName: string;
  rating: number;
  comment: string;
  date: string;
  stayDate: string;
  verified: boolean;
  status?: 'Approved' | 'Pending' | 'Rejected';
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  roomPreference?: string;
  createdAt: string;
  status: 'New' | 'Replied';
}

export interface AdminStats {
  totalRooms: number;
  totalBookings: number;
  totalRevenue: number;
  occupancyRate: number;
  confirmedCount: number;
  checkedInCount: number;
  checkedOutCount: number;
  cancelledCount: number;
  categoryStats: Record<string, number>;
  inquiriesCount: number;
  reviewsCount: number;
}
