import React from 'react';
import { RiskData, Workout } from '../types';
import { Dumbbell, Play, Clock, Zap, Info, Flame, Heart } from 'lucide-react';

interface WorkoutsProps {
  riskData: RiskData | null;
}

export default function Workouts({ riskData }: WorkoutsProps) {
  const getWorkoutType = () => {
    if (!riskData) return 'General PCOS Wellness';
    if (riskData.bmi > 25 || riskData.sugar > 100) return 'Insulin-Sensitising Strength';
    if (riskData.level === 'high') return 'Adrenal-Safe Low Impact';
    return 'Metabolic Boost';
  };

  const workouts: Workout[] = [
    {
      id: '1',
      title: 'Slow Weighted Strength',
      duration: '30 mins',
      intensity: 'medium',
      type: 'Strength',
      description: 'Focus on slow, controlled movements to build muscle without spiking cortisol. Ideal for insulin resistance.',
      videoId: 'UItWltVZZmE'
    },
    {
      id: '2',
      title: 'PCOS-Safe Yoga Flow',
      duration: '20 mins',
      intensity: 'low',
      type: 'Flexibility',
      description: 'Gentle stretches and breathing exercises to reduce stress and balance hormones.',
      videoId: 'v7AYKMP6rOE'
    },
    {
      id: '3',
      title: 'Zone 2 Walking',
      duration: '45 mins',
      intensity: 'low',
      type: 'Cardio',
      description: 'Steady-state cardio that burns fat and improves insulin sensitivity without overtaxing the body.',
      videoId: 'enYITYwvPAQ'
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-rose-light border border-rose-mid rounded-xl p-4 text-rose">
        <div className="flex items-center gap-2 font-bold text-sm mb-1">
          <Zap className="w-4 h-4" />
          Recommended for you: {getWorkoutType()}
        </div>
        <p className="text-xs leading-relaxed">
          {riskData ?
            "Based on your health profile, we recommend focusing on slow-weighted strength training to improve insulin sensitivity while keeping cortisol levels low." :
            "Complete your Risk Score to get a personalized workout plan tailored to your PCOS type."
          }
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-border-main rounded-2xl p-4 shadow-bloom flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-plum-light rounded-full flex items-center justify-center text-plum mb-2">
            <Clock className="w-5 h-5" />
          </div>
          <div className="text-xl font-serif text-text-main">150</div>
          <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Weekly Goal (mins)</div>
        </div>
        <div className="bg-white border border-border-main rounded-2xl p-4 shadow-bloom flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-sage-light rounded-full flex items-center justify-center text-sage mb-2">
            <Flame className="w-5 h-5" />
          </div>
          <div className="text-xl font-serif text-text-main">45</div>
          <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Active Today (mins)</div>
        </div>
      </div>

      <div className="bg-white border border-border-main rounded-xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
            <Heart className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-main">Apple Health</p>
            <p className="text-[10px] text-text-muted">Last synced 2m ago</p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-sage uppercase tracking-wider">Connected</span>
      </div>

      <h3 className="font-serif text-lg px-2">Daily Routine</h3>
      <div className="flex flex-col gap-4">
        {workouts.map(w => (
          <div key={w.id} className="bg-white border border-border-main rounded-2xl p-5 shadow-bloom group hover:border-rose transition-all">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${w.intensity === 'low' ? 'bg-sage-light text-sage' :
                    w.intensity === 'medium' ? 'bg-amber-light text-amber' : 'bg-rose-light text-rose'
                    }`}>
                    {w.intensity} intensity
                  </span>
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{w.type}</span>
                </div>
                <h4 className="font-serif text-lg text-text-main">{w.title}</h4>
              </div>
              <button className="bg-rose text-white p-2 rounded-full shadow-lg shadow-rose/20 group-hover:scale-110 transition-transform">
                <Play className="w-4 h-4 fill-current" />
              </button>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed mb-4">{w.description}</p>
            {w.videoId && (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-4 border border-border-main bg-black">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${w.videoId}`}
                  title={w.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
            <div className="flex items-center gap-4 text-[11px] font-bold text-text-muted">
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {w.duration}
              </div>
              <div className="flex items-center gap-1">
                <Dumbbell className="w-3.5 h-3.5" />
                No equipment
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-plum-light border border-plum-mid rounded-2xl p-6 shadow-bloom">
        <h3 className="font-serif text-lg mb-2 flex items-center gap-2">
          <Info className="w-5 h-5 text-plum" />
          Why Slow Strength?
        </h3>
        <p className="text-xs text-text-secondary leading-relaxed">
          High-intensity workouts can sometimes spike cortisol (the stress hormone), which can worsen PCOS symptoms for some women. Slow-weighted strength training builds muscle, which improves insulin sensitivity, without the hormonal stress of intense cardio.
        </p>
      </div>
    </div>
  );
}
