import React, { useState } from 'react';
import ProjectCard from './ProjectCard';
import CaseStudyModal from './CaseStudyModal';
import { projects } from '../data/portfolioData';

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModalProject, setActiveModalProject] = useState(null);

  const categories = [
    'All',
    'E-Commerce & Logistics',
    'Marketing & Funnel',
    'Customer Analytics'
  ];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => p.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <section id="projects" className="py-14 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Proyek <span className="text-sky-400">Portofolio Data Analyst</span>
          </h2>
          <p className="mt-2 text-slate-400 text-sm sm:text-base">
            3 studi kasus pengolahan data menggunakan SQL, Python, dan visualisasi dashboard.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25 border border-sky-400'
                    : 'bg-[#0E1A38] text-slate-400 hover:text-white border border-white/5 hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Cards List */}
        <div className="space-y-10">
          {filteredProjects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onOpenCaseStudy={(proj) => setActiveModalProject(proj)} 
            />
          ))}
        </div>

      </div>

      {/* Case Study Modal */}
      <CaseStudyModal 
        project={activeModalProject} 
        onClose={() => setActiveModalProject(null)} 
      />
    </section>
  );
}
