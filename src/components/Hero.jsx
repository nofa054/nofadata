import React, { useState, useRef } from 'react';
import { 
  ArrowRight, 
  Mail, 
  Database, 
  TrendingUp, 
  BarChart2, 
  GraduationCap,
  MapPin
} from 'lucide-react';
import { personalInfo } from '../data/portfolioData';
import nofaNavyWallImg from '../assets/nofa-profile-navywall.jpg';

export default function Hero() {
  const [isWobbling, setIsWobbling] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current || isWobbling) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const handleCardClick = () => {
    setIsWobbling(false);
    setTimeout(() => {
      setIsWobbling(true);
    }, 10);
    setTimeout(() => {
      setIsWobbling(false);
    }, 760);
  };

  return (
    <section id="about" className="relative pt-28 pb-16 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Clean & Direct Introduction (Span 7) */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-5">
            
            {/* Status Badge */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0E1A38] border border-sky-500/30 text-sky-300 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Open to Work • Data Analyst</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-medium">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Semarang, Jawa Tengah</span>
              </div>
            </div>

            {/* Name & Education */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                {personalInfo.fullName}, <span className="text-sky-400">S.Kom.</span>
              </h1>
              <p className="text-base sm:text-lg font-semibold text-amber-400 flex items-center justify-center lg:justify-start gap-2">
                <GraduationCap className="w-5 h-5" />
                <span>Fresh Graduate S1 Informatika — Universitas Muhammadiyah Semarang</span>
              </p>
            </div>

            {/* Concise, Honest Bio */}
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Lulusan baru S1 Informatika yang memiliki ketertarikan di bidang <strong>Data Analysis</strong>. Terbiasa mengolah data menggunakan <strong>SQL</strong>, <strong>Python (Pandas & Scikit-Learn)</strong>, dan <strong>Microsoft Excel</strong> mulai dari tahap pembersihan data (<em>data cleaning</em>), eksplorasi pola transaksi, hingga penyusunan visualisasi dashboard.
            </p>

            {/* Core Tools Summary */}
            <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto lg:mx-0 text-left pt-1">
              <div className="bg-[#0B1530]/80 p-3 rounded-2xl border border-white/5 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400 flex-shrink-0">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Query</span>
                  <span className="text-xs font-bold text-white">SQL / SQLite</span>
                </div>
              </div>

              <div className="bg-[#0B1530]/80 p-3 rounded-2xl border border-white/5 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 flex-shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Analysis</span>
                  <span className="text-xs font-bold text-white">Python</span>
                </div>
              </div>

              <div className="bg-[#0B1530]/80 p-3 rounded-2xl border border-white/5 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <BarChart2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Visualisasi</span>
                  <span className="text-xs font-bold text-white">Excel & BI</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <a
                href="#projects"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 text-slate-950 font-bold text-sm shadow-lg shadow-sky-500/20 transition-all"
              >
                <span>Lihat 3 Proyek Portofolio</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#contact"
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0e1a38] hover:bg-[#13234d] text-white border border-sky-500/30 font-semibold text-sm transition-all"
              >
                <Mail className="w-4 h-4 text-sky-400" />
                <span>Hubungi Saya</span>
              </a>
            </div>

          </div>

          {/* Right Column: Interactive Wobble/Tilt Profile Card (Span 5) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-xs sm:max-w-sm select-none">
              <div
                ref={cardRef}
                onClick={handleCardClick}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                  transform: isWobbling
                    ? undefined
                    : `perspective(900px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
                  transition: 'transform 0.18s ease-out',
                }}
                className={`cursor-pointer relative bg-gradient-to-b from-[#0E1B3D] to-[#081026] border border-sky-500/30 hover:border-sky-400/60 rounded-3xl p-4 shadow-2xl shadow-sky-950/60 ${
                  isWobbling ? 'animate-card-wobble' : ''
                }`}
              >
                {/* Photo Container */}
                <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#060B18] border border-sky-500/20">
                  <img
                    src={nofaNavyWallImg}
                    alt={`${personalInfo.fullName}, S.Kom.`}
                    draggable={false}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                {/* Clean Card Caption */}
                <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm sm:text-base font-extrabold text-white">
                      {personalInfo.fullName}, S.Kom.
                    </h4>
                    <p className="text-xs text-sky-400 font-medium">
                      S1 Informatika • UNIMUS
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-500/20 text-[11px] font-mono font-semibold text-sky-300">
                    Data Analyst
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
