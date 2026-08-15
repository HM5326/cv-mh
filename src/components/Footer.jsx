import React from 'react'
import { resumeData } from '../data/resumeData'
import { Sparkles, ArrowUp } from 'lucide-react'

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-ink-deep text-white rounded-t-[3.5rem] md:rounded-t-[4rem] pt-16 pb-10 px-6 md:px-12 border-t border-white/10 relative">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Left Brand & Title */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-8 h-8 rounded-full bg-coral flex items-center justify-center font-mono font-bold text-xs">
              MH
            </span>
            <span className="font-extrabold text-lg tracking-tight text-white">
              {resumeData.personal.name}
            </span>
          </div>
          <p className="text-xs font-mono text-snow/60">
            Ingénieur des Techniques Industrielles & Vibe Codeur
          </p>
        </div>

        {/* Live Indicator Dot */}
        <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 flex items-center gap-3 text-xs font-mono text-snow/90">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
          </span>
          <span>Statut : En Ligne & Actif Garoua / Douala</span>
        </div>

        {/* Right Scroll to top */}
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-snow/50 hidden sm:inline">
            Fait avec le Vibe Coding © {new Date().getFullYear()}
          </span>
          <button
            onClick={scrollToTop}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-coral transition-colors flex items-center justify-center text-white"
            aria-label="Retour en haut"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  )
}
