// Harnais de test — aucun email réel, limiteurs injectés.
process.env.RESEND_API_KEY = 're_fake'
process.env.CONTACT_TO = 'dest@test.local'

let sent = []
globalThis.fetch = async (url, opts) => {
  sent.push(JSON.parse(opts.body))
  return { ok: true, status: 200, text: async () => '' }
}

const handler = (await import('../api/contact.js')).default
const { checkRateLimit } = await import('../lib/rateLimit.js')

// Faux limiteur respectant le contrat de @upstash/ratelimit : .limit(key)
// renvoie { success, reset }. Fenêtre fixe, suffisant pour le test.
const fakeLimiter = (max, windowMs = 600_000) => {
  const hits = new Map()
  return {
    async limit(key) {
      const now = Date.now()
      const e = hits.get(key)
      if (!e || now > e.reset) {
        hits.set(key, { n: 1, reset: now + windowMs })
        return { success: true, reset: now + windowMs }
      }
      e.n += 1
      return { success: e.n <= max, reset: e.reset }
    }
  }
}
const limiters = () => ({ perIp: fakeLimiter(3), global: fakeLimiter(40, 3_600_000) })

const mockRes = () => {
  const r = { statusCode: null, body: null, headers: {} }
  r.setHeader = (k, v) => { r.headers[k] = v }
  r.status = (c) => { r.statusCode = c; return r }
  r.json = (b) => { r.body = b; return r }
  return r
}

const JSON_CT = { 'content-type': 'application/json' }
const VALID = { name: 'Jean Dupont', contact: 'jean@exemple.fr', message: 'Bonjour' }
const reqFor = (extra = {}, body = VALID) => ({
  method: 'POST',
  headers: { ...JSON_CT, host: 'cv.test', 'x-forwarded-for': '203.0.113.7', ...extra },
  body
})

let ok = 0, ko = 0
const check = (label, cond, detail = '') => {
  cond ? ok++ : ko++
  console.log(`${cond ? 'OK   ' : 'ECHEC'} ${label}${detail ? '  ' + detail : ''}`)
}

// ── Garde-fous du commit précédent (non régressés) ──────────────────
console.log('--- Garde-fous existants ---')
{
  const L = limiters()
  for (const [label, req, expected] of [
    ['GET refusé', { method: 'GET', headers: {} }, 405],
    ['CSRF <form> urlencoded refusé', reqFor({ 'content-type': 'application/x-www-form-urlencoded' }), 415],
    ['CSRF <form> multipart refusé', reqFor({ 'content-type': 'multipart/form-data' }), 415],
    ['Origine tierce refusée', reqFor({ origin: 'https://evil.example' }), 403],
    ['Origine du site acceptée', reqFor({ origin: 'https://cv.test' }), 200],
    ['localhost (vercel dev) accepté', reqFor({ host: 'localhost:3000', origin: 'http://localhost:3000' }), 200],
    ['Champ manquant refusé', reqFor({}, { name: 'x', contact: 'y', message: '' }), 400],
  ]) {
    const res = mockRes()
    await handler(req, res, L)
    check(label, res.statusCode === expected, `→ ${res.statusCode}`)
  }
}

// ── Honeypot ────────────────────────────────────────────────────────
console.log('\n--- Honeypot ---')
{
  sent = []
  const res = mockRes()
  await handler(reqFor({}, { ...VALID, contact_ref: 'https://spam.ru' }), res, limiters())
  check('200 renvoyé au bot', res.statusCode === 200)
  check('aucun email envoyé', sent.length === 0, `${sent.length} email(s)`)
}

// ── Rate limit par IP ───────────────────────────────────────────────
console.log('\n--- Limitation par IP (3 / 10 min) ---')
{
  const L = limiters()
  sent = []
  const statuses = []
  let retryAfter = null
  for (let i = 0; i < 5; i++) {
    const res = mockRes()
    await handler(reqFor(), res, L)
    statuses.push(res.statusCode)
    if (res.statusCode === 429 && !retryAfter) retryAfter = res.headers['Retry-After']
  }
  check('les 3 premières passent', statuses.slice(0, 3).every((s) => s === 200), `[${statuses.join(', ')}]`)
  check('la 4e et la 5e sont bloquées', statuses[3] === 429 && statuses[4] === 429)
  check('en-tête Retry-After présent', Boolean(retryAfter), `${retryAfter}s`)
  check('aucun email au-delà de la limite', sent.length === 3, `${sent.length} emails`)

  const other = mockRes()
  await handler(reqFor({ 'x-forwarded-for': '198.51.100.2' }), other, L)
  check('une autre IP reste acceptée', other.statusCode === 200, `→ ${other.statusCode}`)
}

// ── Plafond global ──────────────────────────────────────────────────
console.log('\n--- Plafond global (attaque distribuée) ---')
{
  const L = { perIp: fakeLimiter(3), global: fakeLimiter(40, 3_600_000) }
  sent = []
  const statuses = []
  for (let i = 0; i < 45; i++) {
    const res = mockRes()
    await handler(reqFor({ 'x-forwarded-for': `10.0.0.${i}` }), res, L)
    statuses.push(res.statusCode)
  }
  const blocked = statuses.filter((s) => s === 429).length
  check('les 40 premières passent', statuses.slice(0, 40).every((s) => s === 200))
  check('les suivantes sont bloquées malgré des IP différentes', blocked === 5, `${blocked} bloquées`)
  check('le quota Resend est protégé', sent.length === 40, `${sent.length} emails`)

  const last = mockRes()
  await handler(reqFor({ 'x-forwarded-for': '10.0.0.99' }), last, L)
  check('message d’erreur spécifique au plafond global', /trop de messages en ce moment/.test(last.body.error))
}

// ── Contenu de l'email ──────────────────────────────────────────────
console.log('\n--- Contenu et échappement ---')
{
  sent = []
  await handler(reqFor(), mockRes(), limiters())
  const m = sent.at(-1)
  check('sujet préfixé [non vérifié]', m.subject.startsWith('[non vérifié]'), m.subject)
  check('reply_to renseigné', m.reply_to === 'jean@exemple.fr')
  check('avertissement présent dans le corps', m.html.includes('non vérifiée'))

  sent = []
  await handler(reqFor({}, {
    name: '<img src=x onerror=alert(1)>',
    contact: 'a@b.co',
    message: '</td><script>alert(2)</script>'
  }), mockRes(), limiters())
  const evil = sent.at(-1)
  check('échappement HTML du contenu visiteur',
    !evil.html.includes('<script>') && !evil.html.includes('<img src=x'))

  sent = []
  await handler(reqFor({}, { name: 'X\r\nBcc: victime@ailleurs.com', contact: 'a@b.co', message: 'm' }),
    mockRes(), limiters())
  check('sujet sans CRLF (anti-injection d’en-tête)', !/[\r\n]/.test(sent.at(-1).subject))
}

// ── Dégradation sans Redis ──────────────────────────────────────────
console.log('\n--- Dégradation sans Redis ---')
{
  const r = await checkRateLimit('1.2.3.4')
  check('laisse passer et journalise', r.allowed === true && r.scope === null)

  const boom = { async limit() { throw new Error('Redis injoignable') } }
  const r2 = await checkRateLimit('1.2.3.4', { perIp: boom, global: boom })
  check('panne Redis : laisse passer sans casser le formulaire', r2.allowed === true)
}

console.log(`\n=== ${ok} réussis, ${ko} échoués ===`)
process.exit(ko ? 1 : 0)
