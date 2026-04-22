import React, { useState } from 'react';
import { Users, MessageSquare, Video, Lock, Play, Calendar, Heart } from 'lucide-react';

export default function Community() {
  const [activeTab, setActiveTab] = useState<'circles' | 'webinars'>('circles');

  const circles = [
    { id: '1', name: 'PCOS at Work', members: '1.2k', topics: 'Managing fatigue, stress, workplace rights', icon: '💼' },
    { id: '2', name: 'Managing Hirsutism', members: '3.5k', topics: 'Laser, electrolysis, confidence tips', icon: '✨' },
    { id: '3', name: 'TTC with PCOS', members: '2.8k', topics: 'Ovulation tracking, fertility treatments', icon: '👶' },
    { id: '4', name: 'Weight Loss Journey', members: '5.1k', topics: 'Low-GI recipes, workout routines', icon: '🥗' }
  ];

  const webinars = [
    { id: '1', title: 'Understanding Insulin Resistance', expert: 'Dr. Anjali Shah', date: 'Live in 2 days', type: 'Upcoming' },
    { id: '2', title: 'PCOS & Mental Health', expert: 'Dr. Priya Mehta', duration: '45 mins', type: 'Recorded' },
    { id: '3', title: 'Dietary Myths Debunked', expert: 'Nutr. Sneha Rao', duration: '30 mins', type: 'Recorded' }
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex bg-white border border-border-main rounded-2xl p-1 shadow-bloom">
        <button 
          onClick={() => setActiveTab('circles')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'circles' ? 'bg-rose text-white shadow-md shadow-rose/20' : 'text-text-secondary hover:bg-rose-light'}`}
        >
          <Users className="w-4 h-4" />
          Circles
        </button>
        <button 
          onClick={() => setActiveTab('webinars')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'webinars' ? 'bg-rose text-white shadow-md shadow-rose/20' : 'text-text-secondary hover:bg-rose-light'}`}
        >
          <Video className="w-4 h-4" />
          Webinars
        </button>
      </div>

      {activeTab === 'circles' && (
        <div className="flex flex-col gap-4">
          <div className="bg-sage-light border border-sage-mid rounded-xl p-4 text-sage flex items-start gap-3">
            <Lock className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed">
              <strong>Anonymous & Safe:</strong> Your identity is protected. These moderated circles are a safe space for women to share and support each other.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {circles.map(c => (
              <button key={c.id} className="bg-white border border-border-main rounded-2xl p-5 text-left shadow-bloom hover:border-rose transition-all group">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl bg-plum-light w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      {c.icon}
                    </div>
                    <div>
                      <h4 className="font-serif text-lg text-text-main">{c.name}</h4>
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{c.members} members</p>
                    </div>
                  </div>
                  <div className="bg-rose-light text-rose p-2 rounded-xl">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">{c.topics}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'webinars' && (
        <div className="flex flex-col gap-4">
          <h3 className="font-serif text-lg px-2">Expert Q&A Sessions</h3>
          {webinars.map(w => (
            <div key={w.id} className="bg-white border border-border-main rounded-2xl overflow-hidden shadow-bloom group">
              <div className="aspect-video bg-plum-light relative flex items-center justify-center">
                <img src={`https://picsum.photos/seed/webinar${w.id}/600/400`} alt={w.title} className="w-full h-full object-cover opacity-40" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-plum/60 to-transparent" />
                <button className="relative z-10 bg-white/20 backdrop-blur-md border border-white/30 p-4 rounded-full text-white hover:scale-110 transition-transform">
                  {w.type === 'Upcoming' ? <Calendar className="w-8 h-8" /> : <Play className="w-8 h-8 fill-current" />}
                </button>
                <div className="absolute top-4 left-4">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg ${w.type === 'Upcoming' ? 'bg-amber text-white' : 'bg-sage text-white'}`}>
                    {w.type}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h4 className="font-serif text-lg text-text-main mb-1">{w.title}</h4>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-text-secondary">with {w.expert}</p>
                  <p className="text-[10px] font-bold text-rose uppercase tracking-wider">
                    {w.date || w.duration}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-gradient-to-br from-plum to-rose rounded-2xl p-6 text-white text-center shadow-lg shadow-rose/20">
        <Heart className="w-8 h-8 mx-auto mb-3 opacity-80" />
        <h3 className="font-serif text-xl mb-2">Join the Movement</h3>
        <p className="text-sm text-white/80 mb-6 leading-relaxed">
          Bloom is more than an app. It's a community of 50,000+ women reclaiming their health.
        </p>
        <button className="bg-white text-rose px-8 py-3 rounded-xl font-bold hover:bg-rose-light transition-all">
          Invite a Friend
        </button>
      </div>
    </div>
  );
}
