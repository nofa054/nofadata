import React from 'react';
import { analyticsWorkflow } from '../data/portfolioData';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function AnalyticsWorkflow() {
  return (
    <section id="workflow" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            Standard Operating Procedure
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            End-to-End <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-amber-300">Data Analytics Workflow</span>
          </h2>
          <p className="mt-2 text-slate-400 text-sm sm:text-base">
            Bagaimana saya menerjemahkan masalah bisnis abstrak menjadi solusi dashboard yang terukur dan berdampak nyata.
          </p>
        </div>

        {/* 5-Step Process Flow Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {analyticsWorkflow.map((item, index) => (
            <div 
              key={index}
              className="bg-gradient-to-b from-[#0C1736] to-[#081026] p-5 rounded-2xl border border-sky-500/15 hover:border-amber-400/40 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-black font-mono text-amber-400 group-hover:scale-110 transition-transform origin-left">
                    {item.step}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-sky-400 group-hover:bg-amber-400 transition-colors" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition-colors mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>Phase {item.step}</span>
                <span className="text-sky-400">Step Complete →</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

