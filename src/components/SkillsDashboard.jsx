import React, { useEffect, useRef, useState } from 'react'
import { resumeData } from '../data/resumeData'
import { Sparkles, Cpu, Code, Wrench, TrendingUp, CheckCircle } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SkillsDashboard() {
  const sectionRef = useRef(null)
  const [animatedPercentages, setAnimatedPercentages] = useState(
    resumeData.skills.map(() => 0)
  )

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 75%',
        onEnter: () => {
          resumeData.skills.forEach((skill, index) => {
            let obj = { val: 0 }
            gsap.to(obj, {
              val: skill.percentage,
              duration: 1.5,
              ease: 'power2.out',
              delay: index * 0.15,
              onUpdate: () => {
                setAnimatedPercentages((prev) => {
                  const updated = [...prev]
                  updated[index] = Math.round(obj.val)
                  return updated
                })
              }
            })
          })
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-coral" />
      case 'Cpu': return <Cpu className="w-5 h-5 text-coral" />
      case 'Code': return <Code className="w-5 h-5 text-coral" />
      case 'Wrench': return <Wrench className="w-5 h-5 text-coral" />
      case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-coral" />
      default: return <Sparkles className="w-5 h-5 text-coral" />
    }
  }

  return (
    <section 
      id="skills" 
      ref={sectionRef}
      className="py-24 px-6 md:px-12 bg-snow text-graphite relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header Tag */}
        <div className="flex items-center gap-3 mb-8">
          <span className="h-[2px] w-12 bg-coral" />
          <span className="font-mono text-xs uppercase tracking-widest text-coral font-bold">
            04. Le Tableau de Bord
          </span>
        </div>

        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-serif-italic text-4xl sm:text-5xl font-normal text-ink mb-4">
            Compétences & Vecteurs de Maîtrise
          </h2>
          <p className="text-sm font-mono text-graphite-muted">
            Combinaison de la rigueur mathématique et de l'exécution agilité Vibe Coding.
          </p>
        </div>

        {/* Radar & Cards Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Radar SVG Diagram (Left 5 Cols) */}
          <div className="lg:col-span-5 glass-card rounded-[3rem] p-8 shadow-architect border border-ink/5 flex flex-col items-center justify-center text-center">
            <h3 className="font-bold text-base text-ink mb-2">Polygon of Competencies</h3>
            <span className="text-xs font-mono text-coral mb-6">Radar 5 Axes Interactif</span>

            {/* SVG Polygon Radar */}
            <div className="relative w-64 h-64 my-2 flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                {/* Concentric Hexagons Grid */}
                {[0.25, 0.5, 0.75, 1].map((scale, i) => (
                  <polygon
                    key={i}
                    points="100,20 176,64 176,152 100,196 24,152 24,64"
                    fill="none"
                    stroke="#1C1C1E"
                    strokeOpacity={0.08}
                    strokeWidth="1"
                    transform={`scale(${scale})`}
                    transform-origin="100 100"
                  />
                ))}

                {/* Axes Lines */}
                <line x1="100" y1="100" x2="100" y2="20" stroke="#1C1C1E" strokeOpacity="0.1" />
                <line x1="100" y1="100" x2="176" y2="64" stroke="#1C1C1E" strokeOpacity="0.1" />
                <line x1="100" y1="100" x2="176" y2="152" stroke="#1C1C1E" strokeOpacity="0.1" />
                <line x1="100" y1="100" x2="24" y2="152" stroke="#1C1C1E" strokeOpacity="0.1" />
                <line x1="100" y1="100" x2="24" y2="64" stroke="#1C1C1E" strokeOpacity="0.1" />

                {/* Dynamic Filled Competency Polygon */}
                <polygon
                  points="100,24 172,66 172,148 100,188 28,68"
                  fill="rgba(232, 99, 74, 0.25)"
                  stroke="#E8634A"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  className="transition-all duration-1000"
                />

                {/* Vertex Dots */}
                <circle cx="100" cy="24" r="4" fill="#E8634A" />
                <circle cx="172" cy="66" r="4" fill="#E8634A" />
                <circle cx="172" cy="148" r="4" fill="#E8634A" />
                <circle cx="100" cy="188" r="4" fill="#E8634A" />
                <circle cx="28" cy="68" r="4" fill="#E8634A" />
              </svg>
            </div>

            <div className="flex items-center gap-2 mt-4 text-[11px] font-mono text-graphite-muted">
              <CheckCircle className="w-3.5 h-3.5 text-coral" />
              <span>Optimisé pour la Vitesse & l'Automation</span>
            </div>
          </div>

          {/* Mastery Grid Cards (Right 7 Cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {resumeData.skills.map((skill, index) => {
              const currentPct = animatedPercentages[index] || 0
              const radius = 28
              const circumference = 2 * Math.PI * radius
              const strokeOffset = circumference - (currentPct / 100) * circumference

              return (
                <div 
                  key={index}
                  className="glass-card rounded-[2rem] p-6 shadow-architect border border-ink/5 hover:border-coral/40 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="p-3 rounded-2xl bg-coral/10 group-hover:bg-coral group-hover:text-white transition-colors">
                      {getIcon(skill.icon)}
                    </div>
                    
                    {/* SVG Progress Ring */}
                    <div className="relative w-14 h-14 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="28"
                          cy="28"
                          r={radius}
                          stroke="#1C1C1E"
                          strokeOpacity="0.08"
                          strokeWidth="4"
                          fill="transparent"
                        />
                        <circle
                          cx="28"
                          cy="28"
                          r={radius}
                          stroke="#E8634A"
                          strokeWidth="4"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeOffset}
                          strokeLinecap="round"
                          fill="transparent"
                          className="transition-all duration-500"
                        />
                      </svg>
                      <span className="absolute font-mono font-bold text-xs text-ink">
                        {currentPct}%
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-coral uppercase tracking-wider block mb-1">
                      {skill.category}
                    </span>
                    <h4 className="font-extrabold text-base text-ink mb-2 group-hover:text-coral transition-colors">
                      {skill.name}
                    </h4>
                    <p className="text-xs text-graphite-muted leading-relaxed">
                      {skill.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

        </div>

      </div>
    </section>
  )
}
