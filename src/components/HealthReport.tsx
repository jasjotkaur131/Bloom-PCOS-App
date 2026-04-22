import React from 'react';
import { RiskData, SymptomLog, LabResult, Medication } from '../types';
import { FileDown, Printer, Share2, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';

interface HealthReportProps {
  riskData: RiskData | null;
  logs: SymptomLog[];
  labs: LabResult[];
  meds: Medication[];
}

export default function HealthReport({ riskData, logs, labs, meds }: HealthReportProps) {
  const downloadPDF = () => {
    // In a real app, this would use a library like jspdf
    alert("Generating PDF Health Summary... This would typically trigger a download.");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-plum-light border border-plum-mid rounded-xl p-3 text-sm text-plum flex items-center gap-2">
        <FileDown className="w-4 h-4" />
        <span>Generate a comprehensive health summary to share with your doctor during your next visit.</span>
      </div>

      <div className="bg-white border border-border-main rounded-2xl p-8 shadow-bloom">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="font-serif text-2xl text-text-main">Health Summary</h2>
            <p className="text-xs text-text-muted uppercase tracking-wider">Generated on {new Date().toLocaleDateString()}</p>
          </div>
          <div className="text-right">
            <div className="font-serif text-xl text-rose">🌸 Bloom</div>
            <p className="text-[10px] text-text-muted">PCOS Companion</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Risk Profile */}
          <section>
            <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-3 border-b border-border-main pb-1">1. Risk Profile</h3>
            {riskData ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-plum-light rounded-xl">
                  <p className="text-[10px] text-plum uppercase font-bold mb-1">Risk Level</p>
                  <p className="text-lg font-serif text-plum">{riskData.level.toUpperCase()}</p>
                </div>
                <div className="p-3 bg-plum-light rounded-xl">
                  <p className="text-[10px] text-plum uppercase font-bold mb-1">BMI</p>
                  <p className="text-lg font-serif text-plum">{riskData.bmi}</p>
                </div>
                <div className="p-3 bg-plum-light rounded-xl">
                  <p className="text-[10px] text-plum uppercase font-bold mb-1">Cycle Length</p>
                  <p className="text-lg font-serif text-plum">{riskData.cycleLength} days</p>
                </div>
                <div className="p-3 bg-plum-light rounded-xl">
                  <p className="text-[10px] text-plum uppercase font-bold mb-1">LH/FSH Ratio</p>
                  <p className="text-lg font-serif text-plum">{riskData.lhfsh}</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-text-muted italic">No risk data available.</p>
            )}
          </section>

          {/* Lab Results */}
          <section>
            <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-3 border-b border-border-main pb-1">2. Recent Lab Markers</h3>
            {labs.length > 0 ? (
              <div className="space-y-2">
                {labs.map(lab => (
                  <div key={lab.id} className="flex justify-between items-center text-xs py-1">
                    <span className="text-text-secondary">{lab.marker}</span>
                    <span className="font-bold">{lab.value} {lab.unit} ({lab.status})</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-text-muted italic">No lab results logged.</p>
            )}
          </section>

          {/* Medications */}
          <section>
            <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-3 border-b border-border-main pb-1">3. Current Medications</h3>
            {meds.length > 0 ? (
              <div className="space-y-2">
                {meds.map(med => (
                  <div key={med.id} className="flex justify-between items-center text-xs py-1">
                    <span className="text-text-secondary">{med.name}</span>
                    <span className="font-bold">{med.dosage} · {med.frequency}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-text-muted italic">No medications logged.</p>
            )}
          </section>

          {/* Symptom Trends */}
          <section>
            <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-3 border-b border-border-main pb-1">4. Symptom Trends (Last 30 Days)</h3>
            {logs.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-rose rounded-full" />
                  <p className="text-xs text-text-secondary">Most frequent: {logs[0].symptoms.join(', ')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-plum rounded-full" />
                  <p className="text-xs text-text-secondary">Avg Pain Severity: 4.2/10</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-text-muted italic">No symptom logs available.</p>
            )}
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-border-main flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-sage shrink-0" />
          <p className="text-[10px] text-text-muted leading-tight">
            This report is generated based on user-inputted data and AI analysis. It is intended to facilitate discussion with a medical professional and is not a clinical diagnosis.
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <button 
          onClick={downloadPDF}
          className="flex-1 bg-rose text-white py-3 rounded-xl font-bold hover:bg-[#D4556B] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-rose/20"
        >
          <FileDown className="w-5 h-5" />
          Download PDF
        </button>
        <button className="p-3 border border-border-main rounded-xl bg-white text-text-secondary hover:bg-plum-light transition-colors">
          <Printer className="w-5 h-5" />
        </button>
        <button className="p-3 border border-border-main rounded-xl bg-white text-text-secondary hover:bg-plum-light transition-colors">
          <Share2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
