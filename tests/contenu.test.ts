/**
 * Contrôles d'intégrité de la base de connaissances, en plus des schémas Astro :
 * chaque renvoi (affirmation → source, fiche → affirmation) doit pointer vers
 * un fichier qui existe vraiment.
 */
import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join, basename } from 'node:path';
import { parse } from 'yaml';

const racine = join(import.meta.dirname, '..', 'src', 'content');

function lireDossier(dossier: string, extension: string) {
  return readdirSync(join(racine, dossier))
    .filter((f) => f.endsWith(extension))
    .map((f) => ({ id: basename(f, extension), texte: readFileSync(join(racine, dossier, f), 'utf8') }));
}

const sources = lireDossier('sources', '.yaml').map((f) => ({ ...f, data: parse(f.texte) }));
const affirmations = lireDossier('affirmations', '.yaml').map((f) => ({ ...f, data: parse(f.texte) }));
const guides = lireDossier('guides', '.md').map((f) => {
  const entete = f.texte.match(/^---\n([\s\S]*?)\n---/);
  return { ...f, data: entete ? parse(entete[1]) : {} };
});

const parametres = lireDossier('parametres', '.yaml').map((f) => ({ ...f, data: parse(f.texte) }));

const idsSources = new Set(sources.map((s) => s.id));
const idsAffirmations = new Set(affirmations.map((a) => a.id));

describe('intégrité de la base de connaissances', () => {
  it('les identifiants de fichiers sont en minuscules, sans accents ni espaces', () => {
    for (const { id } of [...sources, ...affirmations, ...guides]) {
      expect(id, `nom de fichier invalide : ${id}`).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it('chaque affirmation cite des sources qui existent', () => {
    for (const a of affirmations) {
      for (const s of a.data.sources ?? []) {
        expect(idsSources.has(s.source), `${a.id} cite une source inconnue : ${s.source}`).toBe(true);
      }
    }
  });

  it("un FAIT ne s'appuie jamais uniquement sur des forums (niveau D)", () => {
    const fiabilite = new Map(sources.map((s) => [s.id, s.data.fiabilite]));
    for (const a of affirmations.filter((x) => x.data.statut === 'FAIT')) {
      const niveaux = (a.data.sources ?? []).map((s: { source: string }) => fiabilite.get(s.source));
      expect(niveaux.some((n: string) => n !== 'D'), `${a.id} : FAIT appuyé seulement sur des forums`).toBe(true);
    }
  });

  it('chaque valeur chiffrée d’un paramètre renvoie vers une affirmation existante', () => {
    for (const p of parametres) {
      const renvois = [
        p.data.naturel?.affirmation,
        p.data.cible?.affirmation,
        p.data.acceptable?.affirmation,
        p.data.variation_max_jour?.affirmation,
        ...(p.data.affirmations ?? []),
      ].filter(Boolean);
      for (const id of renvois) {
        expect(idsAffirmations.has(id), `${p.id} renvoie vers une affirmation inconnue : ${id}`).toBe(true);
      }
    }
  });

  it('la plage cible est incluse dans la plage acceptable', () => {
    for (const p of parametres.filter((x) => x.data.acceptable)) {
      expect(p.data.acceptable.min, `${p.id} : min acceptable`).toBeLessThanOrEqual(p.data.cible.min);
      expect(p.data.acceptable.max, `${p.id} : max acceptable`).toBeGreaterThanOrEqual(p.data.cible.max);
    }
  });

  it('chaque borne chiffrée apparaît dans le texte de son affirmation (anti-faute de frappe)', () => {
    const textes = new Map(affirmations.map((a) => [a.id, a.data.enonce as string]));
    const enFr = (n: number) => n.toLocaleString('fr-FR').replace(/ /g, ' ');
    for (const p of parametres) {
      for (const cle of ['cible', 'acceptable'] as const) {
        const plage = p.data[cle];
        if (!plage) continue;
        const texte = (textes.get(plage.affirmation) ?? '').replace(/ /g, ' ');
        for (const borne of [plage.min, plage.max]) {
          expect(texte.includes(enFr(borne)), `${p.id}.${cle} : ${enFr(borne)} absent de « ${plage.affirmation} »`).toBe(true);
        }
      }
    }
  });

  it('chaque fiche renvoie vers des affirmations qui existent', () => {
    for (const g of guides) {
      for (const id of g.data.affirmations ?? []) {
        expect(idsAffirmations.has(id), `${g.id} renvoie vers une affirmation inconnue : ${id}`).toBe(true);
      }
    }
  });
});
