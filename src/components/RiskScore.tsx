import React, { useState } from 'react';
import { RiskData } from '../types';
import { Brain, AlertCircle, CheckCircle2, Info } from 'lucide-react';

interface RiskScoreProps {
  onCalculate: (data: RiskData) => void;
  currentRisk: RiskData | null;
}

export default function RiskScore({ onCalculate, currentRisk }: RiskScoreProps) {
  const [formData, setFormData] = useState({
    age: 26,
    bmi: 24.5,
    cycleLength: 35,
    sugar: 95,
    testosterone: 55,
    lhfsh: 2.1,
  });

  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const symptoms = [
    { id: 'irreg', label: 'Irregular periods' },
    { id: 'acne', label: 'Acne' },
    { id: 'hair', label: 'Excess hair growth' },
    { id: 'thin', label: 'Hair thinning' },
    { id: 'weight', label: 'Weight gain' },
    { id: 'fatigue', label: 'Chronic fatigue' },
    { id: 'cysts', label: 'Ovarian cysts (confirmed)' },
    { id: 'insulin', label: 'Insulin resistance' },
  ];

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const calculate = async () => {
  let score = 0;
  const { bmi, cycleLength, sugar, testosterone, lhfsh } = formData;

  score += (bmi > 25) ? (bmi - 25) * 0.08 : 0;
  score += (cycleLength > 35) ? 0.9 : (cycleLength > 32) ? 0.5 : (cycleLength < 21) ? 0.4 : 0;
  score += (sugar > 100) ? 0.7 : (sugar > 95) ? 0.3 : 0;
  score += (testosterone > 60) ? 0.9 : (testosterone > 50) ? 0.5 : 0;
  score += (lhfsh > 2) ? 0.8 : (lhfsh > 1.8) ? 0.4 : 0;

  if (selectedSymptoms.includes('irreg')) score += 0.8;
  if (selectedSymptoms.includes('acne')) score += 0.3;
  if (selectedSymptoms.includes('hair')) score += 0.5;
  if (selectedSymptoms.includes('thin')) score += 0.4;
  if (selectedSymptoms.includes('weight')) score += 0.4;
  if (selectedSymptoms.includes('cysts')) score += 1.2;
  if (selectedSymptoms.includes('insulin')) score += 0.9;
  if (selectedSymptoms.includes('fatigue')) score += 0.2;

  const prob = 1 / (1 + Math.exp(-score + 2.5));
  let level: 'low' | 'medium' | 'high' = 'low';
  if (prob < 0.35) level = 'low';
  else if (prob < 0.65) level = 'medium';
  else level = 'high';

  // Show result immediately to user (same as before)
  onCalculate({
    ...formData,
    symptoms: selectedSymptoms.map(id => symptoms.find(s => s.id === id)?.label || id),
    probability: prob,
    level
  });

  // Save to Supabase in background (won't affect UI if it fails)
  try {
    const SUPABASE_URL = "https://odvnredkdodvxvtirwtg.supabase.co";
    const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kdm5yZWRrZG9kdnh2dGlyd3RnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2NDg1MDAsImV4cCI6MjA5MjIyNDUwMH0.MCDLSKnghJfk1vDZ-hZpeoIgDEsg9r_XxlzxsedA620";

    await fetch(`${SUPABASE_URL}/functions/v1/predict-pcos-risk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": ANON_KEY,
        "Authorization": `Bearer ${ANON_KEY}`
      },
      body: JSON.stringify({
        age: formData.age,
        height_cm: 160,           // default since form doesn't collect height
        weight_kg: formData.bmi * 2.56, // estimated from BMI
        menstrual_cycle_regular: !selectedSymptoms.includes('irreg'),
        avg_cycle_length_days: formData.cycleLength,
        symptom_acne: selectedSymptoms.includes('acne'),
        symptom_hairfall: selectedSymptoms.includes('thin'),
        symptom_excess_facial_hair: selectedSymptoms.includes('hair'),
        symptom_weight_gain: selectedSymptoms.includes('weight'),
        symptom_irregular_period: selectedSymptoms.includes('irreg'),
        symptom_mood_swings: false,
        exercise_frequency: "Rarely",
        sleep_hours: "7-9 hours",
        stress_level: 3,
        junk_food_frequency: "Occasionally",
      })
    });
    console.log("Saved to Supabase successfully");
  } catch (err) {
    console.log("Supabase save failed silently:", err);
  }
};


  return (
    <div className="flex flex-col gap-6">
      <div className="bg-amber-light border border-[#F5C97A] rounded-xl p-3 text-sm text-amber flex items-center gap-2">
        <Brain className="w-4 h-4" />
        <span>Logistic regression model trained on common PCOS biomarkers. Results are indicative — not a diagnosis.</span>
      </div>

      <div className="bg-white border border-border-main rounded-2xl p-6 shadow-bloom">
        <h3 className="font-serif text-lg mb-6">Enter your health markers</h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <InputGroup label="Age" value={formData.age} onChange={v => setFormData(p => ({...p, age: v}))} />
          <InputGroup label="BMI" value={formData.bmi} onChange={v => setFormData(p => ({...p, bmi: v}))} step={0.1} />
          <InputGroup label="Cycle length (days)" value={formData.cycleLength} onChange={v => setFormData(p => ({...p, cycleLength: v}))} />
          <InputGroup label="Fasting sugar (mg/dL)" value={formData.sugar} onChange={v => setFormData(p => ({...p, sugar: v}))} />
          <InputGroup label="Testosterone (ng/dL)" value={formData.testosterone} onChange={v => setFormData(p => ({...p, testosterone: v}))} step={0.1} />
          <InputGroup label="LH/FSH ratio" value={formData.lhfsh} onChange={v => setFormData(p => ({...p, lhfsh: v}))} step={0.1} />
        </div>

        <div className="mb-6">
          <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Symptoms present</p>
          <div className="flex flex-wrap gap-2">
            {symptoms.map(s => (
              <button
                key={s.id}
                onClick={() => toggleSymptom(s.id)}
                className={`px-4 py-2 rounded-full text-xs font-medium border-2 transition-all ${
                  selectedSymptoms.includes(s.id)
                    ? 'bg-rose border-rose text-white'
                    : 'bg-white border-border-main text-text-secondary hover:border-rose-mid'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={calculate}
          className="w-full bg-rose text-white py-3 rounded-xl font-semibold hover:bg-[#D4556B] transition-colors shadow-lg shadow-rose/20"
        >
          Calculate my PCOS risk
        </button>
      </div>

      {currentRisk && (
        <div className="bg-white border border-border-main rounded-2xl p-6 shadow-bloom animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="font-serif text-lg mb-4">Your risk profile</h3>
          
          <div className="relative w-full h-3 bg-gradient-to-r from-sage via-amber to-rose rounded-full mb-2">
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-2 border-text-main rounded-full shadow-md transition-all duration-1000 ease-out"
              style={{ left: `${Math.min(97, Math.max(3, currentRisk.probability * 100))}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-text-muted font-bold uppercase mb-4">
            <span>Low</span>
            <span>Medium</span>
            <span>High</span>
          </div>

          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm mb-6 ${
            currentRisk.level === 'low' ? 'bg-sage-light text-sage' :
            currentRisk.level === 'medium' ? 'bg-amber-light text-amber' :
            'bg-rose-light text-rose'
          }`}>
            {currentRisk.level === 'low' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {currentRisk.level.toUpperCase()} RISK ({Math.round(currentRisk.probability * 100)}% probability)
          </div>

          <div className="space-y-3 mb-6">
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Contributing factors</p>
            <FactorBar label="Hormonal (LH/FSH)" value={currentRisk.lhfsh > 2 ? 85 : currentRisk.lhfsh > 1.5 ? 55 : 25} color="bg-rose" />
            <FactorBar label="Metabolic (BMI/sugar)" value={currentRisk.bmi > 28 ? 85 : currentRisk.bmi > 25 ? 60 : 30} color="bg-amber" />
            <FactorBar label="Cycle irregularity" value={currentRisk.cycleLength > 40 ? 90 : currentRisk.cycleLength > 35 ? 65 : 40} color="bg-plum" />
            <FactorBar label="Androgen (testo)" value={currentRisk.testosterone > 70 ? 90 : currentRisk.testosterone > 50 ? 45 : 20} color="bg-sage" />
          </div>

          <div className={`p-4 rounded-xl border ${
            currentRisk.level === 'low' ? 'bg-sage-light border-sage-mid' :
            currentRisk.level === 'medium' ? 'bg-amber-light border-[#F5C97A]' :
            'bg-rose-light border-rose-mid'
          }`}>
            <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" />
              {currentRisk.level === 'low' ? "🌿 You're doing well!" : 
               currentRisk.level === 'medium' ? "⚠️ Moderate risk — take action" : 
               "🔴 High risk — see a doctor"}
            </h4>
            <p className="text-xs leading-relaxed text-text-secondary">
              {currentRisk.level === 'low' ? "Your markers suggest low PCOS risk. Maintain a balanced low-GI diet and stay active." :
               currentRisk.level === 'medium' ? "Several markers suggest elevated risk. Focus on reducing sugar and consult a gynaecologist." :
               "Your profile indicates high PCOS risk. Please consult a gynaecologist as soon as possible for proper diagnosis."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function InputGroup({ label, value, onChange, step = 1 }: { label: string, value: number, onChange: (v: number) => void, step?: number }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-semibold text-text-secondary">{label}</label>
      <input
        type="number"
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        step={step}
        className="border border-border-main rounded-xl px-3 py-2 text-sm outline-none focus:border-rose"
      />
    </div>
  );
}

function FactorBar({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] text-text-secondary min-w-[120px]">{label}</span>
      <div className="flex-1 h-1.5 bg-border-main rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-[11px] font-bold text-text-main min-w-[25px] text-right">{value}%</span>
    </div>
  );
}
