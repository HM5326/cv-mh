import React, { useEffect, useRef } from 'react'
import { resumeData } from '../data/resumeData'
import { Download, MessageSquare, Terminal, ArrowDown } from 'lucide-react'
import gsap from 'gsap'

export default function Hero({ onOpenResumeModal, onOpenContactModal }) {
  const containerRef = useRef(null)
  const avatarRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const statsRef = useRef(null)
  const ctaRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      
      tl.fromTo(
        avatarRef.current,
        { scale: 0.8, opacity: 0, y: 30 },
        { scale: 1, opacity: 1, y: 0, duration: 1 }
      )
      .fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.6'
      )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.6'
      )
      .fromTo(
        statsRef.current?.children || [],
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, stagger: 0.12, duration: 0.6 },
        '-=0.4'
      )
      .fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.3'
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen w-full bg-ink text-snow-pure flex flex-col justify-between pt-28 pb-12 px-6 md:px-12 overflow-hidden selection:bg-coral selection:text-white"
    >
      {/* Subtle Background Mesh & Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-coral/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-snow-pure/5 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Decorative Line Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Main Content Area */}
      <div className="relative z-10 max-w-5xl mx-auto w-full my-auto flex flex-col items-center text-center">
        
        {/* Avatar Badge */}
        <div ref={avatarRef} className="relative mb-8 group">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-coral via-coral-light to-white opacity-70 blur-md group-hover:opacity-100 transition duration-500 animate-pulse-glow" />
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-ink-soft border-2 border-coral/80 p-1 flex items-center justify-center shadow-2xl overflow-hidden">
            <div className="w-full h-full rounded-full bg-gradient-to-b from-ink-soft to-ink-deep flex flex-col items-center justify-center relative">
              <span className="font-extrabold font-sans text-3xl md:text-4xl text-white tracking-widest">
                MH
              </span>
              <span className="text-[10px] font-mono text-coral uppercase tracking-widest mt-1">
                Ingénieur & Codeur
              </span>
              <div className="absolute bottom-2 px-2 py-0.5 rounded-full bg-coral/20 border border-coral/40 text-[9px] font-mono text-coral-light flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
                Vibe Coding Active
              </div>
            </div>
          </div>
        </div>

        {/* Big Impact Name Headline */}
        <h1 
          ref={titleRef}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-4 uppercase"
        >
          {resumeData.personal.name}
        </h1>

        {/* Professional Title in Editorial Cormorant Garamond */}
        <p 
          ref={subtitleRef}
          className="font-serif-italic text-2xl sm:text-3xl md:text-4xl text-coral-light font-normal max-w-3xl mb-8 leading-tight"
        >
          {resumeData.personal.title}
        </p>

        {/* Monospace Indicator Stats Badges */}
        <div 
          ref={statsRef}
          className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 mb-10 text-xs sm:text-sm font-mono text-snow/80"
        >
          {resumeData.stats.map((stat, i) => (
            <React.Fragment key={stat.code}>
              <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-2 hover:border-coral/50 transition-colors">
                <Terminal className="w-3.5 h-3.5 text-coral" />
                <span className="font-bold text-white">{stat.value}</span>
                <span className="text-white/50 text-[10px]">({stat.label})</span>
              </div>
              {i < resumeData.stats.length - 1 && (
                <span className="hidden sm:inline text-coral font-bold">•</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Action CTAs: Primary = Me Contacter, Secondary = Télécharger CV */}
        <div ref={ctaRef} className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onOpenContactModal}
            className="magnetic-btn px-8 py-4 rounded-full bg-coral hover:bg-coral-hover text-white font-mono font-bold text-sm tracking-wider flex items-center gap-3 shadow-xl shadow-coral/30"
          >
            <MessageSquare className="w-4.5 h-4.5" />
            Me Contacter
          </button>
          
          <button
            onClick={onOpenResumeModal}
            className="magnetic-btn px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-sm tracking-wider border border-white/20 flex items-center gap-3 backdrop-blur-sm"
          >
            <Download className="w-4 h-4 text-coral" />
            Télécharger CV (PDF)
          </button>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="relative z-10 flex flex-col items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
        <a href="#about" className="flex flex-col items-center gap-2 text-xs font-mono uppercase tracking-widest text-snow/70">
          <span>Découvrir le parcours</span>
          <ArrowDown className="w-4 h-4 text-coral animate-bounce" />
        </a>
      </div>
    </section>
  )
}
