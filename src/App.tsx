import React, { useState } from 'react';
import Home from './components/Home';
import RiskScore from './components/RiskScore';
import Symptoms from './components/Symptoms';
import CycleTracker from './components/CycleTracker';
import DietGuidance from './components/DietGuidance';
import AIChat from './components/AIChat';
import GynoFinder from './components/GynoFinder';
import LabAnalyzer from './components/LabAnalyzer';
import MedicineCabinet from './components/MedicineCabinet';
import Workouts from './components/Workouts';
import Marketplace from './components/Marketplace';
import Community from './components/Community';
import HealthReport from './components/HealthReport';
import { RiskData, SymptomLog, LabResult, Medication } from './types';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [riskData, setRiskData] = useState<RiskData | null>(null);
  const [logs, setLogs] = useState<SymptomLog[]>([]);
  const [labs, setLabs] = useState<LabResult[]>([]);
  const [meds, setMeds] = useState<Medication[]>([
    { id: '1', name: 'Myo-Inositol', dosage: '2000mg', frequency: 'Twice daily', reminderTime: '08:00', type: 'supplement', sideEffects: [] },
    { id: '2', name: 'Metformin', dosage: '500mg', frequency: 'Once daily', reminderTime: '20:00', type: 'medication', sideEffects: ['Nausea'] }
  ]);

  const handleRiskCalculate = (data: RiskData) => {
    setRiskData(data);
  };

  const handleSaveLog = (log: SymptomLog) => {
    setLogs(prev => [log, ...prev]);
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home': return <Home onNavigate={setActivePage} riskData={riskData} logs={logs} />;
      case 'risk': return <RiskScore onCalculate={handleRiskCalculate} currentRisk={riskData} />;
      case 'symptoms': return <Symptoms onSave={handleSaveLog} logs={logs} />;
      case 'cycle': return <CycleTracker />;
      case 'diet': return <DietGuidance riskData={riskData} />;
      case 'chat': return <AIChat riskData={riskData} />;
      case 'gyno': return <GynoFinder />;
      case 'labs': return <LabAnalyzer />;
      case 'meds': return <MedicineCabinet />;
      case 'workouts': return <Workouts riskData={riskData} />;
      case 'shop': return <Marketplace />;
      case 'community': return <Community />;
      case 'report': return <HealthReport riskData={riskData} logs={logs} labs={labs} meds={meds} />;
      default: return <Home onNavigate={setActivePage} riskData={riskData} logs={logs} />;
    }
  };

  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'risk', label: 'Risk Score' },
    { id: 'labs', label: 'Lab Analyzer' },
    { id: 'symptoms', label: 'Symptoms' },
    { id: 'cycle', label: 'Cycle' },
    { id: 'meds', label: 'Cabinet' },
    { id: 'diet', label: 'Diet' },
    { id: 'workouts', label: 'Workouts' },
    { id: 'chat', label: 'AI Chat' },
    { id: 'gyno', label: 'Find Gyno' },
    { id: 'shop', label: 'Market' },
    { id: 'community', label: 'Community' },
    { id: 'report', label: 'Report' },
  ];

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Navigation */}
      <nav className="bg-white border-b border-border-main sticky top-0 z-50 shadow-bloom">
        <div className="max-w-[660px] mx-auto flex items-center px-4">
          <div 
            className="font-serif text-lg text-rose py-4 pr-4 border-r border-border-main mr-2 whitespace-nowrap cursor-pointer"
            onClick={() => setActivePage('home')}
          >
            🌸 Bloom
          </div>
          <div className="flex overflow-x-auto no-scrollbar gap-1 flex-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActivePage(tab.id)}
                className={`px-4 py-4 text-xs font-bold whitespace-nowrap transition-all border-b-2 ${
                  activePage === tab.id 
                    ? 'text-rose border-rose' 
                    : 'text-text-secondary border-transparent hover:text-rose hover:bg-rose-light'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-[660px] w-full mx-auto p-5 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Nav Hint */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-rose via-plum to-sage opacity-20" />
    </div>
  );
}
