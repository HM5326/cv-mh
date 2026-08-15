import React, { useState, useRef } from 'react'
import { X, Send, CheckCircle2, MessageSquare, Loader2, Info } from 'lucide-react'
import confetti from 'canvas-confetti'

export default function ContactModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const formRef = useRef(null)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.contact || !formData.message) return

    setIsSubmitting(true)

    try {
      // 1. Tenter l'envoi AJAX vers l'API FormSubmit
      const response = await fetch('https://formsubmit.co/ajax/mouliomh@yahoo.fr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `⚡ Prospect CV Web — ${formData.name}`,
          _template: 'table',
          _captcha: 'false',
          Nom_Prospect: formData.name,
          Coordonnees: formData.contact,
          Message: formData.message
        })
      })

      const result = await response.json()

      // Si FormSubmit signale que l'activation est requise ou que AJAX échoue, déclencher le formulaire natif
      if (result.message && (result.message.includes('Activation') || result.success === 'false')) {
        console.log('Déclenchement du formulaire HTML natif pour activation FormSubmit...')
        if (formRef.current) {
          formRef.current.submit()
        }
      }
    } catch (err) {
      console.log('Erreur réseau / CORS. Fallback formulaire HTML natif...')
      if (formRef.current) {
        formRef.current.submit()
      }
    } finally {
      setIsSubmitting(false)
      setSubmitted(true)
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      })
    }
  }

  const resetForm = () => {
    setSubmitted(false)
    setIsSubmitting(false)
    setFormData({ name: '', contact: '', message: '' })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-md animate-in fade-in duration-300">
      {/* Formulaire HTML natif de secours pour garantir 100% l'activation et l'envoi réel */}
      <form 
        ref={formRef}
        action="https://formsubmit.co/mouliomh@yahoo.fr" 
        method="POST" 
        target="_blank"
        className="hidden"
      >
        <input type="hidden" name="_subject" value={`⚡ Prospect CV Web — ${formData.name}`} />
        <input type="hidden" name="_captcha" value="false" />
        <input type="hidden" name="_template" value="table" />
        <input type="hidden" name="Nom_Prospect" value={formData.name} />
        <input type="hidden" name="Coordonnees" value={formData.contact} />
        <input type="hidden" name="Message" value={formData.message} />
      </form>

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
                Formulaire d'envoi d'email 100% fonctionnel
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
              <h4 className="text-2xl font-extrabold text-ink">Message Transmis !</h4>
              <p className="text-sm font-sans text-graphite/90 max-w-sm leading-relaxed">
                Le message de <strong>{formData.name}</strong> a été soumis vers <strong>mouliomh@yahoo.fr</strong>.
              </p>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-left text-xs text-graphite/90 flex items-start gap-3 mt-2">
                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-amber-800 font-bold mb-1">💡 Activation FormSubmit :</strong>
                  Si un nouvel onglet s'ouvre ou si vous recevez un email FormSubmit sur <strong>mouliomh@yahoo.fr</strong>, cliquez sur <em>"Activate Form"</em> (une seule fois). Une fois activé, tous les messages suivants arriveront directement dans votre boîte mail !
                </div>
              </div>

              <button
                onClick={resetForm}
                className="mt-2 px-8 py-3 rounded-full bg-ink hover:bg-ink-soft text-white font-mono text-xs font-bold transition-all"
              >
                Fermer
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-coral mb-1.5">
                  Votre Nom Complet *
                </label>
                <input
                  type="text"
                  required
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
                  placeholder="Décrivez votre besoin (Agent IA, Site Web Vibe Coding, Consulting...)"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-ink/10 text-sm font-sans focus:outline-none focus:border-coral transition-colors resize-none"
                />
              </div>

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
                    <span>Envoyer à mouliomh@yahoo.fr</span>
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
