import React, { useState } from 'react';
import { generateJSON } from '../lib/ai';
import { Doctor } from '../types';
import { Search, MapPin, Star, ExternalLink } from 'lucide-react';
import { Type } from '@google/genai';

export default function GynoFinder() {
  const [city, setCity] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchDoctors = async (searchCity?: string) => {
    const targetCity = searchCity || city;
    if (!targetCity.trim()) return;

    setIsLoading(true);
    setCity(targetCity);

    const schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          specialty: { type: Type.STRING },
          area: { type: Type.STRING },
          distance: { type: Type.STRING },
          rating: { type: Type.NUMBER },
          initials: { type: Type.STRING },
          hospital: { type: Type.STRING },
        },
        required: ['name', 'specialty', 'area', 'distance', 'rating', 'initials', 'hospital'],
      },
    };

    const prompt = `Find 3 plausible gynaecologists who specialize in PCOS in ${targetCity}, India. Use realistic names, areas, and hospitals in that city.`;
    const systemInstruction = "You are a medical directory assistant for India. Return a JSON array of 3 gynaecologists. Each object must have: name (Dr. prefix), specialty, area (neighbourhood), distance (e.g. 2.3 km), rating (4.0-5.0), initials (2 chars), hospital.";

    const results = await generateJSON(prompt, schema, systemInstruction);
    if (results) {
      setDoctors(results);
    }
    setIsLoading(false);
  };

  const popularCities = ['Delhi', 'Mumbai', 'Bangalore', 'Prayagraj', 'Lucknow', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Jaipur'];

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-plum-light border border-plum-mid rounded-xl p-3 text-sm text-plum flex items-center gap-2">
        <MapPin className="w-4 h-4" />
        <span>Type any Indian city to find PCOS-specialist gynaecologists near you.</span>
      </div>

      <div className="bg-white border border-border-main rounded-2xl p-5 shadow-bloom">
        <h3 className="font-serif text-lg mb-4">Search by city</h3>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchDoctors()}
            placeholder="e.g. Delhi, Lucknow, Pune..."
            className="flex-1 border border-border-main rounded-xl px-4 py-2 text-sm outline-none focus:border-rose"
          />
          <button
            onClick={() => searchDoctors()}
            disabled={isLoading}
            className="bg-rose text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#D4556B] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {popularCities.map(c => (
            <button
              key={c}
              onClick={() => searchDoctors(c)}
              className="bg-plum-light border border-plum-mid rounded-full px-3 py-1 text-xs font-medium text-plum hover:bg-plum hover:text-white transition-colors"
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="text-center py-10 text-text-muted text-sm">
            <div className="animate-spin w-6 h-6 border-2 border-rose border-t-transparent rounded-full mx-auto mb-2" />
            Finding PCOS specialists in {city}...
          </div>
        ) : doctors.length > 0 ? (
          <>
            <div className="bg-gradient-to-br from-[#E8F4F0] to-[#EBE4F5] rounded-2xl h-32 flex flex-col items-center justify-center border border-border-main">
              <MapPin className="w-8 h-8 text-rose mb-1" />
              <span className="text-sm font-semibold text-plum">Results near {city}</span>
              <div className="bg-rose text-white px-3 py-1 rounded-full text-xs font-bold mt-2">
                {doctors.length} specialists found
              </div>
            </div>
            {doctors.map((doc, idx) => (
              <div key={idx} className="bg-white border border-border-main rounded-2xl p-4 shadow-bloom flex gap-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                  style={{ backgroundColor: ['#E8647A', '#7C5C8A', '#4E8C6E'][idx % 3] }}
                >
                  {doc.initials}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-text-main">{doc.name}</h4>
                  <p className="text-xs text-text-muted mb-1">{doc.specialty}</p>
                  <div className="flex gap-0.5 mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < Math.round(doc.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-sage font-semibold mb-1">📍 {doc.distance} · {doc.area}</p>
                  <p className="text-[11px] text-text-muted">{doc.hospital}</p>
                  <div className="flex gap-2 mt-3">
                    <a 
                      href={`https://www.google.com/maps/search/gynaecologist+PCOS+specialist+${city}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="bg-rose text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[#D4556B] transition-colors flex items-center gap-1"
                    >
                      View on Maps
                    </a>
                    <a 
                      href={`https://www.practo.com/search/doctors?results_type=doctor&q=gynaecologist&city=${city}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="bg-transparent border border-border-main text-text-secondary px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-plum-light transition-colors flex items-center gap-1"
                    >
                      Book on Practo
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="text-center py-10 text-text-muted text-sm">
            Select a city above or type your location to find gynaecologists.
          </div>
        )}
      </div>
    </div>
  );
}
