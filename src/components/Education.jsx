import React, { useEffect, useRef } from 'react'
import { resumeData } from '../data/resumeData'
import { GraduationCap, Award, BookOpen, Scroll } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Education() {
  const containerRef = useRef(null)
  const listRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (listRef.current?.children) {
        gsap.fromTo(
          listRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 80%',
            }
          }
        )
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section 
      ref={containerRef}
      className="py-24 px-6 md:px-12 bg-ink text-white relative overflow-hidden"
    >
      <div className="max-w-5xl mx-auto">
        
        {/* Section Header Tag */}
        <div className="flex items-center gap-3 mb-8">
          <span className="h-[2px] w-12 bg-coral" />
          <span className="font-mono text-xs uppercase tracking-widest text-coral font-bold">
            05. Les Fondations
          </span>
        </div>

        <h2 className="font-serif-italic text-4xl sm:text-5xl font-normal text-white mb-12">
          Formation & Diplômes Académiques
        </h2>

        {/* Stacked Cards List */}
        <div ref={listRef} className="flex flex-col gap-6">
          {resumeData.education.map((item, idx) => (
            <div 
              key={idx}
              className="glass-card-dark rounded-[2.2rem] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-white/10 hover:border-coral/40 transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3.5 rounded-2xl bg-coral/20 border border-coral/40 text-coral group-hover:scale-110 transition-transform shrink-0 mt-1">
                  <GraduationCap className="w-6 h-6" />
                </div>

                <div>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-coral font-mono text-xs font-bold inline-block mb-2">
                    {item.year}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-coral-light transition-colors">
                    {item.degree}
                  </h3>
                  <p className="text-xs font-semibold text-snow/70 mb-2">
                    {item.institution}
                  </p>
                  <p className="text-xs text-snow/80 max-w-2xl leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
