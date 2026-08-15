import React, { useEffect, useRef } from 'react'
import { resumeData } from '../data/resumeData'
import { Briefcase, Calendar, MapPin, CheckCircle2 } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Timeline() {
  const containerRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        if (!card) return
        
        gsap.fromTo(
          card,
          { opacity: 0, x: index % 2 === 0 ? -40 : 40, y: 30 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
            }
          }
        )
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section 
      id="experience" 
      ref={containerRef}
      className="py-12 md:py-16 px-6 md:px-12 bg-snow-muted/50 text-graphite relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header Tag */}
        <div className="flex items-center gap-3 mb-10">
          <span className="h-[2px] w-12 bg-coral" />
          <span className="font-mono text-xs uppercase tracking-widest text-coral font-bold">
            02. La Timeline Vivante
          </span>
        </div>

        <h2 className="font-serif-italic text-4xl sm:text-5xl font-normal text-ink mb-12 text-center">
          Expériences Principales & Impact Tech
        </h2>

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical Coral Center Line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-coral via-coral/30 to-transparent -translate-x-1/2" />
          <div className="md:hidden absolute left-4 top-0 bottom-0 w-[2px] bg-gradient-to-b from-coral via-coral/30 to-transparent" />

          {/* Cards List */}
          <div className="flex flex-col gap-10">
            {resumeData.experiences.map((exp, idx) => {
              const isEven = idx % 2 === 0
              return (
                <div 
                  key={idx}
                  ref={(el) => (cardsRef.current[idx] = el)}
                  className={`relative flex flex-col md:flex-row items-center ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Pulse Dot */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-snow border-4 border-coral shadow-glow-coral items-center justify-center z-10">
                    <span className="w-2 h-2 rounded-full bg-coral animate-ping" />
                  </div>
                  <div className="md:hidden absolute left-4 -translate-x-1/2 w-6 h-6 rounded-full bg-snow border-4 border-coral shadow-glow-coral items-center justify-center z-10" />

                  {/* Card Container */}
                  <div className="w-full md:w-1/2 pl-10 md:pl-0 md:px-8">
                    <div className="glass-card rounded-[2.5rem] p-6 sm:p-8 shadow-architect hover:shadow-architect-hover transition-all duration-300 group border border-ink/5 hover:border-coral/30">
                      
                      {/* Period Badge */}
                      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                        <span className="px-3.5 py-1 rounded-full bg-coral/10 text-coral font-mono text-xs font-bold tracking-wider flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {exp.period}
                        </span>
                        <span className="text-xs font-mono text-graphite-muted flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-coral" />
                          {exp.location}
                        </span>
                      </div>

                      {/* Job Title & Company */}
                      <h3 className="text-xl sm:text-2xl font-extrabold text-ink group-hover:text-coral transition-colors mb-1">
                        {exp.role}
                      </h3>
                      <p className="text-sm font-semibold text-graphite-muted mb-4 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-coral/80" />
                        {exp.company}
                      </p>

                      {/* Description */}
                      <p className="text-sm text-graphite/90 mb-4 leading-relaxed">
                        {exp.description}
                      </p>

                      {/* Bullet Details */}
                      <ul className="flex flex-col gap-2 mb-6 text-xs text-graphite/80 font-sans">
                        {exp.details.map((detail, dIdx) => (
                          <li key={dIdx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-coral shrink-0 mt-0.5" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Tech Stack Badges */}
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-ink/5">
                        {exp.tags.map((tag, tIdx) => (
                          <span 
                            key={tIdx}
                            className="px-2.5 py-1 rounded-lg bg-snow-muted text-[11px] font-mono text-ink font-semibold group-hover:bg-coral/10 group-hover:text-coral transition-colors"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                    </div>
                  </div>

                  {/* Empty Spacer Column for Alignment */}
                  <div className="hidden md:block w-1/2" />
                </div>
              )
            })}
          </div>

        </div>

      </div>
    </section>
  )
}
