/**
 * Schémas de la base de connaissances d'Aqua2.0.
 *
 * C'est le principal garde-fou de fiabilité : si une fiche est mal remplie
 * (source manquante, statut inconnu, date invalide…), le site REFUSE de se construire
 * et le message d'erreur indique le fichier fautif.
 *
 * Voir le document de cadrage, § 5 « Modèle de données ».
 */
import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** Date au format AAAA-MM-JJ (le YAML la transforme parfois en objet Date). */
const dateISO = z.coerce.date();

// ---------------------------------------------------------------------------
// SOURCES : une source = un fichier YAML dans src/content/sources/
// ---------------------------------------------------------------------------
const sources = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/sources' }),
  schema: z
    .object({
      type: z.enum([
        'livre',
        'article_scientifique',
        'article_expert',
        'base_de_donnees',
        'fabricant',
        'forum',
      ]),
      auteurs: z.array(z.string()).min(1),
      titre: z.string().min(3),
      annee: z.number().int().min(1800).max(2100).nullable(),
      editeur: z.string().nullable().default(null),
      isbn: z.string().nullable().default(null),
      doi: z.string().nullable().default(null),
      url: z.url().nullable().default(null),
      /** A = scientifique · B = ouvrage/expert reconnu · C = fabricant/commerce · D = forum/communauté */
      fiabilite: z.enum(['A', 'B', 'C', 'D']),
      licence: z.string().min(3),
      consulte_le: dateISO,
      /** Vrai tant que la référence elle-même (URL, date, édition) n'a pas été confirmée. */
      a_verifier: z.boolean().default(false),
      notes: z.string().default(''),
    })
    .refine((s) => s.isbn || s.doi || s.url || s.a_verifier, {
      message:
        'Une source doit avoir un ISBN, un DOI ou une URL — sinon, mettre a_verifier: true.',
    }),
});

// ---------------------------------------------------------------------------
// AFFIRMATIONS : la brique centrale — une idée vérifiable, reliée à ses sources
// ---------------------------------------------------------------------------
const affirmations = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/affirmations' }),
  schema: z
    .object({
      enonce: z.string().min(10),
      /** FAIT établi · PRATIQUE courante · OPINION de la communauté */
      statut: z.enum(['FAIT', 'PRATIQUE', 'OPINION']),
      sources: z
        .array(
          z.object({
            source: reference('sources'),
            /** Page, chapitre ou section : permet à quiconque de vérifier. */
            localisation: z.string().min(1),
          }),
        )
        .default([]),
      confiance: z.enum(['haute', 'moyenne', 'faible']),
      /** Détermine le bandeau d'alerte affiché avec l'affirmation. */
      risque_vivant: z.enum(['aucun', 'faible', 'eleve', 'critique']).default('aucun'),
      /** Nom ou pseudo du relecteur tiers ; null = pas encore relu. */
      relu_par: z.string().nullable().default(null),
      derniere_verification: dateISO,
      note: z.string().default(''),
    })
    .refine((a) => a.statut === 'OPINION' || a.sources.length > 0, {
      message: 'Un FAIT ou une PRATIQUE doit citer au moins une source.',
      path: ['sources'],
    }),
});

// ---------------------------------------------------------------------------
// GUIDES : fiches rédigées en Markdown, rattachées à une étape du parcours
// ---------------------------------------------------------------------------
const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    titre: z.string(),
    etape: z.enum(['conception', 'demarrage', 'maintenance', 'depannage']),
    resume: z.string().max(300),
    /** Les affirmations clés, affichées en tête de fiche avec leurs sources. */
    affirmations: z.array(reference('affirmations')).min(1),
    statut_relecture: z.enum(['brouillon', 'non_relu', 'relu']),
    derniere_verification: dateISO,
    ordre: z.number().default(100),
  }),
});

export const collections = { sources, affirmations, guides };
