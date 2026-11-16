/**
 * Construit un lien interne qui fonctionne en local ("/") comme sur
 * GitHub Pages (site servi depuis un sous-dossier, ex. "/aqua20/").
 */
export function lien(chemin: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const suite = chemin.replace(/^\//, '');
  return `${base}/${suite}`;
}

export const ETAPES = {
  conception: { titre: 'Conception', description: 'Volume, cuve, décantation, éclairage, brassage, budget…' },
  demarrage: { titre: 'Démarrage', description: 'Cyclage, pierres, bactéries, premiers occupants, calendrier.' },
  maintenance: { titre: 'Maintenance', description: 'Paramètres, dosages, changements d’eau, tâches.' },
  depannage: { titre: 'Dépannage', description: 'Algues, cyanos, dinos, coraux, maladies, pannes.' },
} as const;

export type Etape = keyof typeof ETAPES;
