import React from 'react'
import { resumeData } from '../data/resumeData'
import { Download, MessageSquare, ArrowUpRight, Sparkles, Send } from 'lucide-react'

export default function Contact({ onOpenResumeModal, onOpenContactModal }) {
  return (
    <section 
      id="contact" 
      className="py-16 md:py-24 px-6 md:px-12 bg-snow text-graphite relative overflow-hidden"
    >
      <div className="max-w-5xl mx-auto">
        
        {/* Section Header Tag */}
        <div className="flex items-center gap-3 mb-8">
          <span className="h-[2px] w-12 bg-coral" />
          <span className="font-mono text-xs uppercase tracking-widest text-coral font-bold">
            06. Le Pont (Contact)
          </span>
        </div>

        {/* High Impact Card Container */}
        <div className="glass-card rounded-[3.5rem] p-8 sm:p-14 shadow-2xl border border-ink/10 relative overflow-hidden bg-gradient-to-br from-white via-snow to-coral/5">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-coral/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Column: Big Headline & Form Callout */}
            <div className="md:col-span-7 flex flex-col gap-6">
              <h2 className="font-serif-italic text-4xl sm:text-6xl font-normal text-ink leading-tight">
                Construisons ensemble vos projets d'exception.
              </h2>
              <p className="text-sm font-sans text-graphite/80 leading-relaxed max-w-lg">
                Sollicitez-moi pour la réalisation d'un <strong>Agent IA conversationnel</strong>, la création d'un <strong>site web Vibe Coding (Astro, React)</strong> ou du <strong>conseil en ingénierie & automatisation</strong>.
              </p>

              {/* Primary Call To Action Button: Me Contacter */}
              <div className="pt-2">
                <button
                  onClick={onOpenContactModal}
                  className="magnetic-btn w-full sm:w-auto px-8 py-4 rounded-full bg-coral hover:bg-coral-hover text-white font-mono font-bold text-sm tracking-wider flex items-center justify-center gap-3 shadow-xl shadow-coral/30"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Me Contacter (Formulaire Direct)</span>
                </button>
              </div>
            </div>

            {/* Right Column: Secondary CV Download Box */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-8 rounded-[2.5rem] bg-ink text-white shadow-2xl text-center">
              <div className="w-14 h-14 rounded-full bg-coral/20 border-2 border-coral text-coral flex items-center justify-center mb-5 animate-pulse-glow">
                <Download className="w-7 h-7" />
              </div>

              <h3 className="font-extrabold text-lg mb-2 text-white">
                Synthèse CV & Coordonnées Officieuses
              </h3>
              <p className="text-xs text-snow/70 mb-6 max-w-xs font-mono leading-relaxed">
                Retrouvez mes coordonnées professionnelles complètes (Téléphone & Email) dans la synthèse PDF.
              </p>

              <button
                onClick={onOpenResumeModal}
                className="w-full py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-mono font-bold text-xs tracking-wider flex items-center justify-center gap-2 backdrop-blur-sm transition-colors"
              >
                <Download className="w-4 h-4 text-coral" />
                Télécharger le CV (PDF)
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}
