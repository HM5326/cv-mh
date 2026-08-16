import React, { useState } from 'react'
import { X, Send, CheckCircle2, MessageSquare, Loader2, AlertTriangle, Mail } from 'lucide-react'
import confetti from 'canvas-confetti'
import { resumeData } from '../data/resumeData'

const { email: fallbackEmail } = resumeData.personal

export default function ContactModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    message: '',
    // Honeypot anti-bot : invisible, doit rester vide. Nom volontairement
    // opaque — un champ nommé "website" se fait remplir par les autofills,
    // ce qui ferait silencieusement jeter un message légitime.
    contact_ref: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.contact || !formData.message) return

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      // On ne fait confiance qu'au statut HTTP renvoyé par notre propre serveur.
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        setError(data.error || "L'envoi a échoué. Réessaie ou écris-moi directement.")
        return
      }

      setSubmitted(true)
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } })
    } catch {
      setError(
        'Connexion impossible. Vérifie ta connexion internet, puis réessaie.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setSubmitted(false)
    setIsSubmitting(false)
    setError(null)
    setFormData({ name: '', contact: '', message: '', contact_ref: '' })
    onClose()
  }

  const mailtoHref = `mailto:${fallbackEmail}?subject=${encodeURIComponent(
    `Contact CV Web — ${formData.name || ''}`.trim()
  )}&body=${encodeURIComponent(
    `Nom : ${formData.name}\nCoordonnées : ${formData.contact}\n\n${formData.message}`
  )}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-snow w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-ink/10 flex flex-col overflow-hidden text-graphite relative">

        {/* Modal Header */}
        <div className="p-6 bg-ink text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-coral flex items-center justify-center font-bold text-white">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">
                Me Contacter
              </h3>
              <p className="text-xs font-mono text-coral">
                Réponse sous 24h ouvrées
              </p>
            </div>
          </div>

          <button
            onClick={resetForm}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8">
          {submitted ? (
            <div className="py-6 flex flex-col items-center justify-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center border-2 border-green-500 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-extrabold text-ink">Message Envoyé !</h4>
              <p className="text-sm font-sans text-graphite/90 max-w-sm leading-relaxed">
                Merci <strong>{formData.name}</strong>, ton message est bien arrivé dans ma
                boîte mail. Je te réponds sur <strong>{formData.contact}</strong> dès que possible.
              </p>

              <button
                onClick={resetForm}
                className="mt-2 px-8 py-3 rounded-full bg-ink hover:bg-ink-soft text-white font-mono text-xs font-bold transition-all"
              >
                Fermer
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div
                  role="alert"
                  className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-left text-xs text-graphite/90 flex items-start gap-3"
                >
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-red-700 font-bold mb-1">Envoi impossible</strong>
                    {error}
                    <a
                      href={mailtoHref}
                      className="mt-2 inline-flex items-center gap-1.5 font-mono font-bold text-red-700 underline underline-offset-2"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      M'écrire directement à {fallbackEmail}
                    </a>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-coral mb-1.5">
                  Votre Nom Complet *
                </label>
                <input
                  type="text"
                  required
                  maxLength={120}
                  placeholder="ex: Jean Dupont"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-ink/10 text-sm font-sans focus:outline-none focus:border-coral transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-coral mb-1.5">
                  Vos Coordonnées (Email ou Téléphone) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={200}
                  placeholder="ex: client@entreprise.cm ou +237 6xx xx xx xx"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-ink/10 text-sm font-sans focus:outline-none focus:border-coral transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-coral mb-1.5">
                  Message ou Mission Sollicitée *
                </label>
                <textarea
                  required
                  rows={4}
                  maxLength={5000}
                  placeholder="Décrivez votre besoin (Agent IA, Site Web Vibe Coding, Consulting...)"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-ink/10 text-sm font-sans focus:outline-none focus:border-coral transition-colors resize-none"
                />
              </div>

              {/* Honeypot : masqué aux humains, appâte les bots. Ne pas retirer. */}
              <input
                type="text"
                name="contact_ref"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={formData.contact_ref}
                onChange={(e) => setFormData({ ...formData, contact_ref: e.target.value })}
                className="absolute left-[-9999px] w-px h-px opacity-0"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 mt-2 rounded-full bg-coral hover:bg-coral-hover disabled:opacity-50 text-white font-mono font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-coral/30 magnetic-btn"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Envoi de l'email en cours...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Envoyer le message</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  )
}
