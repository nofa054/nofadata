import React from 'react';
import { GraduationCap, Award, ExternalLink, FileText } from 'lucide-react';
import { educationList, certifications } from '../data/portfolioData';

export default function Experience() {
  return (
    <section id="experience" className="py-16 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Pendidikan & <span className="text-sky-400">Sertifikasi</span>
          </h2>
          <p className="mt-2 text-slate-400 text-sm sm:text-base">
            Latar belakang akademik S1 Informatika serta sertifikasi kompetensi dari Oracle Academy dan MySkill.
          </p>
        </div>

        {/* Education Row */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-sky-400" />
            Pendidikan
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {educationList.map((edu, idx) => (
              <div 
                key={idx}
                className="bg-gradient-to-r from-[#0C1736] to-[#0A132C] p-5 rounded-2xl border border-sky-500/15"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <span className="text-base font-bold text-white">
                    {edu.degree}
                  </span>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/20">
                    {edu.period}
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-amber-400 mb-2">
                  {edu.institution}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {edu.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications Grid */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Sertifikasi Kompetensi ({certifications.length} Sertifikat)
            </h3>
            <span className="text-xs text-slate-400">
              Klik <strong className="text-sky-300">Lihat PDF</strong> untuk membuka dokumen sertifikat asli
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certifications.map((cert, idx) => (
              <div 
                key={idx}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                  cert.highlight
                    ? 'bg-gradient-to-b from-[#102048] to-[#0A132C] border-amber-400/30 hover:border-amber-400/60'
                    : 'bg-gradient-to-b from-[#0C1736] to-[#091126] border-sky-500/15 hover:border-sky-400/40'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                      cert.highlight
                        ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                        : 'bg-sky-500/10 text-sky-300 border border-sky-500/20'
                    }`}>
                      {cert.type}
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                    {cert.name}
                  </h4>

                  <div className="text-xs text-sky-400 font-medium mt-1">
                    {cert.issuer}
                  </div>
                </div>

                <div className="pt-2.5 border-t border-white/5 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400 font-mono truncate">
                    {cert.detail}
                  </span>

                  <a
                    href={cert.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/15 hover:bg-sky-500 text-sky-300 hover:text-slate-950 text-xs font-bold border border-sky-400/30 transition-all flex-shrink-0"
                  >
                    <FileText className="w-3 h-3" />
                    <span>Lihat PDF</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
