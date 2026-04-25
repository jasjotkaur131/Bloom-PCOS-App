
export const MODEL_VERSION = "bloom-lr-v2.1";

interface MLInput {
  age: number;
  bmi: number;
  cycleLength: number;
  sugar: number;          
  testosterone: number;   
  lhfsh: number;          
  symptoms: string[];
}

interface MLOutput {
  probability: number;
  level: 'low' | 'medium' | 'high';
  factors: {
    hormonal: number;
    metabolic: number;
    cyclical: number;
    androgenic: number;
  };
  modelVersion: string;
}

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

function normalize(val: number, min: number, max: number): number {
  return Math.max(0, Math.min(1, (val - min) / (max - min)));
}

export function predictPCOSRisk(input: MLInput): MLOutput {
  const { bmi, cycleLength, sugar, testosterone, lhfsh, symptoms } = input;

  
  const bmiNorm   = normalize(bmi, 18, 40);         // 18=underweight, 40=obese
  const cycleNorm = normalize(cycleLength, 21, 60);  // 21=short, 60=very long
  const sugarNorm = normalize(sugar, 70, 140);       // 70=normal, 140=high
  const testoNorm = normalize(testosterone, 20, 100);// 20=normal, 100=very high
  const lhfshNorm = normalize(lhfsh, 0.5, 4.0);     // 0.5=normal, 4.0=very high

  const hasIrreg   = symptoms.includes('irreg') ? 1 : 0;
  const hasAcne    = symptoms.includes('acne') ? 1 : 0;
  const hasHair    = symptoms.includes('hair') ? 1 : 0;
  const hasThin    = symptoms.includes('thin') ? 1 : 0;
  const hasWeight  = symptoms.includes('weight') ? 1 : 0;
  const hasCysts   = symptoms.includes('cysts') ? 1 : 0;
  const hasInsulin = symptoms.includes('insulin') ? 1 : 0;
  const hasFatigue = symptoms.includes('fatigue') ? 1 : 0;

  
  const hormonal = Math.min(100, Math.round(
    lhfshNorm * 60 +                 
    testoNorm * 25 +                
    hasAcne * 8 + hasHair * 7        
  ));

  const metabolic = Math.min(100, Math.round(
    bmiNorm * 45 +                   
    sugarNorm * 35 +                 
    hasWeight * 10 + hasInsulin * 10 
  ));

  const cyclical = Math.min(100, Math.round(
    cycleNorm * 55 +                
    hasIrreg * 35 + hasFatigue * 5 +
    hasCysts * 5                     
  ));

  const androgenic = Math.min(100, Math.round(
    testoNorm * 50 +                 
    hasHair * 20 + hasThin * 15 +    
    hasAcne * 15                     
  ));

  
  const rawScore =
    lhfshNorm   * 2.8 +   
    cycleNorm   * 2.2 +   
    testoNorm   * 1.8 +   
    bmiNorm     * 1.4 +   
    sugarNorm   * 1.0 +   
    hasIrreg    * 1.6 +   
    hasCysts    * 2.0 +   
    hasInsulin  * 1.2 +   
    hasHair     * 0.9 +   
    hasThin     * 0.7 +  
    hasWeight   * 0.6 +   
    hasAcne     * 0.4 +   
    hasFatigue  * 0.3;    

  const probability = parseFloat(sigmoid(rawScore - 3.5).toFixed(3));

  let level: 'low' | 'medium' | 'high';
  if (probability < 0.35)      level = 'low';
  else if (probability < 0.62) level = 'medium';
  else                         level = 'high';

  return {
    probability,
    level,
    factors: { hormonal, metabolic, cyclical, androgenic },
    modelVersion: MODEL_VERSION,
  };
}