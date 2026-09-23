import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  Car,
  ShieldCheck,
  Send,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ContactViewProps {
  onSubmitInquiry: (inquiry: { name: string; email: string; phone: string; message: string; roomPreference?: string }) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onSubmitInquiry }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [roomPreference, setRoomPreference] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitInquiry({ name, email, phone, message, roomPreference });
    setSubmitted(true);
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  const faqs = [
    {
      q: "What are your standard Check-in and Check-out times?",
      a: "Standard check-in starts at 2:00 PM and check-out is by 12:00 PM (Noon). If you need early morning bag drop or late check-in (after 10:00 PM), simply notify us in advance."
    },
    {
      q: "Is there secure parking for large vehicles, vans, and SUVs?",
      a: "Yes! Diversion Vigan Transient House features an expansive, enclosed, and gated parking courtyard with 24/7 security. We easily accommodate multiple Toyota HiAce/Urvan tour vans, SUVs, and cars."
    },
    {
      q: "Are cooking appliances and kitchenware available?",
      a: "Our Family Suites and Lofts (Rooms 1, 4, 6, 9, 11, 15, and 16) are equipped with kitchenettes, induction cookers, refrigerators, and electric kettles. Common dining areas are also available."
    },
    {
      q: "What payment options are accepted?",
      a: "We accept GCash, Maya, Bank Transfer (BDO/BPI), major Credit/Debit cards, and Cash on arrival."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
          Get in Touch & Visit Us
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-serif-heading">
          Contact & Location Directions
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Reach our on-site team directly for group bookings, tour van reservations, or special inquiries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Direct Contact Info & Map */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Contact details box */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 text-xs">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-500" /> Diversion Vigan Transient House
            </h3>
            
            <p className="text-slate-600 leading-relaxed font-medium">
              Diversion Road, Brgy. Tamag / Rugsuanan, Vigan City, Ilocos Sur 2700, Philippines
            </p>

            <div className="space-y-2.5 border-t border-slate-100 pt-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Phone / Hotline</span>
                  <a href="tel:+639178901234" className="font-bold text-slate-900 hover:text-rose-600">
                    +63 917 890 1234
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Email</span>
                  <a href="mailto:diversionvigan@gmail.com" className="font-bold text-slate-900 hover:text-rose-600">
                    diversionvigan@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Operating Hours</span>
                  <span className="font-bold text-slate-900">24/7 Front Gate & Guest Assistance</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <a
                href="https://wa.me/639178901234"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[11px] text-center shadow-xs transition-colors"
              >
                WhatsApp Host
              </a>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Diversion+Road+Vigan+City"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-[11px] text-center shadow-xs transition-colors"
              >
                Google Maps GPS
              </a>
            </div>
          </div>

          {/* Map Embed Card */}
          <div className="rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 h-56 relative shadow-xs">
            <iframe
              title="Diversion Vigan Map"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src="https://maps.google.com/maps?q=Diversion%20Road,%20Vigan%20City,%20Ilocos%20Sur&t=&z=14&ie=UTF8&iwloc=&output=embed"
            ></iframe>
          </div>

        </div>

        {/* Right Column: Inquiry Form & FAQs */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Inquiry Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs">
            <h3 className="text-base font-black text-slate-900 mb-1 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-rose-500" /> Send an Inquiry or Group Booking Request
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Planning a wedding entourage, company outing, or group tour? Send us a message.
            </p>

            {submitted && (
              <div className="p-3.5 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 mb-4 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Thank you! Your message has been sent to our transient management team.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Atty. Juan Ramos"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+63 917 123 4567"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="juan@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Room Interest</label>
                  <select
                    value={roomPreference}
                    onChange={(e) => setRoomPreference(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Family Suites (Rooms 1, 3, 4, 7, 9, 11, 12, 16)">Family Suites</option>
                    <option value="Lofts (Rooms 6, 10, 15)">Loft Accommodations</option>
                    <option value="Studio Rooms (Rooms 0, 2, 5, 8, 14)">Studio Rooms</option>
                    <option value="Whole Floor / Entire Building">Whole Floor / Group Rental</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Your Message or Target Dates</label>
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Include dates, number of guests, number of vehicles, or special requests..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-rose-500 focus:outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-2xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5 text-rose-400" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          </div>

          {/* FAQs Accordion */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5 mb-3">
              <HelpCircle className="w-4 h-4 text-rose-500" /> Frequently Asked Questions
            </h3>

            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-3.5 text-left text-xs font-bold text-slate-800 flex items-center justify-between hover:text-rose-600 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {openFaq === i ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {openFaq === i && (
                    <div className="px-3.5 pb-3.5 text-xs text-slate-600 font-normal leading-relaxed border-t border-slate-100/80 pt-2 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
