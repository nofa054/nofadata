import React from 'react';
import { skillsCategories } from '../data/portfolioData';

export default function Skills() {
  return (
    <section id="skills" className="py-16 relative bg-[#070D1E]/60 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Skills & <span className="text-sky-400">Tools</span>
          </h2>
          <p className="mt-2 text-slate-400 text-sm sm:text-base">
            Tools dan metode analisis data yang saya gunakan dalam mengerjakan proyek portofolio.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {skillsCategories.map((cat, idx) => (
            <div 
              key={idx}
              className="bg-gradient-to-b from-[#0C1736] to-[#081026] rounded-3xl p-6 border border-sky-500/15 hover:border-sky-400/35 transition-all duration-300"
            >
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {cat.category}
                </h3>
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              </div>
              <p className="text-xs text-slate-400 mb-4">
                {cat.description}
              </p>

              {/* Skills list */}
              <div className="space-y-2.5">
                {cat.skills.map((skill, sIdx) => (
                  <div 
                    key={sIdx}
                    className="bg-[#080F24] p-3 rounded-xl border border-white/5"
                  >
                    <span className="text-sm font-bold text-slate-200 block">
                      {skill.name}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {skill.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
