import React, { useState, useEffect } from 'react';
import { BarChart3, Menu, X } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Profil', href: '#about' },
    { name: 'Proyek', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Pendidikan & Sertifikasi', href: '#experience' },
    { name: 'Kontak', href: '#contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      scrolled 
        ? 'bg-[#060B18]/85 backdrop-blur-md border-b border-sky-500/15 py-3 shadow-lg shadow-black/40' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-white text-base sm:text-lg tracking-tight group-hover:text-sky-300 transition-colors">
                {personalInfo.fullName}
              </span>
              <span className="block text-[10px] font-mono text-sky-400 -mt-1 tracking-wider uppercase font-semibold">
                Data Analyst Portfolio
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#0c1630]/70 px-4 py-1.5 rounded-full border border-white/5 backdrop-blur-md">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="#contact"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 text-slate-950 shadow-md shadow-sky-500/20 transition-all"
            >
              Hubungi Saya
            </a>
          </div>

          {/* Mobile menu trigger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-[#0E1A38] text-slate-300 hover:text-white border border-white/10"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 p-4 rounded-2xl bg-[#0B132B] border border-sky-500/20 shadow-2xl space-y-2 animate-fadeIn">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-200 hover:bg-sky-500/10 hover:text-sky-300 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
        )}

      </div>
    </header>
  );
}
