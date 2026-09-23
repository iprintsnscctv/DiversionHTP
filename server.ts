import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

export interface Room {
  id: string;
  roomNumber: string;
  title: string;
  category: 'Studio Rooms' | 'Family Suites' | 'Lofts';
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
  featured: boolean;
  description: string;
  amenities: string[];
  host: {
    name: string;
    avatar: string;
    responseRate: string;
    phone: string;
  };
  bookedDates: string[];
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

const INITIAL_ROOMS: Room[] = [
  {
    id: "room-0",
    roomNumber: "0",
    title: "Room 0 - Big Family Room",
    category: "Family Suites",
    location: "Diversion Road, Vigan City",
    address: "Diversion Road, Brgy. Tamag / Rugsuanan, Vigan City, Ilocos Sur",
    price: 2000,
    rating: 4.88,
    reviewsCount: 32,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80"
    ],
    bedrooms: 2,
    beds: 4,
    baths: 1,
    maxGuests: 8,
    isSuperhost: true,
    featured: false,
    description: "Spacious Big Family Room accommodating up to 8 pax with comfortable beds, cold split air conditioning, en-suite hot shower, and direct step-out parking access.",
    amenities: ["Wi-Fi", "Aircon", "Hot Shower", "Free Parking", "Work Desk", "Complimentary Water"],
    host: {
      name: "Diversion Vigan Host",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      responseRate: "100%",
      phone: "+63 917 890 1234"
    },
    bookedDates: ["2026-09-24", "2026-09-25"]
  },
  {
    id: "room-1",
    roomNumber: "1",
    title: "Room 1 - Big Family Room",
    category: "Family Suites",
    location: "Diversion Road, Vigan City",
    address: "Diversion Road, Vigan City, Ilocos Sur",
    price: 2000,
    rating: 4.92,
    reviewsCount: 54,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80"
    ],
    bedrooms: 2,
    beds: 4,
    baths: 1,
    maxGuests: 8,
    isSuperhost: true,
    featured: true,
    description: "Big Family Room suite featuring generous queen beds, dining corner, mini refrigerator, electric kettle, and Smart TV. Ideal for up to 8 guests.",
    amenities: ["Wi-Fi", "Aircon", "Hot Shower", "Free Parking", "Smart TV", "Kitchenette", "Mini Fridge"],
    host: {
      name: "Diversion Vigan Host",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      responseRate: "100%",
      phone: "+63 917 890 1234"
    },
    bookedDates: ["2026-09-26", "2026-09-27"]
  },
  {
    id: "room-2",
    roomNumber: "2",
    title: "Room 2 - Loft Type Family",
    category: "Lofts",
    location: "Diversion Road, Vigan City",
    address: "Diversion Road, Vigan City, Ilocos Sur",
    price: 2000,
    rating: 4.89,
    reviewsCount: 41,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80"
    ],
    bedrooms: 2,
    beds: 5,
    baths: 2,
    maxGuests: 10,
    isSuperhost: true,
    featured: true,
    description: "Expansive Loft Type Family room designed for big groups up to 10 pax, featuring split-level mezzanine sleeping quarters and dual showers.",
    amenities: ["Wi-Fi", "Aircon", "Hot Shower", "Free Parking", "Electric Kettle", "Wardrobe", "Smart TV"],
    host: {
      name: "Diversion Vigan Host",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      responseRate: "100%",
      phone: "+63 917 890 1234"
    },
    bookedDates: ["2026-09-23"]
  },
  {
    id: "room-3",
    roomNumber: "3",
    title: "Room 3 - Loft Type Family",
    category: "Lofts",
    location: "Diversion Road, Vigan City",
    address: "Diversion Road, Vigan City, Ilocos Sur",
    price: 2000,
    rating: 4.96,
    reviewsCount: 89,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80"
    ],
    bedrooms: 2,
    beds: 5,
    baths: 2,
    maxGuests: 10,
    isSuperhost: true,
    featured: true,
    description: "Loft Type Family suite up to 10 pax with premium mezzanine architecture, cozy lounging area, fast Wi-Fi, and dual bathrooms.",
    amenities: ["Wi-Fi", "Aircon", "Hot Shower", "Free Parking", "Smart TV", "Dining Table", "Balcony"],
    host: {
      name: "Diversion Vigan Host",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      responseRate: "100%",
      phone: "+63 917 890 1234"
    },
    bookedDates: ["2026-09-28", "2026-09-29"]
  },
  {
    id: "room-4",
    roomNumber: "4",
    title: "Room 4 - Family Room",
    category: "Family Suites",
    location: "Diversion Road, Vigan City",
    address: "Diversion Road, Vigan City, Ilocos Sur",
    price: 900,
    rating: 4.85,
    reviewsCount: 38,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80"
    ],
    bedrooms: 1,
    beds: 2,
    baths: 1,
    maxGuests: 3,
    isSuperhost: false,
    featured: false,
    description: "Cozy and convenient Family Room accommodating up to 3 pax. Fully air-conditioned with private hot rain-shower.",
    amenities: ["Wi-Fi", "Aircon", "Hot Shower", "Free Parking", "Dining Area", "Smart TV"],
    host: {
      name: "Diversion Vigan Host",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      responseRate: "100%",
      phone: "+63 917 890 1234"
    },
    bookedDates: ["2026-09-25", "2026-09-26"]
  },
  {
    id: "room-5",
    roomNumber: "5",
    title: "Room 5 - Family Room",
    category: "Family Suites",
    location: "Diversion Road, Vigan City",
    address: "Diversion Road, Vigan City, Ilocos Sur",
    price: 900,
    rating: 4.82,
    reviewsCount: 28,
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80"
    ],
    bedrooms: 1,
    beds: 2,
    baths: 1,
    maxGuests: 3,
    isSuperhost: false,
    featured: false,
    description: "Clean, budget-friendly Family Room for up to 3 pax with air conditioning, hot shower, and fast fiber Wi-Fi.",
    amenities: ["Wi-Fi", "Aircon", "Hot Shower", "Parking", "Work Desk"],
    host: {
      name: "Diversion Vigan Host",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      responseRate: "100%",
      phone: "+63 917 890 1234"
    },
    bookedDates: ["2026-09-30"]
  },
  {
    id: "room-6",
    roomNumber: "6",
    title: "Room 6 - Family Room",
    category: "Family Suites",
    location: "Diversion Road, Vigan City",
    address: "Diversion Road, Vigan City, Ilocos Sur",
    price: 900,
    rating: 4.87,
    reviewsCount: 45,
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80"
    ],
    bedrooms: 1,
    beds: 2,
    baths: 1,
    maxGuests: 3,
    isSuperhost: false,
    featured: false,
    description: "Peaceful Family Room for 1-3 pax equipped with split-type aircon, private bath with instant hot shower, and dedicated parking.",
    amenities: ["Wi-Fi", "Aircon", "Hot Shower", "Free Parking", "Smart TV"],
    host: {
      name: "Diversion Vigan Host",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      responseRate: "100%",
      phone: "+63 917 890 1234"
    },
    bookedDates: ["2026-10-01", "2026-10-02"]
  },
  {
    id: "room-7",
    roomNumber: "7",
    title: "Room 7 - Small Loft Type Family",
    category: "Lofts",
    location: "Diversion Road, Vigan City",
    address: "Diversion Road, Vigan City, Ilocos Sur",
    price: 2000,
    rating: 4.93,
    reviewsCount: 62,
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80"
    ],
    bedrooms: 2,
    beds: 4,
    baths: 1,
    maxGuests: 8,
    isSuperhost: true,
    featured: true,
    description: "Small Loft Type Family room accommodating up to 8 pax. Includes wooden loft stairs, elevated mezzanine bedding, aircon, and hot shower.",
    amenities: ["Wi-Fi", "Aircon", "Hot Shower", "Free Parking", "Smart TV", "Coffee Maker"],
    host: {
      name: "Diversion Vigan Host",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      responseRate: "100%",
      phone: "+63 917 890 1234"
    },
    bookedDates: ["2026-09-24"]
  },
  {
    id: "room-8",
    roomNumber: "8",
    title: "Room 8 - Standard Room",
    category: "Studio Rooms",
    location: "Diversion Road, Vigan City",
    address: "Diversion Road, Vigan City, Ilocos Sur",
    price: 900,
    rating: 4.84,
    reviewsCount: 39,
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80"
    ],
    bedrooms: 1,
    beds: 2,
    baths: 1,
    maxGuests: 3,
    isSuperhost: false,
    featured: false,
    description: "Standard Room up to 3 pax, equipped with clean comfortable beds, split aircon, and hot shower.",
    amenities: ["Wi-Fi", "Aircon", "Hot Shower", "TV", "Free Parking"],
    host: {
      name: "Diversion Vigan Host",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      responseRate: "100%",
      phone: "+63 917 890 1234"
    },
    bookedDates: ["2026-09-27"]
  },
  {
    id: "room-9",
    roomNumber: "9",
    title: "Room 9 - Standard Room",
    category: "Studio Rooms",
    location: "Diversion Road, Vigan City",
    address: "Diversion Road, Vigan City, Ilocos Sur",
    price: 900,
    rating: 4.86,
    reviewsCount: 42,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80"
    ],
    bedrooms: 1,
    beds: 2,
    baths: 1,
    maxGuests: 3,
    isSuperhost: false,
    featured: false,
    description: "Standard Room up to 3 pax offering quiet ambiance, quality bedding, and modern bathroom amenities.",
    amenities: ["Wi-Fi", "Aircon", "Hot Shower", "Smart TV", "Free Parking"],
    host: {
      name: "Diversion Vigan Host",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      responseRate: "100%",
      phone: "+63 917 890 1234"
    },
    bookedDates: ["2026-09-29", "2026-09-30"]
  },
  {
    id: "room-10",
    roomNumber: "10",
    title: "Room 10 - Standard Room",
    category: "Studio Rooms",
    location: "Diversion Road, Vigan City",
    address: "Diversion Road, Vigan City, Ilocos Sur",
    price: 900,
    rating: 4.85,
    reviewsCount: 31,
    image: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1200&q=80"
    ],
    bedrooms: 1,
    beds: 2,
    baths: 1,
    maxGuests: 3,
    isSuperhost: false,
    featured: false,
    description: "Air-conditioned Standard Room for up to 3 guests with hot water shower, workspace, and free Wi-Fi.",
    amenities: ["Wi-Fi", "Aircon", "Hot Shower", "Smart TV", "Parking"],
    host: {
      name: "Diversion Vigan Host",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      responseRate: "100%",
      phone: "+63 917 890 1234"
    },
    bookedDates: ["2026-09-23", "2026-09-24"]
  },
  {
    id: "room-11",
    roomNumber: "11",
    title: "Room 11 - Standard Room",
    category: "Studio Rooms",
    location: "Diversion Road, Vigan City",
    address: "Diversion Road, Vigan City, Ilocos Sur",
    price: 900,
    rating: 4.88,
    reviewsCount: 35,
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80"
    ],
    bedrooms: 1,
    beds: 2,
    baths: 1,
    maxGuests: 3,
    isSuperhost: false,
    featured: false,
    description: "Standard Room unit accommodating up to 3 guests, featuring inverter air conditioning and hot rain shower.",
    amenities: ["Wi-Fi", "Aircon", "Hot Shower", "Parking", "Smart TV"],
    host: {
      name: "Diversion Vigan Host",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      responseRate: "100%",
      phone: "+63 917 890 1234"
    },
    bookedDates: ["2026-09-28"]
  },
  {
    id: "room-12",
    roomNumber: "12",
    title: "Room 12 - Big Family Room",
    category: "Family Suites",
    location: "Diversion Road, Vigan City",
    address: "Diversion Road, Vigan City, Ilocos Sur",
    price: 2000,
    rating: 4.91,
    reviewsCount: 63,
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80"
    ],
    bedrooms: 2,
    beds: 4,
    baths: 1,
    maxGuests: 8,
    isSuperhost: false,
    featured: false,
    description: "Ground-floor Big Family Room suite with courtyard access and parking steps away. Accommodates up to 8 pax comfortably.",
    amenities: ["Wi-Fi", "Aircon", "Hot Shower", "Free Parking", "TV", "Mini Fridge"],
    host: {
      name: "Diversion Vigan Host",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      responseRate: "100%",
      phone: "+63 917 890 1234"
    },
    bookedDates: ["2026-09-25"]
  },
  {
    id: "room-14",
    roomNumber: "14",
    title: "Room 14 - Family Room",
    category: "Family Suites",
    location: "Diversion Road, Vigan City",
    address: "Diversion Road, Vigan City, Ilocos Sur",
    price: 1000,
    rating: 4.90,
    reviewsCount: 38,
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80"
    ],
    bedrooms: 1,
    beds: 3,
    baths: 1,
    maxGuests: 5,
    isSuperhost: false,
    featured: false,
    description: "Family Room up to 5 pax with custom day and pax rates. Mon-Thu: 1-2 pax ₱1,000, 3 pax ₱1,200, 4 pax ₱1,400, 5 pax ₱1,500. Fri-Sun: 1-2 pax ₱1,200, 3 pax ₱1,300, 4 pax ₱1,600, 5 pax ₱1,800.",
    amenities: ["Wi-Fi", "Aircon", "Hot Shower", "Smart TV", "Wide Parking Space"],
    host: {
      name: "Diversion Vigan Host",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      responseRate: "100%",
      phone: "+63 917 890 1234"
    },
    bookedDates: ["2026-09-24"]
  },
  {
    id: "room-15",
    roomNumber: "15",
    title: "Room 15 - Family Room",
    category: "Family Suites",
    location: "Diversion Road, Vigan City",
    address: "Diversion Road, Vigan City, Ilocos Sur",
    price: 1000,
    rating: 4.88,
    reviewsCount: 29,
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80"
    ],
    bedrooms: 1,
    beds: 3,
    baths: 1,
    maxGuests: 5,
    isSuperhost: false,
    featured: false,
    description: "Family Room up to 5 pax with custom day and pax rates. Mon-Thu: 1-2 pax ₱1,000, 3 pax ₱1,200, 4 pax ₱1,400, 5 pax ₱1,500. Fri-Sun: 1-2 pax ₱1,200, 3 pax ₱1,300, 4 pax ₱1,600, 5 pax ₱1,800.",
    amenities: ["Wi-Fi", "Aircon", "Hot Shower", "Smart TV", "Wide Parking Space"],
    host: {
      name: "Diversion Vigan Host",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      responseRate: "100%",
      phone: "+63 917 890 1234"
    },
    bookedDates: ["2026-09-27"]
  },
  {
    id: "room-16",
    roomNumber: "16",
    title: "Room 16 - Family Room",
    category: "Family Suites",
    location: "Diversion Road, Vigan City",
    address: "Diversion Road, Vigan City, Ilocos Sur",
    price: 1000,
    rating: 4.93,
    reviewsCount: 45,
    image: "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1200&q=80"
    ],
    bedrooms: 1,
    beds: 3,
    baths: 1,
    maxGuests: 5,
    isSuperhost: true,
    featured: true,
    description: "Family Room up to 5 pax with custom day and pax rates. Mon-Thu: 1-2 pax ₱1,000, 3 pax ₱1,200, 4 pax ₱1,400, 5 pax ₱1,500. Fri-Sun: 1-2 pax ₱1,200, 3 pax ₱1,300, 4 pax ₱1,600, 5 pax ₱1,800.",
    amenities: ["Wi-Fi", "Aircon", "Hot Shower", "Smart TV", "Wide Parking Space"],
    host: {
      name: "Diversion Vigan Host",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      responseRate: "100%",
      phone: "+63 917 890 1234"
    },
    bookedDates: ["2026-09-29"]
  },
  {
    id: "room-villa",
    roomNumber: "Villa",
    title: "Diversion Vigan - Entire Private Villa",
    category: "Family Suites",
    location: "Diversion Road, Vigan City",
    address: "Diversion Road, Vigan City, Ilocos Sur",
    price: 7000,
    rating: 5.0,
    reviewsCount: 112,
    image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80"
    ],
    bedrooms: 5,
    beds: 10,
    baths: 4,
    maxGuests: 20,
    isSuperhost: true,
    featured: true,
    description: "Exclusive Private Villa with full compound amenities, high-speed Wi-Fi, gated parking for multiple vans, full kitchen, and capacity up to 20 pax. Mon-Thu base rate ₱7,000 (+₱400/extra pax), Fri-Sun base rate ₱8,000 (+₱500/extra pax).",
    amenities: ["Wi-Fi", "Aircon", "Full Kitchen", "Private Balcony", "Hot Shower", "Multiple Bathrooms", "Smart TV", "Gated Parking", "Grill Area"],
    host: {
      name: "Diversion Vigan Host",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      responseRate: "100%",
      phone: "+63 917 890 1234"
    },
    bookedDates: ["2026-09-29"]
  }
];

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "DVG-VG782-4192",
    propertyId: "room-1",
    roomNumber: "1",
    propertyTitle: "Room 1 - Standard Family Suite",
    propertyLocation: "Diversion Road, Vigan City",
    propertyImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
    checkIn: "2026-09-26",
    checkOut: "2026-09-28",
    nights: 2,
    guests: 5,
    basePrice: 5600,
    cleaningFee: 0,
    serviceFee: 0,
    grandTotal: 5600,
    guestName: "Juan Miguel Ramos",
    guestEmail: "juan.ramos@gmail.com",
    guestPhone: "+63 917 555 1234",
    paymentMethod: "gcash",
    paymentStatus: "Paid",
    bookingDate: "Sep 22, 2026",
    status: "Confirmed"
  },
  {
    id: "DVG-CL991-8842",
    propertyId: "room-6",
    roomNumber: "6",
    propertyTitle: "Room 6 - Executive Glass Loft",
    propertyLocation: "Diversion Road, Vigan City",
    propertyImage: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80",
    checkIn: "2026-10-01",
    checkOut: "2026-10-03",
    nights: 2,
    guests: 10,
    basePrice: 8400,
    cleaningFee: 0,
    serviceFee: 0,
    grandTotal: 8400,
    guestName: "Ma. Cristina Santos",
    guestEmail: "cristina.santos@yahoo.com",
    guestPhone: "+63 928 444 8877",
    paymentMethod: "card",
    paymentStatus: "Paid",
    bookingDate: "Sep 21, 2026",
    status: "Confirmed"
  },
  {
    id: "DVG-WK104-5521",
    propertyId: "room-0",
    roomNumber: "0",
    propertyTitle: "Room 0 - Ground Floor Studio",
    propertyLocation: "Diversion Road, Vigan City",
    propertyImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    checkIn: "2026-09-24",
    checkOut: "2026-09-25",
    nights: 1,
    guests: 2,
    basePrice: 1500,
    cleaningFee: 0,
    serviceFee: 0,
    grandTotal: 1500,
    guestName: "Arnel Bautista (Walk-in)",
    guestEmail: "walkin@diversionvigan.ph",
    guestPhone: "+63 908 123 9988",
    paymentMethod: "cash_onsite",
    paymentStatus: "Paid",
    bookingDate: "Sep 23, 2026",
    status: "Checked In"
  }
];

const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    roomId: "room-3",
    roomTitle: "Room 3 - Heritage Balcony Suite",
    guestName: "Patricia De Leon",
    rating: 5,
    comment: "Super clean rooms, very cold aircon, and the private balcony is so relaxing in the evening. Secure gated parking was a huge plus for our van!",
    date: "Sep 18, 2026",
    stayDate: "Sep 2026",
    verified: true,
    status: "Approved"
  },
  {
    id: "rev-2",
    roomId: "room-16",
    roomTitle: "Room 16 - Royal Penthouse Suite",
    guestName: "Engr. Mark Mendoza",
    rating: 5,
    comment: "Best transient house in Vigan! We stayed as a 12-person family and there was plenty of bed space and 3 full bathrooms so no morning rush.",
    date: "Sep 15, 2026",
    stayDate: "Sep 2026",
    verified: true,
    status: "Approved"
  },
  {
    id: "rev-3",
    roomId: "room-1",
    roomTitle: "Room 1 - Standard Family Suite",
    guestName: "Rowena Flores",
    rating: 5,
    comment: "Very accessible along Diversion Road. Only 5-7 minutes drive to Calle Crisologo and Baluarte. Host was very hospitable and accommodating.",
    date: "Sep 10, 2026",
    stayDate: "Sep 2026",
    verified: true,
    status: "Approved"
  }
];

// In-memory runtime data store (persisted across requests)
let roomsDB: Room[] = [...INITIAL_ROOMS];
let bookingsDB: Booking[] = [...INITIAL_BOOKINGS];
let reviewsDB: Review[] = [...INITIAL_REVIEWS];
let inquiriesDB: Inquiry[] = [
  {
    id: "inq-1",
    name: "Atty. Renato Gomez",
    email: "renato.gomez@gmail.com",
    phone: "+63 917 111 2233",
    message: "Inquiring if we can book the entire 2nd floor (Rooms 9, 10, and 11) for November 1-3 long weekend?",
    roomPreference: "Multiple Rooms",
    createdAt: "2026-09-22T08:30:00.000Z",
    status: "New"
  }
];

// --- REST API ROUTES ---

// 1. Get all rooms with optional filtering
app.get('/api/rooms', (req: Request, res: Response) => {
  const { category, minPrice, maxPrice, guests, search, availableDate } = req.query;

  let results = [...roomsDB];

  if (category && category !== 'All') {
    results = results.filter(r => r.category === category);
  }

  if (guests) {
    const minGuests = Number(guests);
    results = results.filter(r => r.maxGuests >= minGuests);
  }

  if (minPrice) {
    results = results.filter(r => r.price >= Number(minPrice));
  }

  if (maxPrice) {
    results = results.filter(r => r.price <= Number(maxPrice));
  }

  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.roomNumber.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.amenities.some(a => a.toLowerCase().includes(q))
    );
  }

  if (availableDate) {
    const dateStr = String(availableDate);
    results = results.filter(r => !r.bookedDates.includes(dateStr));
  }

  res.json({
    success: true,
    count: results.length,
    data: results
  });
});

// 2. Get single room
app.get('/api/rooms/:id', (req: Request, res: Response) => {
  const room = roomsDB.find(r => r.id === req.params.id);
  if (!room) {
    return res.status(404).json({ success: false, error: "Room not found" });
  }
  const roomReviews = reviewsDB.filter(rev => rev.roomId === room.id);
  res.json({ success: true, data: { ...room, reviews: roomReviews } });
});

// 3. Create room (Admin)
app.post('/api/rooms', (req: Request, res: Response) => {
  const newRoom: Room = {
    ...req.body,
    id: req.body.id || `room-${Date.now()}`,
    bookedDates: req.body.bookedDates || [],
    rating: req.body.rating || 5.0,
    reviewsCount: req.body.reviewsCount || 0
  };
  roomsDB.unshift(newRoom);
  res.status(201).json({ success: true, data: newRoom });
});

// 4. Update room (Admin)
app.put('/api/rooms/:id', (req: Request, res: Response) => {
  const index = roomsDB.findIndex(r => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: "Room not found" });
  }
  roomsDB[index] = { ...roomsDB[index], ...req.body };
  res.json({ success: true, data: roomsDB[index] });
});

// 5. Delete room (Admin)
app.delete('/api/rooms/:id', (req: Request, res: Response) => {
  const index = roomsDB.findIndex(r => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: "Room not found" });
  }
  const deleted = roomsDB.splice(index, 1);
  res.json({ success: true, data: deleted[0] });
});

// 6. Toggle blocked date on room calendar
app.post('/api/rooms/:id/toggle-date', (req: Request, res: Response) => {
  const { date } = req.body;
  const room = roomsDB.find(r => r.id === req.params.id);
  if (!room) {
    return res.status(404).json({ success: false, error: "Room not found" });
  }

  if (room.bookedDates.includes(date)) {
    room.bookedDates = room.bookedDates.filter(d => d !== date);
  } else {
    room.bookedDates.push(date);
  }

  res.json({ success: true, bookedDates: room.bookedDates });
});

// 7. Get bookings
app.get('/api/bookings', (req: Request, res: Response) => {
  const { status, guestEmail, query } = req.query;
  let results = [...bookingsDB];

  if (status && status !== 'All') {
    results = results.filter(b => b.status === status);
  }

  if (guestEmail) {
    results = results.filter(b => b.guestEmail.toLowerCase() === String(guestEmail).toLowerCase());
  }

  if (query) {
    const q = String(query).toLowerCase();
    results = results.filter(b =>
      b.id.toLowerCase().includes(q) ||
      b.guestName.toLowerCase().includes(q) ||
      b.guestPhone.toLowerCase().includes(q) ||
      b.propertyTitle.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, count: results.length, data: results });
});

// 8. Get booking by ID / Ref code
app.get('/api/bookings/:id', (req: Request, res: Response) => {
  const booking = bookingsDB.find(b => b.id.toUpperCase() === req.params.id.toUpperCase());
  if (!booking) {
    return res.status(404).json({ success: false, error: "Booking reference not found" });
  }
  res.json({ success: true, data: booking });
});

// 9. Create booking
app.post('/api/bookings', (req: Request, res: Response) => {
  const {
    propertyId,
    checkIn,
    checkOut,
    guests,
    guestName,
    guestEmail,
    guestPhone,
    paymentMethod,
    specialRequests
  } = req.body;

  const room = roomsDB.find(r => r.id === propertyId);
  if (!room) {
    return res.status(404).json({ success: false, error: "Room not found" });
  }

  // Calculate nights
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const basePrice = req.body.basePrice || (room.price * nights);
  const cleaningFee = 0;
  const grandTotal = req.body.grandTotal || basePrice;

  // Generate Reference Code: DVG-XXXXX-1234
  const refCode = req.body.id || ('DVG-' + Math.random().toString(36).substring(2, 7).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000));

  const newBooking: Booking = {
    id: refCode,
    propertyId: room.id,
    roomNumber: room.roomNumber,
    propertyTitle: room.title,
    propertyLocation: room.location,
    propertyImage: room.image,
    checkIn,
    checkOut,
    nights,
    guests: Number(guests) || 1,
    basePrice,
    cleaningFee: 0,
    serviceFee: 0,
    grandTotal,
    guestName,
    guestEmail,
    guestPhone,
    specialRequests: specialRequests || '',
    paymentMethod: paymentMethod || 'gcash',
    paymentStatus: paymentMethod === 'cash_onsite' || paymentMethod === 'paylater' ? 'Onsite' : 'Paid',
    bookingDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    status: 'Confirmed'
  };

  // Add dates to room bookedDates
  const currentDate = new Date(start);
  while (currentDate < end) {
    const dStr = currentDate.toISOString().split('T')[0];
    if (!room.bookedDates.includes(dStr)) {
      room.bookedDates.push(dStr);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  bookingsDB.unshift(newBooking);
  res.status(201).json({ success: true, data: newBooking });
});

// 10. Update booking (Rebooking / date adjustment / customer modification)
app.put('/api/bookings/:id', (req: Request, res: Response) => {
  const index = bookingsDB.findIndex(b => b.id.toUpperCase() === req.params.id.toUpperCase());
  if (index === -1) {
    return res.status(404).json({ success: false, error: "Booking not found" });
  }

  const oldBooking = bookingsDB[index];
  const updatedBooking: Booking = {
    ...oldBooking,
    ...req.body,
    id: oldBooking.id
  };

  // Update room locked dates
  const room = roomsDB.find(r => r.id === updatedBooking.propertyId);
  if (room && req.body.checkIn && req.body.checkOut) {
    // Remove old dates
    const oldStart = new Date(oldBooking.checkIn + 'T00:00:00');
    const oldEnd = new Date(oldBooking.checkOut + 'T00:00:00');
    const curOld = new Date(oldStart);
    const oldDatesToRemove: string[] = [];
    while (curOld < oldEnd) {
      oldDatesToRemove.push(curOld.toISOString().split('T')[0]);
      curOld.setDate(curOld.getDate() + 1);
    }
    room.bookedDates = room.bookedDates.filter(d => !oldDatesToRemove.includes(d));

    // Add new dates
    const newStart = new Date(updatedBooking.checkIn + 'T00:00:00');
    const newEnd = new Date(updatedBooking.checkOut + 'T00:00:00');
    const curNew = new Date(newStart);
    while (curNew < newEnd) {
      const dStr = curNew.toISOString().split('T')[0];
      if (!room.bookedDates.includes(dStr)) {
        room.bookedDates.push(dStr);
      }
      curNew.setDate(curNew.getDate() + 1);
    }
  }

  bookingsDB[index] = updatedBooking;
  res.json({ success: true, data: updatedBooking });
});

// 11. Update booking status
app.patch('/api/bookings/:id/status', (req: Request, res: Response) => {
  const { status, paymentStatus } = req.body;
  const booking = bookingsDB.find(b => b.id === req.params.id);
  if (!booking) {
    return res.status(404).json({ success: false, error: "Booking not found" });
  }

  if (status) booking.status = status;
  if (paymentStatus) booking.paymentStatus = paymentStatus;

  res.json({ success: true, data: booking });
});

// 11. Delete/Cancel booking
app.delete('/api/bookings/:id', (req: Request, res: Response) => {
  const index = bookingsDB.findIndex(b => b.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: "Booking not found" });
  }
  const cancelled = bookingsDB.splice(index, 1)[0];
  res.json({ success: true, data: cancelled });
});

// 12. Reviews
app.get('/api/reviews', (req: Request, res: Response) => {
  const { status } = req.query;
  let results = [...reviewsDB];
  if (status && status !== 'All') {
    results = results.filter(r => (r.status || 'Approved') === status);
  }
  res.json({ success: true, data: results });
});

app.post('/api/reviews', (req: Request, res: Response) => {
  const { roomId, guestName, rating, comment } = req.body;
  const room = roomsDB.find(r => r.id === roomId);

  const newReview: Review = {
    id: `rev-${Date.now()}`,
    roomId,
    roomTitle: room ? room.title : "Diversion Vigan Room",
    guestName,
    rating: Number(rating) || 5,
    comment,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    stayDate: "Sep 2026",
    verified: true,
    status: 'Pending'
  };

  reviewsDB.unshift(newReview);

  // Update room rating if approved
  if (room && newReview.status === 'Approved') {
    room.reviewsCount = (room.reviewsCount || 0) + 1;
    const allRoomRevs = reviewsDB.filter(r => r.roomId === roomId && r.status === 'Approved');
    if (allRoomRevs.length > 0) {
      const avg = allRoomRevs.reduce((acc, r) => acc + r.rating, 0) / allRoomRevs.length;
      room.rating = Number(avg.toFixed(2));
    }
  }

  res.status(201).json({ success: true, data: newReview });
});

app.patch('/api/reviews/:id/status', (req: Request, res: Response) => {
  const { status } = req.body;
  const review = reviewsDB.find(r => r.id === req.params.id);
  if (!review) {
    return res.status(404).json({ success: false, error: "Review not found" });
  }

  review.status = status;
  res.json({ success: true, data: review });
});

app.delete('/api/reviews/:id', (req: Request, res: Response) => {
  const index = reviewsDB.findIndex(r => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: "Review not found" });
  }
  const deleted = reviewsDB.splice(index, 1)[0];
  res.json({ success: true, data: deleted });
});

// 13. Inquiries
app.get('/api/inquiries', (req: Request, res: Response) => {
  res.json({ success: true, data: inquiriesDB });
});

app.post('/api/inquiries', (req: Request, res: Response) => {
  const newInquiry: Inquiry = {
    id: `inq-${Date.now()}`,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    message: req.body.message,
    roomPreference: req.body.roomPreference || 'General Inquiry',
    createdAt: new Date().toISOString(),
    status: 'New'
  };
  inquiriesDB.unshift(newInquiry);
  res.status(201).json({ success: true, data: newInquiry });
});

// 14. Admin Statistics
app.get('/api/stats', (req: Request, res: Response) => {
  const activeBookings = bookingsDB.filter(b => b.status !== 'Cancelled');
  const totalRevenue = activeBookings.reduce((sum, b) => sum + b.grandTotal, 0);
  const confirmedCount = bookingsDB.filter(b => b.status === 'Confirmed').length;
  const checkedInCount = bookingsDB.filter(b => b.status === 'Checked In').length;
  const checkedOutCount = bookingsDB.filter(b => b.status === 'Checked Out').length;
  const cancelledCount = bookingsDB.filter(b => b.status === 'Cancelled').length;

  const occupancyRate = roomsDB.length > 0 ? Math.round(((confirmedCount + checkedInCount) / roomsDB.length) * 100) : 0;

  // Category breakdown
  const categoryStats = {
    'Studio Rooms': roomsDB.filter(r => r.category === 'Studio Rooms').length,
    'Family Suites': roomsDB.filter(r => r.category === 'Family Suites').length,
    'Lofts': roomsDB.filter(r => r.category === 'Lofts').length
  };

  res.json({
    success: true,
    data: {
      totalRooms: roomsDB.length,
      totalBookings: bookingsDB.length,
      totalRevenue,
      occupancyRate,
      confirmedCount,
      checkedInCount,
      checkedOutCount,
      cancelledCount,
      categoryStats,
      inquiriesCount: inquiriesDB.length,
      reviewsCount: reviewsDB.length
    }
  });
});

// 15. Reset Demo Data
app.post('/api/reset', (req: Request, res: Response) => {
  roomsDB = JSON.parse(JSON.stringify(INITIAL_ROOMS));
  bookingsDB = JSON.parse(JSON.stringify(INITIAL_BOOKINGS));
  reviewsDB = JSON.parse(JSON.stringify(INITIAL_REVIEWS));
  res.json({ success: true, message: "Demo database reset to default Diversion Vigan records." });
});

// Start server with Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Diversion Vigan Full-Stack Server running on port ${PORT}`);
  });
}

startServer();
