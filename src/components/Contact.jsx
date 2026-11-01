import React, { useState } from 'react';
import { 
  Mail, 
  MapPin, 
  GraduationCap,
  Copy,
  Check
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './SocialIcons';
import { personalInfo } from '../data/portfolioData';

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    personalInfo.email
  )}&su=${encodeURIComponent('Peluang Kerja Data Analyst - Nofa Amandasari')}`;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="contact" className="py-16 relative border-t border-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Kontak <span className="text-sky-400">Saya</span>
          </h2>
          <p className="mt-2 text-slate-400 text-sm sm:text-base">
            Terbuka untuk peluang kerja sebagai <strong>Data Analyst</strong> (Full-Time, Junior / Entry-Level, Management Trainee, maupun Internship).
          </p>
        </div>

        {/* Clean Centered Contact Card */}
        <div className="bg-gradient-to-b from-[#0C1736] to-[#081026] p-6 sm:p-8 rounded-3xl border border-sky-500/20 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a 
              href={gmailComposeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#080F24] border border-white/5 hover:border-sky-500/40 transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400 flex-shrink-0 group-hover:scale-105 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-slate-400 block font-medium">Email (Klik untuk Gmail)</span>
                <span className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-sky-300 transition-colors truncate block">
                  {personalInfo.email}
                </span>
              </div>
            </a>

            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#080F24] border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Pendidikan</span>
                <span className="text-xs sm:text-sm font-semibold text-slate-200">
                  S1 Informatika • UNIMUS
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#080F24] border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Domisili</span>
                <span className="text-xs sm:text-sm font-semibold text-slate-200">
                  Semarang, Indonesia
                </span>
              </div>
            </div>
          </div>

          {/* Direct Action Links */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-center gap-3">
            <a 
              href={gmailComposeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs sm:text-sm font-bold transition-all shadow-md shadow-sky-500/20"
            >
              <Mail className="w-4 h-4" />
              <span>Kirim Email (via Gmail)</span>
            </a>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#080F24] hover:bg-white/10 text-slate-200 border border-white/10 text-xs sm:text-sm font-semibold transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Email Disalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-sky-400" />
                  <span>Salin Alamat Email</span>
                </>
              )}
            </button>

            <a 
              href={personalInfo.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#080F24] hover:bg-sky-500/20 text-slate-200 hover:text-sky-300 border border-white/10 text-xs sm:text-sm font-semibold transition-all"
            >
              <LinkedinIcon className="w-4 h-4" />
              <span>LinkedIn</span>
            </a>

            <a 
              href={personalInfo.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#080F24] hover:bg-sky-500/20 text-slate-200 hover:text-sky-300 border border-white/10 text-xs sm:text-sm font-semibold transition-all"
            >
              <GithubIcon className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
