import React, { useEffect, useRef } from 'react'
import { resumeData } from '../data/resumeData'
import { Award, Compass, Cpu, GraduationCap, Lightbulb } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const sectionRef = useRef(null)
  const leftColRef = useRef(null)
  const rightColRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        [leftColRef.current, rightColRef.current],
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section 
      id="about" 
      ref={sectionRef}
      className="py-12 md:py-16 px-6 md:px-12 bg-snow text-graphite relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header Tag */}
        <div className="flex items-center gap-3 mb-10">
          <span className="h-[2px] w-12 bg-coral" />
          <span className="font-mono text-xs uppercase tracking-widest text-coral font-bold">
            01. Le Manifeste Personnel
          </span>
        </div>

        {/* 2-Column Layout with Coral Divider */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
          
          {/* Left Column: Dramatic Serif Title & Highlights */}
          <div ref={leftColRef} className="md:col-span-5 flex flex-col gap-6">
            <h2 className="font-serif-italic text-4xl sm:text-5xl md:text-6xl font-normal text-ink leading-tight">
              L'art d'allier la rigueur industrielle au Vibe Coding.
            </h2>
            <p className="text-sm font-mono text-coral font-semibold uppercase tracking-wider">
              — Mouliom Hassan, Ingénieur & Innovateur
            </p>

            {/* Quick Pillars Grid */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-4 rounded-2xl bg-white border border-ink/5 shadow-sm flex flex-col gap-2">
                <GraduationCap className="w-6 h-6 text-coral" />
                <span className="font-bold text-xs text-ink">Polytechnique Douala</span>
                <span className="text-[11px] text-graphite-muted">Génie Construction Industrielle</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-ink/5 shadow-sm flex flex-col gap-2">
                <Cpu className="w-6 h-6 text-coral" />
                <span className="font-bold text-xs text-ink">Agentic AI & n8n</span>
                <span className="text-[11px] text-graphite-muted">Agents WhatsApp & CRMs</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-ink/5 shadow-sm flex flex-col gap-2">
                <Award className="w-6 h-6 text-coral" />
                <span className="font-bold text-xs text-ink">MINEFOP Garoua</span>
                <span className="text-[11px] text-graphite-muted">Délégation Régionale du Nord</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-ink/5 shadow-sm flex flex-col gap-2">
                <Lightbulb className="w-6 h-6 text-coral" />
                <span className="font-bold text-xs text-ink">Vibe Coding</span>
                <span className="text-[11px] text-graphite-muted">Astro, React & Agents IA</span>
              </div>
            </div>
          </div>

          {/* Central Coral Divider Line (Desktop) */}
          <div className="hidden md:block md:col-span-1 h-full min-h-[400px] flex justify-center py-4">
            <div className="w-[2px] h-full bg-gradient-to-b from-coral via-coral/40 to-transparent rounded-full" />
          </div>

          {/* Right Column: Full Paragraph Story */}
          <div ref={rightColRef} className="md:col-span-6 flex flex-col gap-5 text-base text-graphite/90 leading-relaxed font-sans">
            {resumeData.about.story.map((paragraph, idx) => (
              <p key={idx} className="relative pl-4 border-l-2 border-transparent hover:border-coral transition-colors duration-300">
                {paragraph}
              </p>
            ))}

            <div className="mt-4 p-6 rounded-3xl bg-ink text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
              <div>
                <span className="text-xs font-mono text-coral block mb-1 uppercase tracking-wider">
                  Vision & Philosophie
                </span>
                <p className="text-sm font-medium text-snow/90 italic font-serif-italic text-lg">
                  « Maximiser l'impact technique par l'intelligence artificielle et l'automatisation. »
                </p>
              </div>
              <a 
                href="#experience"
                className="shrink-0 px-5 py-2.5 rounded-full bg-coral hover:bg-coral-hover text-white text-xs font-mono font-bold tracking-wider transition-transform hover:scale-105"
              >
                Voir les Expériences
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
