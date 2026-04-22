import React from 'react';
import { RiskData, SymptomLog } from '../types';
import { Brain, ClipboardList, Calendar, Utensils, MessageSquare, MapPin, ShieldCheck, Info } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
  riskData: RiskData | null;
  logs: SymptomLog[];
}

export default function Home({ onNavigate, riskData, logs }: HomeProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-gradient-to-br from-plum to-rose rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="font-serif text-2xl mb-1">Hello, how are you today?</h2>
          <p className="text-white/80 text-sm">Your intelligent PCOS companion — track, understand & act.</p>
        </div>
        <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
      </div>

      <div className="bg-plum-light border border-plum-mid rounded-2xl p-4 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-plum shrink-0" />
        <p className="text-[11px] leading-tight text-plum font-medium">
          <strong>Privacy by design:</strong> No PII stored. No login required. All data stays on your device.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Tile 
          icon={<Brain />} 
          title="ML Risk Score" 
          sub={riskData ? `${riskData.level.toUpperCase()} RISK` : "Check your PCOS risk"} 
          onClick={() => onNavigate('risk')} 
        />
        <Tile 
          icon={<ClipboardList />} 
          title="Log Symptoms" 
          sub="15+ health markers" 
          onClick={() => onNavigate('symptoms')} 
        />
        <Tile 
          icon={<Calendar />} 
          title="Cycle Tracker" 
          sub="Monitor your period" 
          onClick={() => onNavigate('cycle')} 
        />
        <Tile 
          icon={<Utensils />} 
          title="Diet & Guidance" 
          sub="Personalised tips" 
          onClick={() => onNavigate('diet')} 
        />
        <Tile 
          icon={<MessageSquare />} 
          title="AI Chat" 
          sub="Ask anything" 
          onClick={() => onNavigate('chat')} 
        />
        <Tile 
          icon={<MapPin />} 
          title="Find Gyno" 
          sub="By city or location" 
          onClick={() => onNavigate('gyno')} 
        />
      </div>

      <div className="bg-white border border-border-main rounded-2xl p-6 shadow-bloom">
        <h3 className="font-serif text-lg mb-4">Recent logs</h3>
        <div className="flex flex-col gap-3">
          {logs.length > 0 ? logs.slice(0, 3).map((log, idx) => (
            <div key={idx} className="border-l-4 border-rose bg-white rounded-r-xl p-3 shadow-sm border border-border-main border-l-rose">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold text-rose uppercase tracking-wider">{log.date} · Pain: {log.pain}/10</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {log.symptoms.map(s => (
                  <span key={s} className="bg-rose-light text-rose text-[10px] px-2 py-0.5 rounded-full font-medium">{s}</span>
                ))}
              </div>
            </div>
          )) : (
            <div className="text-center py-6">
              <Info className="w-8 h-8 text-text-muted mx-auto mb-2 opacity-20" />
              <p className="text-sm text-text-muted">No logs yet. Start tracking your symptoms!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Tile({ icon, title, sub, onClick }: { icon: React.ReactNode, title: string, sub: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="bg-white border border-border-main rounded-2xl p-4 text-left shadow-bloom hover:border-rose-mid hover:shadow-lg hover:shadow-rose/5 transition-all group"
    >
      <div className="text-2xl mb-2 group-hover:scale-110 transition-transform origin-left text-rose">
        {icon}
      </div>
      <div className="font-bold text-sm text-text-main mb-0.5">{title}</div>
      <div className="text-[10px] text-text-muted font-medium uppercase tracking-wider">{sub}</div>
    </button>
  );
}
