import React from 'react';
import { BarChart3, ArrowUp } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/10 bg-[#040813] py-10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-white/5">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white text-sm">
                {personalInfo.fullName}, S.Kom.
              </span>
              <span className="block text-xs text-slate-400">
                S1 Informatika — Universitas Muhammadiyah Semarang
              </span>
            </div>
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 font-medium">
            <a href="#about" className="hover:text-sky-300 transition-colors">Profil</a>
            <a href="#projects" className="hover:text-sky-300 transition-colors">Proyek</a>
            <a href="#skills" className="hover:text-sky-300 transition-colors">Skills</a>
            <a href="#experience" className="hover:text-sky-300 transition-colors">Pendidikan & Sertifikasi</a>
            <a href="#contact" className="hover:text-sky-300 transition-colors">Kontak</a>
          </div>

          {/* Back to top button */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0E1A38] text-slate-300 hover:text-white border border-white/5 text-xs font-medium hover:border-sky-500/30 transition-all"
          >
            <span>Ke Atas</span>
            <ArrowUp className="w-3.5 h-3.5 text-sky-400" />
          </button>

        </div>

        <div className="pt-5 text-center sm:text-left text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {personalInfo.fullName}. Portofolio Data Analyst.</p>
        </div>

      </div>
    </footer>
  );
}
