import React, { useEffect, useRef } from 'react'
import { resumeData } from '../data/resumeData'
import { ExternalLink, Layers, ArrowUpRight, CheckCircle } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Projects() {
  const containerRef = useRef(null)
  const gridRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (gridRef.current?.children) {
        gsap.fromTo(
          gridRef.current.children,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
            }
          }
        )
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const sectionRef = useRef(null)

  return (
    <section 
      id="projects" 
      ref={sectionRef}
      className="py-24 px-6 md:px-12 bg-ink text-white relative overflow-hidden"
    >
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-coral/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header Tag */}
        <div className="flex items-center gap-3 mb-8">
          <span className="h-[2px] w-12 bg-coral" />
          <span className="font-mono text-xs uppercase tracking-widest text-coral font-bold">
            03. Réalisations Phares
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="font-serif-italic text-4xl sm:text-5xl font-normal text-white mb-3">
              Projets Concrets & Automations
            </h2>
            <p className="text-sm font-mono text-snow/70">
              Des agents IA conversationnels aux portails web & systèmes d'ingénierie.
            </p>
          </div>
          <span className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-mono text-coral font-bold flex items-center gap-2 self-start md:self-auto">
            <Layers className="w-4 h-4" />
            100% Production Ready
          </span>
        </div>

        {/* Projects Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {resumeData.projects.map((project, idx) => (
            <div 
              key={idx}
              className="group glass-card-dark rounded-[2.5rem] p-6 flex flex-col justify-between hover:border-coral/60 transition-all duration-500 hover:-translate-y-2 shadow-2xl relative overflow-hidden"
            >
              {/* Top Image Preview with Overlay */}
              <div className="relative h-48 w-full rounded-[1.8rem] overflow-hidden mb-6 bg-ink-soft">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-80" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-ink/80 backdrop-blur-md text-[10px] font-mono text-coral font-bold border border-white/10 uppercase tracking-wider">
                  {project.category}
                </span>
              </div>

              {/* Title & Subtitle */}
              <div>
                <div className="text-xs font-mono text-coral mb-1">{project.subtitle}</div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-coral-light transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs text-snow/80 mb-6 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Metrics & Footer */}
              <div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] font-mono text-snow/90 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-coral shrink-0" />
                  <span>{project.metrics}</span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/10">
                  {project.tags.map((tag, tIdx) => (
                    <span 
                      key={tIdx}
                      className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-mono text-snow/70"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
