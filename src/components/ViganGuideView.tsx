import React from 'react';
import {
  MapPin,
  Clock,
  Car,
  Compass,
  Utensils,
  Camera,
  Navigation,
  Sparkles,
  Info
} from 'lucide-react';

export const ViganGuideView: React.FC = () => {
  const attractions = [
    {
      title: "Calle Crisologo (Heritage Village)",
      distance: "1.8 km",
      travelTime: "5 - 7 mins by car/trike",
      image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80",
      description: "World-famous cobblestone street lined with Spanish colonial ancestral houses, kalesa horse carriages, souvenir antique shops, and night light ambiance."
    },
    {
      title: "Bantay Church & Historical Bell Tower",
      distance: "2.2 km",
      travelTime: "6 - 8 mins",
      image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
      description: "Historic belfry perched on a scenic hilltop with panoramic views over Ilocos Sur and the Abra mountain range."
    },
    {
      title: "Baluarte Resort and Mini Zoo",
      distance: "3.1 km",
      travelTime: "8 - 10 mins",
      image: "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=800&q=80",
      description: "Popular family destination with free entrance, wildlife animal sanctuary, safari gallery, and deer park."
    },
    {
      title: "Pagburnayan Traditional Pottery",
      distance: "1.4 km",
      travelTime: "4 - 5 mins",
      image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80",
      description: "Witness authentic century-old burnay earthenware clay jars hand-crafted using foot-powered potter's wheels."
    },
    {
      title: "Hidden Garden of Vigan",
      distance: "2.8 km",
      travelTime: "7 - 9 mins",
      image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80",
      description: "Lush tropical botanical garden restaurant serving authentic Vigan Empanada, Poqui-Poqui, and refreshing sugarcane juice."
    },
    {
      title: "Plaza Salcedo Dancing Fountain Show",
      distance: "1.9 km",
      travelTime: "6 mins",
      image: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80",
      description: "Evening musical fountain laser light show between Vigan Cathedral and the Provincial Capitol at 7:00 PM and 8:30 PM nightly."
    }
  ];

  const foodDelicacies = [
    { name: "Vigan Empanada", desc: "Crispy orange rice-flour crust with Vigan longganisa, egg, and grated green papaya." },
    { name: "Authentic Bagnet", desc: "Deep-fried crispy pork belly served with KBL (Kamatis, Bagoong, Lasona)." },
    { name: "Vigan Longganisa", desc: "Garlicky, savory indigenous small pork sausage cured with Ilocos garlic & cane vinegar." },
    { name: "Sinanglaw & Pinakbet", desc: "Traditional slow-cooked beef broth with bile & fresh local vegetables with bagoong monamon." }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <span className="text-xs font-extrabold uppercase tracking-wider text-rose-300 bg-rose-500/20 px-3 py-1 rounded-full border border-rose-500/30 inline-flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-rose-400" />
            Vigan Tourist & Heritage Guide
          </span>
          <h1 className="text-3xl sm:text-4xl font-black mt-3 font-serif-heading">
            Explore Vigan City from Diversion Road
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Our transient house is strategically situated along Diversion Road with wide vehicle road access, avoiding heavy town-center traffic while keeping you only 5 minutes away from all major tourist spots and authentic Ilocano dining.
          </p>
        </div>
      </div>

      {/* Top Attractions Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 font-serif-heading">
              Nearby Attractions & Travel Times
            </h2>
            <p className="text-xs text-slate-500">Quick transit from Diversion Vigan Transient House</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {attractions.map((spot, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={spot.image}
                    alt={spot.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" /> {spot.travelTime}
                  </span>
                  <span className="absolute top-3 right-3 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                    {spot.distance}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-rose-600 transition-colors">
                    {spot.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {spot.description}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.title + ' Vigan City')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
                >
                  <Navigation className="w-3.5 h-3.5 text-rose-500" />
                  <span>Open Directions</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Culinary Recommendations */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <h2 className="text-lg font-black text-slate-900 font-serif-heading mb-1 flex items-center gap-2">
          <Utensils className="w-5 h-5 text-rose-500" /> Must-Try Ilocano Delicacies
        </h2>
        <p className="text-xs text-slate-500 mb-5">
          Ask our transient host for trusted local stall recommendations and where to buy fresh bagnet & longganisa pasalubong.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {foodDelicacies.map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <h4 className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                {item.name}
              </h4>
              <p className="text-xs text-slate-600 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
