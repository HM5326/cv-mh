// Échappement HTML partagé entre le client (export PDF) et la fonction
// serverless (corps de l'email). Une seule implémentation pour éviter que
// les deux divergent.
//
// À utiliser sur CHAQUE valeur interpolée dans une chaîne HTML construite
// à la main. React échappe déjà tout seul dans le JSX — inutile là-bas.

export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
