import React, { useState, useEffect } from 'react'
import { Download, MessageSquare, Menu, X, ArrowUpRight } from 'lucide-react'

export default function Navbar({ onOpenResumeModal, onOpenContactModal }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'À propos', href: '#about' },
    { name: 'Expériences', href: '#experience' },
    { name: 'Projets', href: '#projects' },
    { name: 'Compétences', href: '#skills' },
    { name: 'Contact', href: '#contact' },
  ]

  return (
    <nav className="fixed top-4 inset-x-0 z-40 flex justify-center px-4 transition-all duration-500">
      <div 
        className={`w-full max-w-5xl rounded-full px-5 py-3 flex items-center justify-between transition-all duration-500 ${
          scrolled 
            ? 'bg-snow-pure/80 backdrop-blur-xl border border-ink/10 shadow-architect text-ink' 
            : 'bg-ink/70 backdrop-blur-md border border-white/10 text-snow-pure'
        }`}
      >
        {/* Brand initials / Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-coral flex items-center justify-center text-white font-bold font-mono text-sm shadow-sm group-hover:scale-105 transition-transform">
            MH
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm tracking-tight group-hover:text-coral transition-colors">
              Mouliom Hassan
            </span>
            <span className="text-[10px] opacity-75 font-mono tracking-wider uppercase">
              Vibe Codeur & Ingénieur
            </span>
          </div>
        </a>

        {/* Desktop Anchor Links */}
        <div className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`hover:text-coral transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-coral hover:after:w-full after:transition-all ${
                scrolled ? 'text-graphite' : 'text-snow/90'
              }`}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* CTAs: Primary = Me Contacter, Secondary = Télécharger CV */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenResumeModal}
            className={`hidden sm:flex px-3.5 py-1.5 rounded-full text-xs font-mono font-bold items-center gap-1.5 transition-colors ${
              scrolled ? 'text-graphite hover:text-coral' : 'text-snow/80 hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>CV PDF</span>
          </button>

          <button
            onClick={onOpenContactModal}
            className="magnetic-btn px-4 py-2 rounded-full bg-coral hover:bg-coral-hover text-white text-xs font-bold font-mono tracking-wider flex items-center gap-2 shadow-md shadow-coral/20"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Me Contacter</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-full ${scrolled ? 'text-ink' : 'text-white'}`}
            aria-label="Menu Mobile"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-4 top-20 z-50 bg-ink-soft/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl md:hidden text-white flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-bold tracking-wide py-2 border-b border-white/10 flex items-center justify-between hover:text-coral transition-colors"
            >
              <span>{link.name}</span>
              <ArrowUpRight className="w-4 h-4 text-coral" />
            </a>
          ))}

          <button
            onClick={() => {
              setMobileMenuOpen(false)
              onOpenContactModal()
            }}
            className="w-full mt-2 py-3 rounded-2xl bg-coral hover:bg-coral-hover text-white font-mono font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
          >
            <MessageSquare className="w-4 h-4" />
            Me Contacter (Formulaire Direct)
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false)
              onOpenResumeModal()
            }}
            className="w-full py-2.5 rounded-2xl border border-white/20 text-white font-mono font-bold text-xs flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            Télécharger CV PDF
          </button>
        </div>
      )}
    </nav>
  )
}
