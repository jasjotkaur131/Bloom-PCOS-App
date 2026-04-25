export interface SymptomLog {
  date: string;
  symptoms: string[];
  pain: number;
  fatigue: number;
  mood: number;
  bloating: number;
  notes: string;
}

export interface RiskData {
  age: number;
  bmi: number;
  cycleLength: number;
  sugar: number;
  testosterone: number;
  lhfsh: number;
  symptoms: string[];
  probability: number;
  level: 'low' | 'medium' | 'high';
  modelVersion: string;        
  factors: {                   
    hormonal: number;
    metabolic: number;
    cyclical: number;
    androgenic: number;
  };
}
export interface RiskData {
  age: number;
  bmi: number;
  cycleLength: number;
  sugar: number;
  testosterone: number;
  lhfsh: number;
  symptoms: string[];
  probability: number;
  level: 'low' | 'medium' | 'high';
  modelVersion: string;        
  factors: {                   
    hormonal: number;
    metabolic: number;
    cyclical: number;
    androgenic: number;
  };
}

export interface Doctor {
  name: string;
  specialty: string;
  area: string;
  distance: string;
  rating: number;
  initials: string;
  hospital: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface LabResult {
  id: string;
  date: string;
  marker: string;
  value: number;
  unit: string;
  status: 'normal' | 'high' | 'low';
  explanation: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  reminderTime: string;
  type: 'medication' | 'supplement';
  sideEffects: string[];
}

export interface Workout {
  id: string;
  title: string;
  duration: string;
  intensity: 'low' | 'medium' | 'high';
  type: string;
  description: string;
  videoId?: string;
}

export interface Product {
  id: string;
  name: string;
  price: string;
  category: string;
  image: string;
  description: string;
}
