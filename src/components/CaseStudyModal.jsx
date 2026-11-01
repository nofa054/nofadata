import React from 'react';
import { 
  X, 
  AlertCircle, 
  Lightbulb, 
  TrendingUp, 
  CheckCircle2, 
  ExternalLink, 
  Database
} from 'lucide-react';

export default function CaseStudyModal({ project, onClose }) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Click outside to close wrapper */}
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-4xl bg-gradient-to-b from-[#0F1C3F] to-[#080E21] border border-sky-500/30 rounded-3xl shadow-2xl p-5 sm:p-8 z-10 max-h-[90vh] overflow-y-auto custom-scroll">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors border border-white/5"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 pr-8">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              {project.category}
            </span>
            <span className="text-xs text-sky-400 font-mono">{project.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            <span className="text-amber-400">{project.displayTitle}</span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">{project.fullDescription}</p>
        </div>

        {/* Full Dashboard Image Preview */}
        {project.image && (
          <div className="mb-6 rounded-2xl overflow-hidden border border-sky-500/30 bg-[#060B18] shadow-xl">
            <img
              src={project.image}
              alt={project.displayTitle}
              className="w-full h-auto object-contain"
            />
          </div>
        )}

        {/* Key Metrics Quick Ribbon */}
        <div className={`grid gap-3 mb-8 ${project.metrics.length === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'}`}>
          {project.metrics.map((m, i) => (
            <div key={i} className="bg-[#0B1530] p-3 rounded-2xl border border-sky-500/20 text-center">
              <span className="text-lg sm:text-xl font-black text-sky-300 font-mono block">{m.value}</span>
              <span className="text-xs text-slate-400 font-medium">{m.label}</span>
            </div>
          ))}
        </div>

        {/* Deep Dive Grid: Problem -> Action / Solution -> Business Impact */}
        <div className="space-y-6">
          
          {/* Problem Statement */}
          <div className="bg-[#0B1530]/70 rounded-2xl p-5 border border-red-500/20 relative overflow-hidden">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-base mb-2">
              <AlertCircle className="w-5 h-5" />
              <h3>The Business Problem & Pain Point</h3>
            </div>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {project.caseStudy?.problem}
            </p>
          </div>

          {/* Action & Analytics Approach */}
          <div className="bg-[#0B1530]/70 rounded-2xl p-5 border border-sky-500/20 relative overflow-hidden">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-base mb-2">
              <Lightbulb className="w-5 h-5" />
              <h3>Data Analytics Approach & Execution</h3>
            </div>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
              {project.caseStudy?.action}
            </p>
            <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mr-2">
                <Database className="w-3.5 h-3.5 text-sky-400" /> Tools Deployed:
              </span>
              {project.tools.map((t, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-sky-950/60 text-sky-300 text-xs font-mono border border-sky-500/20">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Measurable Business Impact */}
          <div className="bg-[#0B1530]/70 rounded-2xl p-5 border border-emerald-500/20 relative overflow-hidden">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-base mb-2">
              <TrendingUp className="w-5 h-5" />
              <h3>Key Insights & Business Impact</h3>
            </div>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {project.caseStudy?.impact}
            </p>
          </div>

        </div>

        {/* Modal Footer with Actions */}
        <div className="mt-8 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>End-to-End Portfolio Case Study</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View Repository</span>
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 font-semibold text-xs sm:text-sm transition-all"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
