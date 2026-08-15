// Fonction serverless Vercel — envoi réel de l'email via l'API Resend.
// La clé API reste côté serveur : elle n'est jamais exposée au navigateur.
//
// Variables d'environnement requises (Vercel > Settings > Environment Variables) :
//   RESEND_API_KEY  — clé API Resend (commence par "re_")
//   CONTACT_TO      — adresse de réception des messages
//   CONTACT_FROM    — (optionnel) expéditeur vérifié, ex "CV Web <contact@mondomaine.com>"
//                     Par défaut : onboarding@resend.dev (voir README pour les limites)

const MAX = { name: 120, contact: 200, message: 5000 }

const escapeHtml = (str) =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

// Empêche l'injection d'en-têtes dans le sujet / le Reply-To
const sanitizeHeader = (str) => String(str).replace(/[\r\n]+/g, ' ').trim()

const isEmail = (str) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(str).trim())

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Méthode non autorisée.' })
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

  // Honeypot : rempli uniquement par les bots. On répond 200 pour ne pas les informer.
  if (body.website) return res.status(200).json({ ok: true })

  const name = String(body.name ?? '').trim()
  const contact = String(body.contact ?? '').trim()
  const message = String(body.message ?? '').trim()

  if (!name || !contact || !message) {
    return res.status(400).json({ error: 'Tous les champs sont obligatoires.' })
  }
  if (name.length > MAX.name || contact.length > MAX.contact || message.length > MAX.message) {
    return res.status(400).json({ error: 'Un des champs dépasse la longueur autorisée.' })
  }

  const subject = sanitizeHeader(`Prospect CV Web — ${name}`).slice(0, 180)

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
    </div>
  `

  const payload = {
    from,
    to: [to],
    subject,
    html,
    text: `Nom : ${name}\nCoordonnées : ${contact}\n\nMessage :\n${message}`
  }

  // Si le visiteur a laissé un email, on peut lui répondre directement depuis sa boîte.
  if (isEmail(contact)) payload.reply_to = sanitizeHeader(contact)

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
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
    console.error('Erreur réseau vers Resend', err)
    return res.status(502).json({
      error: "Impossible de joindre le service d'envoi. Réessaie dans un instant."
    })
  }
}
