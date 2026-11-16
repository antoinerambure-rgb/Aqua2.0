# Aqua2.0

Outil d'aide à la décision pour l'aquariophilie marine récifale : guides sourcés,
fiches espèces, calculateurs et journal d'aquarium. Site statique, installable sur mobile (PWA).

Le cadrage complet (cahier des charges, modèle de données, feuille de route) est dans le
projet Claude « Aquariophilie Marine ».

## Où se trouve quoi

| Dossier | Contenu |
|---|---|
| `src/content/sources/` | Une source (livre, article, site…) par fichier YAML, avec son niveau de fiabilité A à D |
| `src/content/affirmations/` | Les informations vérifiables : FAIT, PRATIQUE ou OPINION, reliées à leurs sources |
| `src/content/guides/` | Les fiches rédigées (Markdown), rattachées à une étape |
| `src/content.config.ts` | Les **règles** que doit respecter le contenu (schémas) |
| `src/lib/calculs/` | Les formules des calculateurs |
| `tests/` | Les tests automatiques (formules et intégrité du contenu) |
| `src/pages/` | Les pages du site |

## Les garde-fous

Le site **refuse de se construire** si :
- un FAIT ou une PRATIQUE ne cite aucune source ;
- une affirmation cite une source qui n'existe pas ;
- une fiche renvoie vers une affirmation qui n'existe pas ;
- un FAIT ne s'appuie que sur des forums (niveau D) ;
- un champ obligatoire est absent ou mal rempli.

Le message d'erreur indique le fichier et le champ en cause.

## Ajouter du contenu

1. **Une source** : copier un fichier de `src/content/sources/`, le renommer (minuscules, tirets,
   sans accents, ex. `auteur-annee.yaml`) et remplir les champs.
2. **Une affirmation** : même principe dans `src/content/affirmations/`. Le champ `source`
   reprend le nom du fichier source, sans `.yaml`.
3. **Une fiche** : un fichier `.md` dans `src/content/guides/`, avec l'en-tête entre `---`.

## Commandes (sur ordinateur, facultatif)

Nécessite Node.js 22 ou plus récent.

```sh
npm install        # une seule fois
npm run dev        # site local sur http://localhost:4321
npm test           # tests
npm run verifier   # tests + types + construction : tout ce que vérifie la mise en ligne
```

## Mise en ligne

Chaque modification de la branche `main` déclenche `.github/workflows/deploy.yml` :
vérifications, puis publication sur GitHub Pages. Si une vérification échoue,
la version en ligne reste inchangée.

## Licence

À décider avant l'ouverture publique (jalon J8). Attention : certaines données
(ex. FishBase, CC BY-NC) interdisent tout usage commercial.
