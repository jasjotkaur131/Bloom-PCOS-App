import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Droplets, Circle } from 'lucide-react';

export default function CycleTracker() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [periodDays, setPeriodDays] = useState<Set<string>>(new Set());
  const [cycleLen, setCycleLen] = useState(28);
  const [lastPeriodStart, setLastPeriodStart] = useState<string>(new Date().toISOString().split('T')[0]);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const toggleDay = (day: number) => {
    const key = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}`;
    const newSet = new Set(periodDays);
    if (newSet.has(key)) newSet.delete(key);
    else newSet.add(key);
    setPeriodDays(newSet);
  };

  const markPeriod = (type: 'start' | 'end') => {
    if (type === 'start') {
      const now = new Date();
      const newSet = new Set(periodDays);
      for (let i = 0; i < 5; i++) {
        const d = new Date(now);
        d.setDate(d.getDate() + i);
        newSet.add(`${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`);
      }
      setPeriodDays(newSet);
      setLastPeriodStart(now.toISOString().split('T')[0]);
    }
  };

  const daysToNext = () => {
    const last = new Date(lastPeriodStart);
    const next = new Date(last);
    next.setDate(next.getDate() + cycleLen);
    const diff = Math.ceil((next.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 'Today';
  };

  const getFertilityWindow = () => {
    const last = new Date(lastPeriodStart);
    const ovulation = new Date(last);
    ovulation.setDate(ovulation.getDate() + (cycleLen - 14));
    
    const start = new Date(ovulation);
    start.setDate(start.getDate() - 3);
    
    const end = new Date(ovulation);
    end.setDate(end.getDate() + 1);
    
    return { start, end, ovulation };
  };

  const renderDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const prevMonthDays = getDaysInMonth(year, month - 1);
    const today = new Date();
    const { start, end, ovulation } = getFertilityWindow();

    const days = [];
    // Previous month days
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`prev-${i}`} className="aspect-square flex items-center justify-center text-xs text-text-muted opacity-30">{prevMonthDays - firstDay + 1 + i}</div>);
    }
    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const key = `${year}-${month + 1}-${d}`;
      const isPeriod = periodDays.has(key);
      const isToday = today.getDate() === d && today.getMonth() === month && today.getFullYear() === year;
      const isFertile = date >= start && date <= end;
      const isOvulation = date.getTime() === ovulation.getTime();
      
      days.push(
        <button
          key={d}
          onClick={() => toggleDay(d)}
          className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-all border-2 relative ${
            isPeriod ? 'bg-rose border-rose text-white' : 
            isToday ? 'border-rose text-rose font-bold' : 
            isFertile ? 'bg-sage-light border-sage-mid text-sage' : 'border-transparent hover:bg-rose-light'
          }`}
        >
          {d}
          {isOvulation && !isPeriod && <div className="absolute bottom-1 w-1 h-1 bg-sage rounded-full" />}
        </button>
      );
    }
    return days;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-3">
        <StatBox value={cycleLen} label="Avg cycle (days)" />
        <StatBox value={5} label="Period length" />
        <StatBox value={daysToNext()} label="Days to next" />
      </div>

      <div className="bg-sage-light border border-sage-mid rounded-xl p-3 text-sm text-sage flex items-center gap-2">
        <Droplets className="w-4 h-4" />
        <span>Predicted Fertility Window: {getFertilityWindow().start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - {getFertilityWindow().end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
      </div>

      <div className="bg-white border border-border-main rounded-2xl p-6 shadow-bloom">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-1 border border-border-main rounded-lg text-text-secondary hover:bg-plum-light transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h3 className="font-serif font-bold text-text-main">{months[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
          <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-1 border border-border-main rounded-lg text-text-secondary hover:bg-plum-light transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
            <div key={d} className="text-center text-[10px] font-bold text-text-muted uppercase py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {renderDays()}
        </div>

        <div className="flex flex-wrap gap-4 mt-6">
          <div className="flex items-center gap-2 text-[11px] text-text-secondary">
            <div className="w-3 h-3 bg-rose rounded-full" />
            Period (tap to mark)
          </div>
          <div className="flex items-center gap-2 text-[11px] text-text-secondary">
            <div className="w-3 h-3 border-2 border-rose rounded-full" />
            Today
          </div>
        </div>
      </div>

      <div className="bg-white border border-border-main rounded-2xl p-6 shadow-bloom">
        <h3 className="font-serif text-lg mb-4">Log period</h3>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button onClick={() => markPeriod('start')} className="flex flex-col items-center gap-2 p-4 border-2 border-border-main rounded-2xl hover:border-rose hover:bg-rose-light transition-all group">
            <Droplets className="w-6 h-6 text-rose group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-text-main">Period started</span>
          </button>
          <button onClick={() => markPeriod('end')} className="flex flex-col items-center gap-2 p-4 border-2 border-border-main rounded-2xl hover:border-rose hover:bg-rose-light transition-all group">
            <Circle className="w-6 h-6 text-text-muted group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-text-main">Period ended</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Cycle length (days)</label>
            <input
              type="number"
              value={cycleLen}
              onChange={e => setCycleLen(parseInt(e.target.value))}
              className="border border-border-main rounded-xl px-3 py-2 text-sm outline-none focus:border-rose"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Last period start</label>
            <input
              type="date"
              value={lastPeriodStart}
              onChange={e => setLastPeriodStart(e.target.value)}
              className="border border-border-main rounded-xl px-3 py-2 text-sm outline-none focus:border-rose"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ value, label }: { value: string | number, label: string }) {
  return (
    <div className="bg-plum-light rounded-2xl p-4 text-center">
      <div className="font-serif text-2xl text-plum mb-1">{value}</div>
      <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{label}</div>
    </div>
  );
}
