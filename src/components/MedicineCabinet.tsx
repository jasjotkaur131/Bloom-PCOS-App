import React, { useState } from 'react';
import { Medication } from '../types';
import { Pill, Plus, Bell, Trash2, AlertCircle, Clock, Thermometer } from 'lucide-react';

export default function MedicineCabinet() {
  const [meds, setMeds] = useState<Medication[]>([
    { id: '1', name: 'Myo-Inositol', dosage: '2000mg', frequency: 'Twice daily', reminderTime: '08:00', type: 'supplement', sideEffects: [] },
    { id: '2', name: 'Metformin', dosage: '500mg', frequency: 'Once daily', reminderTime: '20:00', type: 'medication', sideEffects: ['Nausea'] }
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [newMed, setNewMed] = useState<Partial<Medication>>({ type: 'medication' });

  const addMed = () => {
    if (!newMed.name || !newMed.dosage) return;
    const med: Medication = {
      id: Math.random().toString(36).substr(2, 9),
      name: newMed.name,
      dosage: newMed.dosage,
      frequency: newMed.frequency || 'Once daily',
      reminderTime: newMed.reminderTime || '09:00',
      type: newMed.type as 'medication' | 'supplement',
      sideEffects: []
    };
    setMeds([...meds, med]);
    setShowAdd(false);
    setNewMed({ type: 'medication' });
  };

  const removeMed = (id: string) => {
    setMeds(meds.filter(m => m.id !== id));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-plum-light border border-plum-mid rounded-xl p-3 text-sm text-plum flex items-center gap-2">
        <Pill className="w-4 h-4" />
        <span>Track your medications and supplements. Set reminders and monitor side effects over time.</span>
      </div>

      <div className="flex justify-between items-center px-2">
        <h3 className="font-serif text-lg">My Cabinet</h3>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-rose text-white p-2 rounded-full hover:bg-[#D4556B] transition-colors shadow-lg shadow-rose/20"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {showAdd && (
        <div className="bg-white border border-border-main rounded-2xl p-6 shadow-bloom animate-in fade-in slide-in-from-top-4 duration-300">
          <h4 className="font-serif text-md mb-4">Add New Item</h4>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="col-span-2">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1 block">Name</label>
              <input 
                type="text" 
                value={newMed.name || ''} 
                onChange={e => setNewMed({...newMed, name: e.target.value})}
                placeholder="e.g. Metformin"
                className="w-full border border-border-main rounded-xl px-4 py-2 text-sm outline-none focus:border-rose"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1 block">Dosage</label>
              <input 
                type="text" 
                value={newMed.dosage || ''} 
                onChange={e => setNewMed({...newMed, dosage: e.target.value})}
                placeholder="e.g. 500mg"
                className="w-full border border-border-main rounded-xl px-4 py-2 text-sm outline-none focus:border-rose"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1 block">Frequency</label>
              <select 
                value={newMed.frequency || 'Once daily'} 
                onChange={e => setNewMed({...newMed, frequency: e.target.value})}
                className="w-full border border-border-main rounded-xl px-4 py-2 text-sm outline-none focus:border-rose bg-white"
              >
                <option>Once daily</option>
                <option>Twice daily</option>
                <option>Thrice daily</option>
                <option>As needed</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1 block">Reminder Time</label>
              <input 
                type="time" 
                value={newMed.reminderTime || '09:00'} 
                onChange={e => setNewMed({...newMed, reminderTime: e.target.value})}
                className="w-full border border-border-main rounded-xl px-4 py-2 text-sm outline-none focus:border-rose"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1 block">Type</label>
              <div className="flex gap-2 mt-1">
                <button 
                  onClick={() => setNewMed({...newMed, type: 'medication'})}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${newMed.type === 'medication' ? 'bg-rose text-white' : 'bg-plum-light text-plum'}`}
                >
                  Med
                </button>
                <button 
                  onClick={() => setNewMed({...newMed, type: 'supplement'})}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${newMed.type === 'supplement' ? 'bg-rose text-white' : 'bg-plum-light text-plum'}`}
                >
                  Supp
                </button>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={addMed} className="flex-1 bg-rose text-white py-2.5 rounded-xl font-bold hover:bg-[#D4556B] transition-colors">Add to Cabinet</button>
            <button onClick={() => setShowAdd(false)} className="px-6 border border-border-main rounded-xl text-sm font-medium text-text-secondary hover:bg-plum-light transition-colors">Cancel</button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {meds.map(med => (
          <div key={med.id} className="bg-white border border-border-main rounded-2xl p-5 shadow-bloom group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${med.type === 'medication' ? 'bg-rose-light text-rose' : 'bg-sage-light text-sage'}`}>
                  <Pill className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-text-main">{med.name}</h4>
                  <p className="text-xs text-text-secondary">{med.dosage} · {med.frequency}</p>
                </div>
              </div>
              <button 
                onClick={() => removeMed(med.id)}
                className="text-text-muted hover:text-rose opacity-0 group-hover:opacity-100 transition-all p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-border-main/50">
              <div className="flex items-center gap-2 text-xs font-medium text-plum">
                <Bell className="w-3.5 h-3.5" />
                Next dose at {med.reminderTime}
              </div>
              <div className="flex items-center gap-2">
                {med.sideEffects.length > 0 && (
                  <div className="flex items-center gap-1 text-[10px] bg-amber-light text-amber px-2 py-0.5 rounded-full font-bold">
                    <AlertCircle className="w-3 h-3" />
                    Side effects logged
                  </div>
                )}
                <button className="text-[10px] font-bold text-rose uppercase tracking-wider hover:underline">Log Dose</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-plum-light to-rose-light border border-plum-mid rounded-2xl p-6 shadow-bloom">
        <h3 className="font-serif text-lg mb-4 flex items-center gap-2">
          <Thermometer className="w-5 h-5 text-plum" />
          Side Effect Tracking
        </h3>
        <p className="text-xs text-text-secondary leading-relaxed mb-4">
          Monitoring how your body reacts to medications is crucial for PCOS management. Log any nausea, headaches, or mood changes here to share with your doctor.
        </p>
        <button className="w-full bg-white border border-plum-mid text-plum py-2.5 rounded-xl text-sm font-bold hover:bg-plum hover:text-white transition-all">
          Log Side Effects
        </button>
      </div>
    </div>
  );
}
