import React from 'react';
import { 
  BrainCircuit, 
  Target, 
  MessageSquareCheck, 
  MapPin, 
  GraduationCap,
  Sparkles
} from 'lucide-react';
import { personalInfo } from '../data/portfolioData';

export default function About() {
  const pillars = [
    {
      icon: BrainCircuit,
      title: "Fondasi Informatika & Pemrograman Data",
      desc: "Latar belakang S1 Informatika membekali saya dengan pemahaman kuat dalam logika pemrograman, kueri basis data relasional (SQL / SQLite), serta pengolahan data menggunakan Python (Pandas, NumPy, Scikit-Learn)."
    },
    {
      icon: Target,
      title: "Fokus Analisis Berorientasi Bisnis",
      desc: "Mampu menerjemahkan data transaksi, funnel pemasaran, dan perilaku pelanggan (RFM & Pareto 80/20) menjadi metrik kinerja utama (KPI) yang relevan bagi perkembangan bisnis."
    },
    {
      icon: MessageSquareCheck,
      title: "Visualisasi Dashboard & Data Storytelling",
      desc: "Menyajikan hasil analisis ke dalam bentuk dashboard eksekutif yang rapi, interaktif, dan mudah dipahami oleh tim maupun manajemen dalam mengambil keputusan."
    }
  ];

  return (
    <section id="about" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Bio & Academic Background */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider">
              Tentang Saya
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Lulusan <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-amber-300">S1 Informatika</span> dengan Ketertarikan Kuat pada Data Analytics
            </h2>

            <p className="text-slate-300 text-base leading-relaxed">
              Halo! Nama saya <strong>{personalInfo.fullName}</strong>, lulusan baru (<em>Fresh Graduate</em>) <strong>S1 Informatika dari Universitas Muhammadiyah Semarang (UNIMUS)</strong>. Selama masa studi hingga menyusun portofolio ini, saya mendalami bagaimana data dapat diolah menjadi informasi bernilai tinggi untuk memecahkan persoalan bisnis.
            </p>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Saya senang mengeksplorasi dataset, melakukan <em>data cleaning</em>, membangun model segmentasi seperti <strong>K-Means Clustering (RFM)</strong>, hingga merancang <strong>Executive Dashboard</strong>. Prinsip kerja yang saya pegang dalam menganalisis data:
              <span className="text-amber-400 font-bold block mt-1.5">
                "{personalInfo.tagline}"
              </span>
            </p>

            {/* Quick Details Badges */}
            <div className="pt-2 flex flex-wrap gap-3 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0E1A38] text-slate-300 border border-white/5">
                <GraduationCap className="w-4 h-4 text-amber-400" />
                <span>S1 Informatika — Universitas Muhammadiyah Semarang</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0E1A38] text-slate-300 border border-white/5">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <span>{personalInfo.location}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0E1A38] text-emerald-300 border border-emerald-500/20">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Siap Berkontribusi (Full-Time / Junior Data Analyst)</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3 Analytical Pillars Cards */}
          <div className="lg:col-span-6 space-y-4">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div 
                  key={idx}
                  className="bg-gradient-to-r from-[#0C1736] to-[#0A132C] p-5 rounded-2xl border border-sky-500/15 hover:border-sky-400/35 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform flex-shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                        {pillar.title}
                      </h3>
                      <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
