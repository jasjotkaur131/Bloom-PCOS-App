import React, { useState } from 'react';
import { analyzeImage } from '../lib/ai';
import { LabResult } from '../types';
import { Upload, FileText, AlertCircle, CheckCircle2, Info, Camera } from 'lucide-react';
import { Type } from '@google/genai';

export default function LabAnalyzer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<LabResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(',')[1];
        
        const schema = {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              marker: { type: Type.STRING },
              value: { type: Type.NUMBER },
              unit: { type: Type.STRING },
              status: { type: Type.STRING, enum: ['normal', 'high', 'low'] },
              explanation: { type: Type.STRING },
            },
            required: ['marker', 'value', 'unit', 'status', 'explanation'],
          },
        };

        const prompt = "Extract blood test markers related to PCOS (LH, FSH, Testosterone, Prolactin, Insulin, Glucose, etc.) from this report. Provide the marker name, value, unit, status relative to normal ranges, and a brief explanation in simple terms.";
        
        const analyzedResults = await analyzeImage(base64, prompt, schema);
        if (analyzedResults) {
          setResults(analyzedResults.map((r: any, i: number) => ({ ...r, id: String(i), date: new Date().toLocaleDateString() })));
        } else {
          setError("Failed to analyze the report. Please ensure the image is clear and contains blood test results.");
        }
        setIsAnalyzing(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setError("An error occurred during file processing.");
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-plum-light border border-plum-mid rounded-xl p-3 text-sm text-plum flex items-center gap-2">
        <FileText className="w-4 h-4" />
        <span>Upload your blood test results (LH, FSH, Testosterone, etc.) for AI-powered analysis and explanation.</span>
      </div>

      <div className="bg-white border border-border-main rounded-2xl p-8 shadow-bloom text-center">
        <div className="w-16 h-16 bg-rose-light rounded-full flex items-center justify-center mx-auto mb-4">
          <Upload className="w-8 h-8 text-rose" />
        </div>
        <h3 className="font-serif text-xl mb-2">Upload Lab Report</h3>
        <p className="text-sm text-text-secondary mb-6">Support JPG, PNG or PDF. Ensure text is clearly visible.</p>
        
        <label className="inline-flex items-center gap-2 bg-rose text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#D4556B] transition-colors cursor-pointer shadow-lg shadow-rose/20">
          <Camera className="w-5 h-5" />
          Select File
          <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isAnalyzing} />
        </label>

        {isAnalyzing && (
          <div className="mt-6 flex flex-col items-center gap-2">
            <div className="animate-spin w-6 h-6 border-2 border-rose border-t-transparent rounded-full" />
            <p className="text-sm text-plum font-medium">AI is analyzing your report...</p>
          </div>
        )}

        {error && (
          <div className="mt-6 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="font-serif text-lg px-2">Analysis Results</h3>
          {results.map((res) => (
            <div key={res.id} className="bg-white border border-border-main rounded-2xl p-5 shadow-bloom">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold text-text-main">{res.marker}</h4>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider">{res.date}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  res.status === 'normal' ? 'bg-sage-light text-sage' :
                  res.status === 'high' ? 'bg-rose-light text-rose' : 'bg-amber-light text-amber'
                }`}>
                  {res.status}
                </div>
              </div>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-2xl font-bold text-text-main">{res.value}</span>
                <span className="text-sm text-text-muted">{res.unit}</span>
              </div>
              <div className="p-3 bg-plum-light/50 rounded-xl border border-plum-mid/10">
                <p className="text-xs leading-relaxed text-text-secondary">
                  <Info className="w-3 h-3 inline-block mr-1 mb-0.5 text-plum" />
                  {res.explanation}
                </p>
              </div>
            </div>
          ))}
          <div className="p-4 bg-sage-light border border-sage-mid rounded-xl flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-sage shrink-0 mt-0.5" />
            <p className="text-xs text-sage leading-relaxed">
              <strong>Note:</strong> This analysis is for informational purposes only. Always discuss these results with your healthcare provider for a clinical diagnosis.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
