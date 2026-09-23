import React, { useState } from 'react';
import { Room, SpecialDateRate, DayRates } from '../types';
import { formatCurrency } from '../services/api';
import {
  X,
  Bed,
  Sparkles,
  Calendar,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  DollarSign,
  Users,
  Baby,
  UserCheck,
  Check,
  Tag,
  FileText,
  Hash
} from 'lucide-react';

interface AddEditRoomModalProps {
  roomToEdit: Room | null;
  onClose: () => void;
  onSaveRoom: (room: Partial<Room>) => void;
}

const COMMON_AMENITIES = [
  'High-speed Wi-Fi',
  'Inverter Air Conditioning',
  'Hot & Cold Rain Shower',
  'Smart TV with Netflix',
  'Free Secured Gated Parking',
  'Mini Refrigerator',
  'Electric Kettle & Mugs',
  'Fresh Linens & Bath Towels',
  'Bidet & Toiletries',
  'Private Balcony / Terrace',
  'Dining Table & Chairs',
  'Kitchenette with Microwave'
];

export const AddEditRoomModal: React.FC<AddEditRoomModalProps> = ({
  roomToEdit,
  onClose,
  onSaveRoom
}) => {
  // 1. Room #
  const [roomNumber, setRoomNumber] = useState(roomToEdit ? roomToEdit.roomNumber : '0');

  // 2. Room Title
  const [title, setTitle] = useState(roomToEdit ? roomToEdit.title : '');

  // 3. Room Category
  const [category, setCategory] = useState<string>(
    roomToEdit ? roomToEdit.category : 'Big Family Room'
  );

  // 4. Custom Room Rate by Days Monday to Sunday
  const defaultWeekday = roomToEdit?.price || 2000;
  const defaultWeekend = roomToEdit ? Math.round(roomToEdit.price * 1.1) : 2200;

  const [dayRates, setDayRates] = useState<DayRates>(() => {
    if (roomToEdit?.dayRates) {
      return roomToEdit.dayRates;
    }
    return {
      monday: defaultWeekday,
      tuesday: defaultWeekday,
      wednesday: defaultWeekday,
      thursday: defaultWeekday,
      friday: defaultWeekend,
      saturday: defaultWeekend,
      sunday: defaultWeekend
    };
  });

  // 5. Custom Room Rate by Special Date
  const [specialDateRates, setSpecialDateRates] = useState<SpecialDateRate[]>(() => {
    if (roomToEdit?.specialDateRates && roomToEdit.specialDateRates.length > 0) {
      return roomToEdit.specialDateRates;
    }
    return [
      { id: 'sp-1', date: '2026-12-24', label: 'Christmas Eve', rate: defaultWeekend + 500 },
      { id: 'sp-2', date: '2026-12-31', label: 'New Year Eve Peak', rate: defaultWeekend + 800 }
    ];
  });

  const [newSpecialDate, setNewSpecialDate] = useState('');
  const [newSpecialLabel, setNewSpecialLabel] = useState('');
  const [newSpecialRate, setNewSpecialRate] = useState<number>(defaultWeekend + 500);

  // 6. Custom Rate for Additional Pax
  const [extraPaxRate, setExtraPaxRate] = useState<number>(
    roomToEdit?.extraPaxRate !== undefined ? roomToEdit.extraPaxRate : 400
  );

  // 7. Custom Rate for Children below 5 Yrs old & 6 Yrs and above
  const [childUnder5Rate, setChildUnder5Rate] = useState<number>(
    roomToEdit?.childUnder5Rate !== undefined ? roomToEdit.childUnder5Rate : 0
  );
  const [child6AndAboveRate, setChild6AndAboveRate] = useState<number>(
    roomToEdit?.child6AndAboveRate !== undefined ? roomToEdit.child6AndAboveRate : 300
  );

  // 8. Amenities
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(() => {
    return roomToEdit?.amenities && roomToEdit.amenities.length > 0
      ? roomToEdit.amenities
      : [
          'High-speed Wi-Fi',
          'Inverter Air Conditioning',
          'Hot & Cold Rain Shower',
          'Free Secured Gated Parking',
          'Smart TV with Netflix'
        ];
  });
  const [customAmenityInput, setCustomAmenityInput] = useState('');

  // 9. Room Descriptions
  const [description, setDescription] = useState(
    roomToEdit
      ? roomToEdit.description
      : 'Spacious transient accommodation located along Diversion Road, Vigan City. Features cold inverter aircon, hot rain shower, comfortable hotel-grade beds, and 24/7 secured parking.'
  );

  // 10. Cover Photo Upload or by URL
  const [image, setImage] = useState(
    roomToEdit
      ? roomToEdit.image
      : 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'
  );

  // General attributes
  const [maxGuests, setMaxGuests] = useState(roomToEdit ? roomToEdit.maxGuests : 8);
  const [beds, setBeds] = useState(roomToEdit ? roomToEdit.beds : 3);
  const [baths, setBaths] = useState(roomToEdit ? roomToEdit.baths : 1);
  const [isFeatured, setIsFeatured] = useState(roomToEdit ? !!roomToEdit.featured : false);

  // Day rate change handler
  const handleDayRateChange = (day: keyof DayRates, value: number) => {
    setDayRates(prev => ({
      ...prev,
      [day]: Math.max(0, value)
    }));
  };

  // Bulk Apply Weekday/Weekend helper
  const handleApplyBulkDays = (weekdayVal: number, weekendVal: number) => {
    setDayRates({
      monday: weekdayVal,
      tuesday: weekdayVal,
      wednesday: weekdayVal,
      thursday: weekdayVal,
      friday: weekendVal,
      saturday: weekendVal,
      sunday: weekendVal
    });
  };

  // Add Special Date
  const handleAddSpecialDate = () => {
    if (!newSpecialDate) return;
    const newEntry: SpecialDateRate = {
      id: `sp-${Date.now()}`,
      date: newSpecialDate,
      label: newSpecialLabel.trim() || 'Holiday / Peak Date',
      rate: Number(newSpecialRate) || (dayRates.friday + 500)
    };
    setSpecialDateRates(prev => [...prev, newEntry]);
    setNewSpecialDate('');
    setNewSpecialLabel('');
  };

  const handleRemoveSpecialDate = (id: string) => {
    setSpecialDateRates(prev => prev.filter(item => item.id !== id));
  };

  // Toggle Amenity
  const handleToggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(prev => prev.filter(a => a !== amenity));
    } else {
      setSelectedAmenities(prev => [...prev, amenity]);
    }
  };

  const handleAddCustomAmenity = () => {
    if (!customAmenityInput.trim()) return;
    const clean = customAmenityInput.trim();
    if (!selectedAmenities.includes(clean)) {
      setSelectedAmenities(prev => [...prev, clean]);
    }
    setCustomAmenityInput('');
  };

  // Handle Photo File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result;
      if (typeof result === 'string') {
        setImage(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Average price representation
    const baseDisplayPrice = dayRates.monday || 2000;

    onSaveRoom({
      id: roomToEdit ? roomToEdit.id : `room-${roomNumber}`,
      roomNumber,
      title: title || `Room ${roomNumber} - ${category}`,
      category,
      location: 'Diversion Road, Vigan City',
      address: 'Diversion Road, Vigan City, Ilocos Sur',
      price: baseDisplayPrice,
      rating: roomToEdit ? roomToEdit.rating : 5.0,
      reviewsCount: roomToEdit ? roomToEdit.reviewsCount : 1,
      image,
      images: [image],
      bedrooms: 1,
      beds: Number(beds),
      baths: Number(baths),
      maxGuests: Number(maxGuests),
      isSuperhost: true,
      featured: isFeatured,
      description,
      amenities: selectedAmenities,
      dayRates,
      specialDateRates,
      extraPaxRate: Number(extraPaxRate),
      childUnder5Rate: Number(childUnder5Rate),
      child6AndAboveRate: Number(child6AndAboveRate),
      host: {
        name: 'Diversion Vigan Host',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        responseRate: '100%',
        phone: '+63 917 890 1234'
      },
      bookedDates: roomToEdit ? roomToEdit.bookedDates || [] : []
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[92vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
              Admin Portal
            </span>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 mt-1">
              <Bed className="w-5 h-5 text-rose-500" />
              {roomToEdit ? `Edit Room Details & Custom Rates (#${roomToEdit.roomNumber})` : 'Add New Room Unit & Custom Rates'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          
          {/* 1. ROOM # */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/90 space-y-1.5">
            <label className="block font-black text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Hash className="w-4 h-4 text-rose-500" />
              1. Room # <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                required
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="e.g. 0, 1, 2, Villa"
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 font-mono font-bold text-slate-900 focus:ring-2 focus:ring-rose-500 text-sm"
              />
              <div className="sm:col-span-2 flex items-center gap-3">
                <div className="w-1/2">
                  <span className="block text-[10px] font-bold text-slate-400 mb-0.5">Max Pax Capacity</span>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={maxGuests}
                    onChange={(e) => setMaxGuests(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-800"
                  />
                </div>
                <div className="w-1/2">
                  <span className="block text-[10px] font-bold text-slate-400 mb-0.5">Bed Count</span>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={beds}
                    onChange={(e) => setBeds(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-800"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. ROOM TITLE */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/90 space-y-1.5">
            <label className="block font-black text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-rose-500" />
              2. Room Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Room 0 Big Family Room, Room 2 Loft type Family"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 font-bold text-slate-900 focus:ring-2 focus:ring-rose-500 text-sm"
            />
          </div>

          {/* 3. ROOM CATEGORY */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/90 space-y-2">
            <label className="block font-black text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-rose-500" />
              3. Room Category <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-rose-500"
              >
                <option value="Big Family Room">Big Family Room</option>
                <option value="Loft type Family">Loft type Family</option>
                <option value="Family room">Family room</option>
                <option value="Small Loft type Family">Small Loft type Family</option>
                <option value="Standard Room">Standard Room</option>
                <option value="Private Villa">Private Villa</option>
                <option value="Family Suites">Family Suites</option>
                <option value="Studio Rooms">Studio Rooms</option>
                <option value="Lofts">Lofts</option>
              </select>
              <input
                type="text"
                placeholder="Or custom category name..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-800 focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* 4. CUSTOM ROOM RATE BY DAYS MONDAY TO SUNDAY */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/90 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="font-black text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-amber-500" />
                4. Custom Room Rate by Days (Monday to Sunday)
              </label>
              <div className="flex items-center gap-1 text-[10px]">
                <button
                  type="button"
                  onClick={() => handleApplyBulkDays(2000, 2200)}
                  className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-bold cursor-pointer transition-colors"
                >
                  Quick Set ₱2,000 / ₱2,200
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyBulkDays(900, 1000)}
                  className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-bold cursor-pointer transition-colors"
                >
                  Quick Set ₱900 / ₱1,000
                </button>
              </div>
            </div>

            {/* Table style layout for days */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
                    <th className="py-2.5 px-2 text-center text-[10px] font-black uppercase tracking-wider border-r border-slate-200/80">
                      Mon
                    </th>
                    <th className="py-2.5 px-2 text-center text-[10px] font-black uppercase tracking-wider border-r border-slate-200/80">
                      Tue
                    </th>
                    <th className="py-2.5 px-2 text-center text-[10px] font-black uppercase tracking-wider border-r border-slate-200/80">
                      Wed
                    </th>
                    <th className="py-2.5 px-2 text-center text-[10px] font-black uppercase tracking-wider border-r border-slate-200/80">
                      Thu
                    </th>
                    <th className="py-2.5 px-2 text-center text-[10px] font-black uppercase tracking-wider bg-rose-50/80 text-rose-800 border-r border-slate-200/80">
                      <div className="flex items-center justify-center gap-1">
                        <span>Fri</span>
                        <span className="text-[8px] bg-rose-200 text-rose-800 px-1 py-0.2 rounded font-extrabold">Wkd</span>
                      </div>
                    </th>
                    <th className="py-2.5 px-2 text-center text-[10px] font-black uppercase tracking-wider bg-rose-50/80 text-rose-800 border-r border-slate-200/80">
                      <div className="flex items-center justify-center gap-1">
                        <span>Sat</span>
                        <span className="text-[8px] bg-rose-200 text-rose-800 px-1 py-0.2 rounded font-extrabold">Wkd</span>
                      </div>
                    </th>
                    <th className="py-2.5 px-2 text-center text-[10px] font-black uppercase tracking-wider bg-rose-50/80 text-rose-800">
                      <div className="flex items-center justify-center gap-1">
                        <span>Sun</span>
                        <span className="text-[8px] bg-rose-200 text-rose-800 px-1 py-0.2 rounded font-extrabold">Wkd</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="divide-x divide-slate-200">
                    {[
                      { key: 'monday', label: 'Mon', isWeekend: false },
                      { key: 'tuesday', label: 'Tue', isWeekend: false },
                      { key: 'wednesday', label: 'Wed', isWeekend: false },
                      { key: 'thursday', label: 'Thu', isWeekend: false },
                      { key: 'friday', label: 'Fri', isWeekend: true },
                      { key: 'saturday', label: 'Sat', isWeekend: true },
                      { key: 'sunday', label: 'Sun', isWeekend: true }
                    ].map((d) => (
                      <td
                        key={d.key}
                        className={`p-2 align-middle ${
                          d.isWeekend ? 'bg-rose-50/30' : 'bg-white'
                        }`}
                      >
                        <div className="relative flex items-center bg-white rounded-lg border border-slate-200 shadow-inner px-1.5 py-1 focus-within:ring-2 focus-within:ring-rose-500 focus-within:border-rose-500">
                          <span className="text-slate-400 font-bold text-[11px] select-none mr-0.5">₱</span>
                          <input
                            type="number"
                            min="0"
                            step="50"
                            value={dayRates[d.key as keyof DayRates]}
                            onChange={(e) =>
                              handleDayRateChange(d.key as keyof DayRates, Number(e.target.value))
                            }
                            className="w-full bg-transparent font-mono font-black text-slate-900 text-xs sm:text-sm text-right focus:outline-hidden min-w-[54px]"
                            title={`${d.label} rate amount`}
                          />
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              * Rates apply per night for the specified day of stay (Monday through Thursday vs Friday through Sunday).
            </p>
          </div>

          {/* 5. CUSTOM ROOM RATE BY SPECIAL DATE */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/90 space-y-3">
            <label className="block font-black text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-rose-500" />
              5. Custom Room Rate by Special Date (Holidays, Festivals & Peaks)
            </label>

            {/* List of active special dates */}
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {specialDateRates.length === 0 ? (
                <p className="text-[11px] text-slate-400 italic py-1">No special peak dates added yet.</p>
              ) : (
                specialDateRates.map((sp) => (
                  <div key={sp.id} className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-200 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                        {sp.date}
                      </span>
                      <span className="font-bold text-slate-700">{sp.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-rose-600">{formatCurrency(sp.rate)} / nt</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecialDate(sp.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-md cursor-pointer"
                        title="Remove special rate"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add new special date row */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1">
              <div className="sm:col-span-4">
                <input
                  type="date"
                  value={newSpecialDate}
                  onChange={(e) => setNewSpecialDate(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 font-medium text-xs focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <div className="sm:col-span-4">
                <input
                  type="text"
                  placeholder="e.g. Viva Vigan Festival"
                  value={newSpecialLabel}
                  onChange={(e) => setNewSpecialLabel(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 font-medium text-xs focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <div className="sm:col-span-3">
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₱</span>
                  <input
                    type="number"
                    placeholder="Rate"
                    value={newSpecialRate}
                    onChange={(e) => setNewSpecialRate(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-6 pr-2 py-1.5 font-mono font-bold text-xs focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>
              <div className="sm:col-span-1">
                <button
                  type="button"
                  onClick={handleAddSpecialDate}
                  className="w-full h-full min-h-[32px] bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center justify-center font-bold cursor-pointer transition-colors"
                  title="Add Special Date"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 6. CUSTOM RATE FOR ADDITIONAL PAX */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/90 space-y-2">
            <label className="block font-black text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Users className="w-4 h-4 text-rose-500" />
              6. Custom Rate for Additional Pax (Adults / Standard Extra Guest)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₱</span>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={extraPaxRate}
                  onChange={(e) => setExtraPaxRate(Number(e.target.value))}
                  placeholder="e.g. 400"
                  className="w-full bg-white border border-slate-200 rounded-xl pl-7 pr-3 py-2 font-mono font-bold text-slate-900 focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <p className="text-[11px] text-slate-500 flex items-center">
                Applied per extra person per night beyond base capacity (e.g. +₱400 Mon-Thu / +₱500 Fri-Sun for Private Villa).
              </p>
            </div>
          </div>

          {/* 7. CUSTOM RATE FOR ADDITIONAL PAX FOR CHILDREN BELOW 5 YRS OLD TO 6 YRS AND ABOVE */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/90 space-y-3">
            <label className="block font-black text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Baby className="w-4 h-4 text-emerald-600" />
              7. Custom Rate for Additional Pax (Children Breakdown)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Children below 5 yrs */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-[11px]">Children Below 5 Years Old</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    {childUnder5Rate === 0 ? 'FREE' : formatCurrency(childUnder5Rate)}
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₱</span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={childUnder5Rate}
                    onChange={(e) => setChildUnder5Rate(Number(e.target.value))}
                    placeholder="0 for Free"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-7 pr-3 py-1.5 font-mono font-bold text-xs focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <span className="text-[10px] text-slate-400 block">Set to 0 for Free Stay when sharing bed</span>
              </div>

              {/* Children 6 yrs and above */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-[11px]">Children 6 Years Old & Above</span>
                  <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                    {formatCurrency(child6AndAboveRate)}
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₱</span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={child6AndAboveRate}
                    onChange={(e) => setChild6AndAboveRate(Number(e.target.value))}
                    placeholder="e.g. 300"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-7 pr-3 py-1.5 font-mono font-bold text-xs focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <span className="text-[10px] text-slate-400 block">Extra pax rate or discounted child mattress rate</span>
              </div>

            </div>
          </div>

          {/* 8. AMENITIES */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/90 space-y-3">
            <label className="block font-black text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              8. Amenities
            </label>
            
            <div className="flex flex-wrap gap-1.5">
              {COMMON_AMENITIES.map((amenity) => {
                const isChecked = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => handleToggleAmenity(amenity)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {isChecked ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Plus className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{amenity}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom amenity addition */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={customAmenityInput}
                onChange={(e) => setCustomAmenityInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomAmenity(); } }}
                placeholder="Add custom amenity (e.g. Swimming Pool, Rice Cooker)..."
                className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-rose-500"
              />
              <button
                type="button"
                onClick={handleAddCustomAmenity}
                className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold text-xs cursor-pointer"
              >
                + Add
              </button>
            </div>
          </div>

          {/* 9. ROOM DESCRIPTIONS */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/90 space-y-1.5">
            <label className="block font-black text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-rose-500" />
              9. Room Descriptions <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 font-normal text-slate-800 text-xs focus:ring-2 focus:ring-rose-500 leading-relaxed"
              placeholder="Provide a detailed room description: bed sizes, air conditioning details, hot shower water pressure, location perks, and ideal group size..."
            ></textarea>
          </div>

          {/* 10. COVER PHOTO UPLOAD OR BY URL */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/90 space-y-3">
            <label className="block font-black text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-rose-500" />
              10. Cover Photo Upload or by URL <span className="text-rose-500">*</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
              
              {/* Photo Preview */}
              <div className="sm:col-span-5">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-200 border-2 border-slate-300 shadow-inner relative group">
                  {image ? (
                    <img
                      src={image}
                      alt="Room Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                      <ImageIcon className="w-8 h-8 mb-1" />
                      <span className="text-[10px] font-bold">No Image Selected</span>
                    </div>
                  )}
                  <span className="absolute bottom-2 left-2 bg-slate-950/70 text-white text-[9px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                    Live Photo Preview
                  </span>
                </div>
              </div>

              {/* Photo Input Controls */}
              <div className="sm:col-span-7 space-y-3">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Option A: Direct Image URL
                  </span>
                  <input
                    type="url"
                    required
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-mono text-[11px] text-slate-800 focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Option B: Upload Photo from Device
                  </span>
                  <label className="w-full flex items-center justify-center gap-2 p-2.5 bg-white hover:bg-slate-100 border border-dashed border-slate-300 rounded-xl text-slate-700 font-bold cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-rose-500" />
                    <span>Choose Photo File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

            </div>
          </div>

          {/* Featured Highlight Checkbox */}
          <div className="flex items-center gap-2 px-1">
            <input
              type="checkbox"
              id="room-featured-checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500 cursor-pointer"
            />
            <label htmlFor="room-featured-checkbox" className="font-bold text-slate-800 cursor-pointer">
              Highlight as Featured Popular Choice on Homepage
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 py-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-2xl font-black shadow-lg shadow-rose-200 cursor-pointer transition-all active:scale-95"
            >
              {roomToEdit ? 'Save Custom Room Rates & Changes' : 'Create Room Unit'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
