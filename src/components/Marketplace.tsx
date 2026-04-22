import React, { useState } from 'react';
import { Product } from '../types';
import { ShoppingBag, Star, ExternalLink, Filter, Search, Tag, FlaskConical, Video } from 'lucide-react';

export default function Marketplace() {
  const [activeTab, setActiveTab] = useState<'shop' | 'labs' | 'consult'>('shop');

  const products: Product[] = [
    {
      id: '1',
      name: 'Organic Spearmint Tea',
      price: '₹499',
      category: 'Hormonal Balance',
      image: 'https://picsum.photos/seed/tea/300/300',
      description: 'Clinically studied to help reduce excess androgens and hirsutism.'
    },
    {
      id: '2',
      name: 'Myo-Inositol Powder',
      price: '₹1,299',
      category: 'Supplements',
      image: 'https://picsum.photos/seed/supp/300/300',
      description: '40:1 ratio of Myo-Inositol to D-Chiro Inositol for insulin sensitivity.'
    },
    {
      id: '3',
      name: 'Salicylic Acid Cleanser',
      price: '₹650',
      category: 'Skincare',
      image: 'https://picsum.photos/seed/skin/300/300',
      description: 'Gentle exfoliation for hormonal acne without stripping the skin barrier.'
    }
  ];

  const labs = [
    { name: 'PCOS Profile Basic', tests: 'LH, FSH, Testosterone, Prolactin', price: '₹1,999', partner: 'Thyrocare' },
    { name: 'PCOS Profile Advanced', tests: 'Basic + Insulin, HbA1c, Vitamin D', price: '₹3,499', partner: 'Dr. Lal PathLabs' }
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex bg-white border border-border-main rounded-2xl p-1 shadow-bloom">
        <button 
          onClick={() => setActiveTab('shop')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'shop' ? 'bg-rose text-white shadow-md shadow-rose/20' : 'text-text-secondary hover:bg-rose-light'}`}
        >
          <ShoppingBag className="w-4 h-4" />
          Shop
        </button>
        <button 
          onClick={() => setActiveTab('labs')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'labs' ? 'bg-rose text-white shadow-md shadow-rose/20' : 'text-text-secondary hover:bg-rose-light'}`}
        >
          <FlaskConical className="w-4 h-4" />
          Labs
        </button>
        <button 
          onClick={() => setActiveTab('consult')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'consult' ? 'bg-rose text-white shadow-md shadow-rose/20' : 'text-text-secondary hover:bg-rose-light'}`}
        >
          <Video className="w-4 h-4" />
          Consult
        </button>
      </div>

      {activeTab === 'shop' && (
        <div className="flex flex-col gap-6">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input 
                type="text" 
                placeholder="Search products..." 
                className="w-full pl-10 pr-4 py-2 bg-white border border-border-main rounded-xl text-sm outline-none focus:border-rose"
              />
            </div>
            <button className="p-2 border border-border-main rounded-xl bg-white text-text-secondary">
              <Filter className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {products.map(p => (
              <div key={p.id} className="bg-white border border-border-main rounded-2xl overflow-hidden shadow-bloom flex">
                <img src={p.image} alt={p.name} className="w-32 h-32 object-cover" referrerPolicy="no-referrer" />
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold text-rose uppercase tracking-wider">{p.category}</span>
                    <div className="flex items-center gap-0.5 text-amber text-[10px] font-bold">
                      <Star className="w-3 h-3 fill-current" /> 4.8
                    </div>
                  </div>
                  <h4 className="font-bold text-text-main text-sm mb-1">{p.name}</h4>
                  <p className="text-[11px] text-text-secondary leading-tight mb-3 line-clamp-2">{p.description}</p>
                  <div className="mt-auto flex justify-between items-center">
                    <span className="font-serif text-lg text-rose">{p.price}</span>
                    <button className="bg-plum text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-plum-dark transition-colors">
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'labs' && (
        <div className="flex flex-col gap-4">
          <div className="bg-plum-light border border-plum-mid rounded-xl p-4 text-plum">
            <h4 className="font-bold text-sm mb-1">Partnered Diagnostics</h4>
            <p className="text-xs leading-relaxed">Book a certified PCOS blood profile at home with our trusted lab partners.</p>
          </div>
          {labs.map((lab, i) => (
            <div key={i} className="bg-white border border-border-main rounded-2xl p-6 shadow-bloom">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-serif text-lg text-text-main">{lab.name}</h4>
                  <p className="text-xs text-text-secondary">Partner: {lab.partner}</p>
                </div>
                <span className="font-serif text-xl text-rose">{lab.price}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {lab.tests.split(', ').map(t => (
                  <span key={t} className="bg-plum-light text-plum text-[10px] px-2 py-0.5 rounded-full font-bold">{t}</span>
                ))}
              </div>
              <button className="w-full bg-rose text-white py-3 rounded-xl font-bold hover:bg-[#D4556B] transition-colors shadow-lg shadow-rose/20">
                Book Home Collection
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'consult' && (
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-border-main rounded-2xl p-8 shadow-bloom text-center">
            <div className="w-16 h-16 bg-rose-light rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="w-8 h-8 text-rose" />
            </div>
            <h3 className="font-serif text-xl mb-2">Talk to a Specialist</h3>
            <p className="text-sm text-text-secondary mb-6 leading-relaxed">
              Connect with India's top PCOS-specialist gynaecologists and nutritionists via secure video call.
            </p>
            <div className="flex flex-col gap-3">
              <button className="bg-rose text-white py-3 rounded-xl font-bold hover:bg-[#D4556B] transition-colors flex items-center justify-center gap-2">
                Book Video Consultation
                <ExternalLink className="w-4 h-4" />
              </button>
              <p className="text-[10px] text-text-muted uppercase tracking-wider">Starts at ₹599 / session</p>
            </div>
          </div>

          <div className="bg-sage-light border border-sage-mid rounded-2xl p-6">
            <h4 className="font-serif text-md text-sage mb-3">Why consult here?</h4>
            <ul className="space-y-2">
              <li className="text-xs text-sage flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-sage rounded-full mt-1.5 shrink-0" />
                Verified experts with 10+ years experience in PCOS.
              </li>
              <li className="text-xs text-sage flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-sage rounded-full mt-1.5 shrink-0" />
                Integrated health reports shared with the doctor.
              </li>
              <li className="text-xs text-sage flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-sage rounded-full mt-1.5 shrink-0" />
                Personalized follow-up plans in the app.
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
