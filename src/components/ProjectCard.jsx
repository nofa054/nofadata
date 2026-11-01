import React from 'react';
import { 
  FileText, 
  Maximize2
} from 'lucide-react';
import { GithubIcon } from './SocialIcons';
import sampleImage from '../assets/sample-project-preview.jpg';

export default function ProjectCard({ project, onOpenCaseStudy }) {
  // Helper function to render text with bold emphasis
  const renderHighlightedText = (text) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const clean = part.slice(2, -2);
        return (
          <strong key={index} className="text-white font-extrabold bg-sky-500/10 px-1 py-0.5 rounded border-b-2 border-amber-400">
            {clean}
          </strong>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="relative group rounded-3xl bg-gradient-to-b from-[#0B1530] via-[#091126] to-[#060B18] border border-sky-500/20 hover:border-sky-400/40 transition-all duration-500 p-4 sm:p-7 shadow-xl shadow-sky-950/40">
      
      {/* Top Bar inside card: Category & Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
            {project.category}
          </span>
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-400/10 text-amber-300 border border-amber-400/20">
            {project.badge}
          </span>
        </div>
      </div>

      {/* Main Layout: 2 Columns (Dashboard Screenshot on Left, Explanation on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left/Visual Column (Span 7): Always show original Dashboard Screenshot */}
        <div className="lg:col-span-7">
          <div 
            onClick={() => onOpenCaseStudy(project)}
            className="rounded-2xl overflow-hidden border border-sky-500/30 shadow-2xl relative group/img bg-[#091124] cursor-pointer"
          >
            <img 
              src={project.image || sampleImage} 
              alt={`${project.displayTitle} preview`}
              className="w-full h-auto object-contain rounded-xl group-hover/img:scale-[1.02] transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060B18]/90 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
              <span className="text-xs font-mono text-sky-300">
                {project.title}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/20 border border-sky-400/40 text-sky-200 text-xs font-semibold">
                <Maximize2 className="w-3.5 h-3.5" />
                Detail & Case Study
              </span>
            </div>
          </div>
        </div>

        {/* Right/Explanation Column (Span 5) */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-4">
          
          {/* Project Title */}
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-400 tracking-tight leading-snug hover:text-amber-300 transition-colors">
              {project.displayTitle}
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 font-medium">
              {project.title}
            </p>
          </div>

          {/* Highlighted Description */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0e1a38]/60 border border-sky-500/15 backdrop-blur-md">
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed tracking-wide">
              {renderHighlightedText(project.highlightDesc)}
            </p>
          </div>

          {/* Key Impact Metrics Ribbon */}
          <div className={`grid gap-2 py-2 ${project.metrics.length === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'}`}>
            {project.metrics.map((m, idx) => (
              <div key={idx} className="bg-[#0c1630] rounded-xl p-2.5 border border-white/5 text-center">
                <div className="text-sm sm:text-base font-bold font-mono text-sky-300">{m.value}</div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium leading-tight mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>

          {/* Tech Stack Pills */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Tech Stack & Methodology
            </span>
            <div className="flex flex-wrap gap-1.5">
              {project.tools.map((tool, idx) => (
                <span 
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono bg-[#0c1733] text-sky-300 border border-sky-500/20 font-medium"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons: Case Study Modal & GitHub */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <button
              onClick={() => onOpenCaseStudy(project)}
              className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <FileText className="w-4 h-4" />
              <span>Full Case Study</span>
            </button>

            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#0e1a38] hover:bg-[#13244e] text-slate-200 hover:text-white border border-white/10 text-xs sm:text-sm font-semibold transition-all hover:border-white/20"
            >
              <GithubIcon className="w-4 h-4 text-slate-300" />
              <span>SQL/Code</span>
            </a>
          </div>

        </div>

      </div>

    </div>
  );
}
