import React, { useState } from 'react';
import { SymptomLog } from '../types';
import { ClipboardList, Plus, Trash2 } from 'lucide-react';

interface SymptomsProps {
  onSave: (log: SymptomLog) => void;
  logs: SymptomLog[];
}

export default function Symptoms({ onSave, logs }: SymptomsProps) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [severities, setSeverities] = useState({
    pain: 3,
    fatigue: 4,
    mood: 6,
    bloating: 2
  });
  const [notes, setNotes] = useState('');

  const symptomOptions = [
    'Irregular periods', 'Cramps', 'Bloating', 'Acne', 'Hair thinning',
    'Excess hair growth', 'Weight gain', 'Fatigue', 'Mood swings',
    'Headache', 'Pelvic pain', 'Insomnia', 'Brain fog', 'Nausea', 'Low libido'
  ];

  const toggleSymptom = (s: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(s) ? prev.filter(item => item !== s) : [...prev, s]
    );
  };

  const handleSave = () => {
    if (selectedSymptoms.length === 0) {
      alert('Select at least one symptom.');
      return;
    }
    const log: SymptomLog = {
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      symptoms: selectedSymptoms,
      ...severities,
      notes
    };
    onSave(log);
    setSelectedSymptoms([]);
    setNotes('');
    setSeverities({ pain: 3, fatigue: 4, mood: 6, bloating: 2 });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-sage-light border border-sage-mid rounded-xl p-3 text-sm text-sage flex items-center gap-2">
        <ClipboardList className="w-4 h-4" />
        <span>Logging daily builds your longitudinal health profile used in risk prediction.</span>
      </div>

      <div className="bg-white border border-border-main rounded-2xl p-6 shadow-bloom">
        <h3 className="font-serif text-lg mb-4">Today's symptoms</h3>
        <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-3">Select all that apply</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {symptomOptions.map(s => (
            <button
              key={s}
              onClick={() => toggleSymptom(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all ${
                selectedSymptoms.includes(s)
                  ? 'bg-rose border-rose text-white'
                  : 'bg-white border-border-main text-text-secondary hover:border-rose-mid'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <h3 className="font-serif text-lg mb-4">Severity (0-10)</h3>
        <div className="space-y-4 mb-6">
          <Slider label="Pain level" value={severities.pain} onChange={v => setSeverities(p => ({...p, pain: v}))} />
          <Slider label="Fatigue" value={severities.fatigue} onChange={v => setSeverities(p => ({...p, fatigue: v}))} />
          <Slider label="Mood" value={severities.mood} onChange={v => setSeverities(p => ({...p, mood: v}))} />
          <Slider label="Bloating" value={severities.bloating} onChange={v => setSeverities(p => ({...p, bloating: v}))} />
        </div>

        <h3 className="font-serif text-lg mb-4">Notes</h3>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Any additional notes about how you're feeling today..."
          className="w-full border border-border-main rounded-xl p-3 text-sm outline-none focus:border-rose min-h-[80px] mb-4"
        />

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 bg-rose text-white py-3 rounded-xl font-semibold hover:bg-[#D4556B] transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Save log
          </button>
          <button
            onClick={() => {
              setSelectedSymptoms([]);
              setNotes('');
              setSeverities({ pain: 3, fatigue: 4, mood: 6, bloating: 2 });
            }}
            className="px-6 border border-border-main rounded-xl text-sm font-medium text-text-secondary hover:bg-plum-light transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="bg-white border border-border-main rounded-2xl p-6 shadow-bloom">
        <h3 className="font-serif text-lg mb-4">Log history</h3>
        <div className="flex flex-col gap-3">
          {logs.length > 0 ? logs.map((log, idx) => (
            <div key={idx} className="border-l-4 border-rose bg-white rounded-r-xl p-3 shadow-sm border border-border-main border-l-rose">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold text-rose uppercase tracking-wider">{log.date} · Pain: {log.pain}/10</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {log.symptoms.map(s => (
                  <span key={s} className="bg-rose-light text-rose text-[10px] px-2 py-0.5 rounded-full font-medium">{s}</span>
                ))}
              </div>
              {log.notes && <p className="text-[11px] text-text-secondary mt-2 italic">"{log.notes}"</p>}
            </div>
          )) : (
            <p className="text-sm text-text-muted text-center py-4">No logs yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Slider({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-xs text-text-secondary min-w-[100px]">{label}</span>
      <input
        type="range"
        min="0"
        max="10"
        value={value}
        onChange={e => onChange(parseInt(e.target.value))}
        className="flex-1 accent-rose"
      />
      <span className="text-xs font-bold text-rose w-4 text-right">{value}</span>
    </div>
  );
}
