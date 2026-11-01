import React from 'react';
import { stats } from '../data/portfolioData';

export default function StatsOverview() {
  return (
    <section className="py-8 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((item, index) => (
            <div 
              key={index}
              className="bg-gradient-to-b from-[#0E1B3D] to-[#0A132C] p-5 sm:p-6 rounded-2xl border border-sky-500/20 hover:border-sky-400/40 transition-all duration-300 group"
            >
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-amber-300 font-mono tracking-tight group-hover:scale-105 transition-transform origin-left">
                {item.value}
              </div>
              <div className="text-sm sm:text-base font-bold text-white mt-1">
                {item.label}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

