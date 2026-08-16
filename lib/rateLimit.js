// Limitation de débit pour /api/contact, adossée à Upstash Redis.
//
// Pourquoi Redis et pas un compteur en mémoire : chaque instance serverless
// a sa propre mémoire et la perd à chaque démarrage à froid. Un compteur
// local ne limite donc rien de réel — c'est de la sécurité de façade.
//
// Deux barrières complémentaires :
//   - par IP     : arrête l'abus depuis une source unique ;
//   - globale    : plafonne la consommation totale du quota Resend même si
//                  l'attaque est distribuée sur de nombreuses adresses.
//
// Variables lues (l'un ou l'autre nommage selon la façon dont la base a
// été rattachée au projet Vercel) :
//   UPSTASH_REDIS_REST_URL   / KV_REST_API_URL
//   UPSTASH_REDIS_REST_TOKEN / KV_REST_API_TOKEN

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN

export const isConfigured = Boolean(url && token)

const redis = isConfigured ? new Redis({ url, token }) : null

// 3 messages / 10 min pour une même IP. Large pour un visiteur réel qui
// se reprend à deux fois, serré pour un script.
const perIp = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, '10 m'),
      prefix: 'contact:ip',
      analytics: false
    })
  : null

// 40 messages / h tous visiteurs confondus. Ne gênera jamais un usage
// normal, mais empêche une attaque distribuée de vider le quota Resend
// (100/jour en offre gratuite) en quelques minutes.
const global = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(40, '1 h'),
      prefix: 'contact:global',
      analytics: false
    })
  : null

/**
 * @param {string} ip
 * @param {{perIp: any, global: any}} [limiters] Point d'injection pour les
 *        tests. En production, laisser vide : les limiteurs Upstash ci-dessus
 *        sont utilisés.
 * @returns {Promise<{allowed: boolean, retryAfter: number, scope: string|null}>}
 */
export async function checkRateLimit(ip, limiters = null) {
  const perIpLimiter = limiters?.perIp ?? perIp
  const globalLimiter = limiters?.global ?? global
  const configured = limiters ? true : isConfigured

  // Choix délibéré : en l'absence de configuration Redis, on laisse passer
  // plutôt que de bloquer. Un formulaire de contact hors service est une
  // perte commerciale certaine ; l'absence de limite est un risque
  // seulement potentiel. Le log doit rester visible dans les logs Vercel.
  // Pour inverser ce choix, renvoyer ici { allowed: false, ... }.
  if (!configured) {
    console.error(
      'RATE LIMIT INACTIF — UPSTASH_REDIS_REST_URL / _TOKEN absents. ' +
        "L'endpoint /api/contact accepte les requêtes sans limite."
    )
    return { allowed: true, retryAfter: 0, scope: null }
  }

  try {
    const [ipRes, globalRes] = await Promise.all([
      perIpLimiter.limit(ip),
      globalLimiter.limit('all')
    ])

    if (!ipRes.success) {
      return { allowed: false, retryAfter: secondsUntil(ipRes.reset), scope: 'ip' }
    }
    if (!globalRes.success) {
      return { allowed: false, retryAfter: secondsUntil(globalRes.reset), scope: 'global' }
    }
    return { allowed: true, retryAfter: 0, scope: null }
  } catch (err) {
    // Redis injoignable : même arbitrage que ci-dessus, on ne casse pas le
    // formulaire pour une panne de l'infrastructure de comptage.
    console.error('Rate limit indisponible, requête laissée passer', err)
    return { allowed: true, retryAfter: 0, scope: null }
  }
}

function secondsUntil(resetTimestampMs) {
  return Math.max(1, Math.ceil((resetTimestampMs - Date.now()) / 1000))
}
