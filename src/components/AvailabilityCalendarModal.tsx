import React, { useState } from 'react';
import { Room } from '../types';
import { formatCurrency } from '../services/api';
import {
  Calendar,
  X,
  CheckCircle2,
  AlertCircle,
  Users,
  Bed,
  ChevronRight,
  Filter
} from 'lucide-react';

interface AvailabilityCalendarModalProps {
  rooms: Room[];
  onClose: () => void;
  onSelectRoomDate: (room: Room, dateStr: string) => void;
}

export const AvailabilityCalendarModal: React.FC<AvailabilityCalendarModalProps> = ({
  rooms,
  onClose,
  onSelectRoomDate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // September 2026 dates (1 to 30)
  const daysInSeptember = 30;
  const daysList = Array.from({ length: daysInSeptember }, (_, i) => i + 1);

  const filteredRooms = rooms.filter(r => {
    if (selectedCategory === 'All') return true;
    return r.category === selectedCategory;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-5xl w-full p-6 shadow-2xl border border-slate-100 relative max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
              Live Room Calendar
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-1 font-serif-heading">
              September 2026 Availability Grid
            </h2>
            <p className="text-xs text-slate-500">
              Click any green open date slot to instantly start booking that room.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700"
            >
              <option value="All">All Categories</option>
              <option value="Family Suites">Family Suites</option>
              <option value="Studio Rooms">Studio Rooms</option>
              <option value="Lofts">Lofts</option>
            </select>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-semibold mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <span className="text-slate-500">Legend:</span>
          <span className="flex items-center gap-1.5 text-emerald-700">
            <span className="w-3 h-3 rounded-md bg-emerald-500 inline-block"></span> Available (Click to reserve)
          </span>
          <span className="flex items-center gap-1.5 text-rose-600">
            <span className="w-3 h-3 rounded-md bg-rose-200 inline-block"></span> Reserved / Blocked
          </span>
        </div>

        {/* Calendar Matrix Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-xs">
            <thead className="bg-slate-900 text-white font-bold text-[11px]">
              <tr>
                <th className="p-3 text-left sticky left-0 bg-slate-900 z-10 w-48 min-w-[190px]">Room Unit</th>
                <th className="p-3 text-center w-20">Rate</th>
                {daysList.map(d => (
                  <th key={d} className="p-2 text-center min-w-[32px] border-l border-slate-800">
                    <span className="block text-[9px] text-slate-400">Sep</span>
                    <span>{d}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {filteredRooms.map(room => (
                <tr key={room.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 sticky left-0 bg-white shadow-xs z-10 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <img src={room.image} className="w-8 h-8 rounded-lg object-cover" />
                      <div className="truncate">
                        <span className="block truncate text-xs">{room.title}</span>
                        <span className="text-[10px] text-slate-400 font-normal">Max {room.maxGuests} guests</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-2 text-center font-bold text-rose-600 whitespace-nowrap">
                    {formatCurrency(room.price)}
                  </td>

                  {daysList.map(dayNum => {
                    const dateStr = `2026-09-${dayNum < 10 ? '0' + dayNum : dayNum}`;
                    const isBooked = room.bookedDates && room.bookedDates.includes(dateStr);

                    return (
                      <td key={dateStr} className="p-1 text-center border-l border-slate-100">
                        {isBooked ? (
                          <div
                            title={`Room booked on ${dateStr}`}
                            className="w-7 h-7 mx-auto rounded-lg bg-rose-100 text-rose-600 font-bold flex items-center justify-center text-[10px] cursor-not-allowed opacity-60"
                          >
                            ✕
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onSelectRoomDate(room, dateStr)}
                            title={`Click to book ${room.title} on ${dateStr}`}
                            className="w-7 h-7 mx-auto rounded-lg bg-emerald-50 hover:bg-emerald-500 hover:text-white text-emerald-700 font-black flex items-center justify-center text-[10px] transition-all hover:scale-110 shadow-xs"
                          >
                            ✓
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};
