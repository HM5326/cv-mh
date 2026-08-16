// Fonction serverless Vercel — envoi réel de l'email via l'API Resend.
// La clé API reste côté serveur : elle n'est jamais exposée au navigateur.
//
// Variables d'environnement — voir .env.example :
//   RESEND_API_KEY   — requis, clé API Resend ("re_…")
//   CONTACT_TO       — requis, adresse de réception
//   CONTACT_FROM     — optionnel, expéditeur vérifié
//   ALLOWED_ORIGINS  — optionnel, origines externes autorisées (virgules)

import { escapeHtml } from '../lib/escapeHtml.js'

const MAX = { name: 120, contact: 200, message: 5000 }

// Délai au-delà duquel on abandonne l'appel à Resend, pour ne pas
// bloquer la fonction jusqu'au timeout Vercel si l'API ne répond plus.
const RESEND_TIMEOUT_MS = 8000

// Empêche l'injection d'en-têtes dans le sujet / le Reply-To
const sanitizeHeader = (str) => String(str).replace(/[\r\n]+/g, ' ').trim()

const isEmail = (str) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(str).trim())

const clientIp = (req) =>
  String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'inconnue'

// L'endpoint n'est destiné qu'au formulaire du site lui-même.
// On compare l'Origin annoncée à l'hôte servi : ça couvre la production,
// tous les déploiements Preview et les domaines personnalisés, sans
// aucune configuration. ALLOWED_ORIGINS ne sert qu'aux appels externes.
function isOriginAllowed(req) {
  const origin = req.headers.origin
  // Absente sur les appels non-navigateur (curl, tests) : rien à vérifier ici,
  // le contrôle de Content-Type reste la barrière contre le CSRF navigateur.
  if (!origin) return true

  const host = req.headers.host
  if (host && (origin === `https://${host}` || origin === `http://${host}`)) return true

  return (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .includes(origin)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Méthode non autorisée.' })
  }

  // Exiger du JSON explicite. Un formulaire HTML cross-origin ne peut pas
  // produire ce Content-Type : c'est ce qui bloque le CSRF par <form>,
  // que CORS ne couvre pas (CORS ne régit que la lecture des réponses).
  if (!String(req.headers['content-type'] || '').includes('application/json')) {
    return res.status(415).json({ error: 'Type de contenu non supporté.' })
  }

  if (!isOriginAllowed(req)) {
    console.warn('Origine refusée', { origin: req.headers.origin, ip: clientIp(req) })
    return res.status(403).json({ error: 'Origine non autorisée.' })
  }

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO
  const from = process.env.CONTACT_FROM || 'CV Web <onboarding@resend.dev>'

  if (!apiKey || !to) {
    console.error('Config manquante : RESEND_API_KEY et/ou CONTACT_TO ne sont pas définis.')
    return res.status(500).json({
      error: "Le service d'envoi n'est pas configuré. Contactez-moi directement par email."
    })
  }

  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      return res.status(400).json({ error: 'Requête invalide.' })
    }
  }
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'Requête invalide.' })
  }

  // Honeypot : invisible pour les humains, rempli par les bots.
  // On répond 200 pour ne pas leur signaler la détection — mais on journalise,
  // sinon un faux positif (autofill trop zélé) supprimerait un vrai message
  // sans laisser la moindre trace.
  if (body.contact_ref) {
    console.warn('Honeypot déclenché — message non envoyé', {
      ip: clientIp(req),
      ua: req.headers['user-agent'],
      valeur: String(body.contact_ref).slice(0, 60)
    })
    return res.status(200).json({ ok: true })
  }

  const name = String(body.name ?? '').trim()
  const contact = String(body.contact ?? '').trim()
  const message = String(body.message ?? '').trim()

  if (!name || !contact || !message) {
    return res.status(400).json({ error: 'Tous les champs sont obligatoires.' })
  }
  if (name.length > MAX.name || contact.length > MAX.contact || message.length > MAX.message) {
    return res.status(400).json({ error: 'Un des champs dépasse la longueur autorisée.' })
  }

  // L'adresse du visiteur est déclarative : on ne peut pas vérifier qu'il la
  // possède. On la met en Reply-To pour le confort, mais on le signale
  // explicitement pour ne pas se faire piéger par une usurpation.
  const replyTo = isEmail(contact) ? sanitizeHeader(contact) : null

  const subject = sanitizeHeader(
    `${replyTo ? '[non vérifié] ' : ''}Prospect CV Web — ${name}`
  ).slice(0, 180)

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:600px;margin:0 auto;color:#1C1C1E">
      <h2 style="margin:0 0 4px;font-size:20px">Nouveau message depuis ton CV en ligne</h2>
      <p style="margin:0 0 24px;color:#6b7280;font-size:13px">Reçu via le formulaire « Me contacter »</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr>
          <td style="padding:10px 12px;background:#f5f5f5;font-weight:600;width:150px;vertical-align:top">Nom</td>
          <td style="padding:10px 12px;background:#fafafa">${escapeHtml(name)}</td>
        </tr>
        <tr>
          <td style="padding:10px 12px;background:#f5f5f5;font-weight:600;vertical-align:top">Coordonnées</td>
          <td style="padding:10px 12px;background:#fafafa">${escapeHtml(contact)}</td>
        </tr>
        <tr>
          <td style="padding:10px 12px;background:#f5f5f5;font-weight:600;vertical-align:top">Message</td>
          <td style="padding:10px 12px;background:#fafafa;white-space:pre-wrap">${escapeHtml(message)}</td>
        </tr>
      </table>
      ${
        replyTo
          ? `<p style="margin:16px 0 0;padding:10px 12px;background:#fdf6e3;border-left:3px solid #d9a441;font-size:12px;color:#6b5320">
               Adresse déclarée par l'envoyeur, <strong>non vérifiée</strong>.
               Un « Répondre » partira vers ${escapeHtml(replyTo)}. Vérifie l'identité
               avant tout échange sensible.
             </p>`
          : ''
      }
    </div>
  `

  const payload = {
    from,
    to: [to],
    subject,
    html,
    text: `Nom : ${name}\nCoordonnées : ${contact}\n\nMessage :\n${message}`
  }

  if (replyTo) payload.reply_to = replyTo

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(RESEND_TIMEOUT_MS)
    })

    if (!resendRes.ok) {
      const detail = await resendRes.text()
      console.error('Échec Resend', resendRes.status, detail)
      return res.status(502).json({
        error: "L'envoi a échoué côté serveur. Réessaie ou contacte-moi directement par email."
      })
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    // Couvre aussi l'AbortError levé par AbortSignal.timeout.
    console.error('Erreur réseau vers Resend', err)
    return res.status(502).json({
      error: "Impossible de joindre le service d'envoi. Réessaie dans un instant."
    })
  }
}
