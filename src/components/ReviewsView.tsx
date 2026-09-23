import React, { useState } from 'react';
import { Review, Room } from '../types';
import {
  Star,
  Sparkles,
  MessageSquare,
  CheckCircle2,
  ShieldCheck,
  ThumbsUp,
  Plus
} from 'lucide-react';

interface ReviewsViewProps {
  reviews: Review[];
  rooms: Room[];
  onSubmitReview: (reviewData: { roomId: string; guestName: string; rating: number; comment: string }) => void;
}

export const ReviewsView: React.FC<ReviewsViewProps> = ({
  reviews,
  rooms,
  onSubmitReview
}) => {
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0]?.id || 'room-1');
  const [guestName, setGuestName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const approvedReviews = reviews.filter(r => (r.status === 'Approved' || !r.status));

  const averageRating = approvedReviews.length > 0
    ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length).toFixed(1)
    : '4.9';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !guestName.trim()) return;

    onSubmitReview({
      roomId: selectedRoomId,
      guestName,
      rating,
      comment
    });

    setComment('');
    setGuestName('');
    setIsWriteModalOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-500/20 px-2.5 py-0.5 rounded-full border border-rose-500/30">
            Verified Guest Impressions
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2 font-serif-heading">
            Guest Reviews & Ratings
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-md">
            Real feedback from tourists, business travelers, and families who stayed at Diversion Vigan Transient House.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0">
          <div className="text-center">
            <span className="text-3xl font-black text-amber-400 block">{averageRating}</span>
            <div className="flex items-center justify-center gap-0.5 text-amber-400 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <span className="text-[10px] text-slate-300 font-bold block mt-1">
              {approvedReviews.length} Verified Reviews
            </span>
          </div>

          <button
            onClick={() => setIsWriteModalOpen(true)}
            className="px-4 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-black transition-all shadow-lg shadow-rose-900/30 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Write a Review</span>
          </button>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {approvedReviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                    {rev.guestName}
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full inline-flex items-center gap-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Verified Stay
                    </span>
                  </h4>
                  <p className="text-[11px] font-semibold text-rose-600 mt-0.5">{rev.roomTitle}</p>
                </div>

                <div className="flex items-center gap-0.5 text-amber-400 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/60">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="text-xs font-black text-slate-800">{rev.rating}.0</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-normal italic">
                "{rev.comment}"
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-3 mt-4">
              <span>Stayed {rev.stayDate || 'Recently'}</span>
              <span>{rev.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Write Review Modal */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
            <h3 className="text-base font-extrabold text-slate-900 mb-1">
              Share Your Transient Experience
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Help future visitors to Vigan City know what to expect.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Room You Stayed In</label>
                <select
                  value={selectedRoomId}
                  onChange={(e) => setSelectedRoomId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-800 focus:ring-2 focus:ring-rose-500"
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maria Santos"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-800 focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Overall Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-2 rounded-xl transition-all ${
                        rating >= star
                          ? 'bg-amber-100 text-amber-500'
                          : 'bg-slate-100 text-slate-300'
                      }`}
                    >
                      <Star className="w-5 h-5 fill-current" />
                    </button>
                  ))}
                  <span className="ml-2 font-bold text-slate-700 text-xs">
                    {rating === 5 ? 'Exceptional (5/5)' : `${rating}/5 Stars`}
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Your Review & Comments</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share details about the cleanliness, aircon coolness, parking, host hospitality, or accessibility..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-800 focus:ring-2 focus:ring-rose-500"
                ></textarea>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWriteModalOpen(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold shadow-md shadow-rose-200"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
