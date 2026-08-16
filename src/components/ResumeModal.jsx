import React from 'react'
import { resumeData } from '../data/resumeData'
import { X, Download, Phone, Mail, MapPin } from 'lucide-react'
import confetti from 'canvas-confetti'
import { escapeHtml as esc } from '../../lib/escapeHtml'

export default function ResumeModal({ isOpen, onClose }) {
  if (!isOpen) return null

  const handleDownloadPDF = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    })

    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert("Veuillez autoriser les fenêtres surgissantes pour exporter votre CV PDF.")
      return
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <title>CV_Mouliom_Hassan_Ingenieur_VibeCodeur</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&family=IBM+Plex+Mono:wght@400;600&display=swap');
          body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            margin: 0;
            padding: 40px;
            color: #1C1C1E;
            background: #ffffff;
            line-height: 1.5;
          }
          .header {
            border-bottom: 3px solid #E8634A;
            padding-bottom: 20px;
            margin-bottom: 25px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .name {
            font-size: 28px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: -0.5px;
            color: #1C1C1E;
            margin: 0;
          }
          .title {
            font-size: 15px;
            color: #E8634A;
            font-weight: 600;
            margin-top: 4px;
          }
          .contact {
            font-family: 'IBM Plex Mono', monospace;
            font-size: 12px;
            color: #1C1C1E;
            text-align: right;
            font-weight: 600;
          }
          .section-title {
            font-size: 14px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #E8634A;
            border-bottom: 1px solid #1C1C1E15;
            padding-bottom: 4px;
            margin-top: 25px;
            margin-bottom: 15px;
          }
          .exp-item {
            margin-bottom: 16px;
          }
          .exp-header {
            display: flex;
            justify-content: space-between;
            font-weight: 700;
            font-size: 14px;
          }
          .company {
            color: #5A5A60;
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 6px;
          }
          .desc {
            font-size: 12px;
            color: #2D2D2D;
          }
          .skills-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            font-size: 12px;
          }
          .skill-badge {
            background: #FAFAFA;
            border: 1px solid #1C1C1E15;
            padding: 6px 12px;
            border-radius: 6px;
          }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="name">${esc(resumeData.personal.name)}</h1>
            <div class="title">${esc(resumeData.personal.title)}</div>
          </div>
          <div class="contact">
            <div>📍 ${esc(resumeData.personal.location)}</div>
            <div>✉️ ${esc(resumeData.personal.email)}</div>
            <div>📞 ${esc(resumeData.personal.phone)}</div>
          </div>
        </div>

        <div class="section-title">Profil & Manifeste</div>
        <div class="desc">${esc(resumeData.about.story[0])}</div>

        <div class="section-title">Expériences Professionnelles Phares</div>
        ${resumeData.experiences.map(exp => `
          <div class="exp-item">
            <div class="exp-header">
              <span>${esc(exp.role)}</span>
              <span style="font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: #E8634A;">${esc(exp.period)}</span>
            </div>
            <div class="company">${esc(exp.company)} — ${esc(exp.location)}</div>
            <div class="desc">${esc(exp.description)}</div>
          </div>
        `).join('')}

        <div class="section-title">Compétences Technologiques & Vibe Coding</div>
        <div class="skills-grid">
          ${resumeData.skills.map(s => `
            <div class="skill-badge">
              <strong>${esc(s.name)} (${esc(s.percentage)}%)</strong><br>
              <span style="font-size:10px; color:#5A5A60;">${esc(s.description)}</span>
            </div>
          `).join('')}
        </div>

        <div class="section-title">Formation & Diplômes</div>
        ${resumeData.education.map(e => `
          <div style="margin-bottom:10px; font-size:12px;">
            <strong>${esc(e.degree)}</strong> (${esc(e.year)}) — <em>${esc(e.institution)}</em>
          </div>
        `).join('')}
      </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()

    // L'impression est déclenchée depuis la fenêtre parente, pas par un
    // <script> inline dans le document généré : celui-ci hérite de la CSP
    // du site (script-src 'self') et serait bloqué.
    const print = () => {
      printWindow.focus()
      printWindow.print()
    }
    if (printWindow.document.readyState === 'complete') {
      print()
    } else {
      printWindow.addEventListener('load', print, { once: true })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-snow w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl border border-ink/10 flex flex-col overflow-hidden text-graphite relative">
        
        {/* Modal Header */}
        <div className="p-6 bg-ink text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-coral flex items-center justify-center font-mono font-bold text-white text-sm">
              MH
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                Synthèse CV — Mouliom Hassan
              </h3>
              <p className="text-xs font-mono text-coral">
                Coordonnées & Format Officiel Imprimable (PDF)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 rounded-full bg-coral hover:bg-coral-hover text-white text-xs font-mono font-bold flex items-center gap-2 shadow-md magnetic-btn"
            >
              <Download className="w-3.5 h-3.5" />
              Télécharger (PDF)
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body Preview */}
        <div className="p-6 md:p-10 overflow-y-auto space-y-8 text-sm">
          
          {/* Contact Details Display Box */}
          <div className="p-6 rounded-3xl bg-white border border-ink/5 shadow-sm flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-ink uppercase tracking-tight">
                {resumeData.personal.name}
              </h2>
              <p className="font-serif-italic text-lg text-coral font-medium">
                {resumeData.personal.title}
              </p>
            </div>

            <div className="font-mono text-xs text-ink font-semibold flex flex-col gap-1.5 md:text-right bg-coral/5 p-4 rounded-2xl border border-coral/20">
              <span className="flex items-center md:justify-end gap-2 text-coral">
                <MapPin className="w-3.5 h-3.5" /> {resumeData.personal.location}
              </span>
              <span className="flex items-center md:justify-end gap-2 text-ink">
                <Mail className="w-3.5 h-3.5 text-coral" /> {resumeData.personal.email}
              </span>
              <span className="flex items-center md:justify-end gap-2 text-ink">
                <Phone className="w-3.5 h-3.5 text-coral" /> {resumeData.personal.phone}
              </span>
            </div>
          </div>

          {/* About Summary */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-coral mb-2">
              • Manifeste & Parcours
            </h4>
            <p className="text-graphite/90 leading-relaxed bg-white p-4 rounded-2xl border border-ink/5">
              {resumeData.about.story[0]}
            </p>
          </div>

          {/* Experiences */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-coral mb-3">
              • Expériences Phares
            </h4>
            <div className="space-y-3">
              {resumeData.experiences.map((exp, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white border border-ink/5">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-ink">{exp.role}</span>
                    <span className="font-mono text-xs text-coral font-semibold">{exp.period}</span>
                  </div>
                  <div className="text-xs font-semibold text-graphite-muted mb-2">{exp.company}</div>
                  <p className="text-xs text-graphite/80">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Grid */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-coral mb-3">
              • Compétences Clés
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {resumeData.skills.map((s, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white border border-ink/5 flex items-center justify-between">
                  <span className="font-semibold text-xs text-ink">{s.name}</span>
                  <span className="font-mono text-xs font-bold text-coral bg-coral/10 px-2 py-0.5 rounded-md">
                    {s.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-snow-muted border-t border-ink/5 flex items-center justify-between text-xs font-mono text-graphite-muted">
          <span>Coordonnées sécurisées • Exportation PDF activée</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-graphite text-white font-bold hover:bg-ink"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  )
}
