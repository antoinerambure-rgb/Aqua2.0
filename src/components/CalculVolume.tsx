/** Calculateur de volume : composant interactif (Preact). */
import { useState } from 'preact/hooks';
import { calculerVolumeCuve, volumeSysteme, arrondir, ErreurSaisie } from '../lib/calculs/volume';

type Champ = 'longueur' | 'largeur' | 'hauteur' | 'verre' | 'eau' | 'decantation';

const CHAMPS: { id: Champ; libelle: string; unite: string; aide?: string }[] = [
  { id: 'longueur', libelle: 'Longueur extérieure', unite: 'cm' },
  { id: 'largeur', libelle: 'Largeur (profondeur) extérieure', unite: 'cm' },
  { id: 'hauteur', libelle: 'Hauteur extérieure', unite: 'cm' },
  { id: 'verre', libelle: 'Épaisseur du verre', unite: 'mm' },
  { id: 'eau', libelle: "Hauteur d'eau (facultatif)", unite: 'cm', aide: 'Depuis le fond intérieur. Vide = cuve pleine.' },
  { id: 'decantation', libelle: "Eau dans la décantation (facultatif)", unite: 'L' },
];

const nombre = (v: string) => Number(v.replace(',', '.'));
/** Affichage à la française : virgule décimale, espace pour les milliers. */
const fr = (v: number, decimales = 1) => arrondir(v, decimales).toLocaleString('fr-FR');

export default function CalculVolume() {
  const [valeurs, setValeurs] = useState<Record<Champ, string>>({
    longueur: '100', largeur: '50', hauteur: '50', verre: '10', eau: '', decantation: '',
  });

  let resultat: ReturnType<typeof calculerVolumeCuve> | null = null;
  let total: number | null = null;
  let erreur: string | null = null;
  try {
    resultat = calculerVolumeCuve({
      longueurCm: nombre(valeurs.longueur),
      largeurCm: nombre(valeurs.largeur),
      hauteurCm: nombre(valeurs.hauteur),
      epaisseurVerreMm: nombre(valeurs.verre),
      hauteurEauCm: valeurs.eau.trim() === '' ? undefined : nombre(valeurs.eau),
    });
    total = volumeSysteme(resultat.volumeEauL, valeurs.decantation.trim() === '' ? 0 : nombre(valeurs.decantation));
  } catch (e) {
    erreur = e instanceof ErreurSaisie ? e.message : 'Saisie invalide.';
  }

  return (
    <div class="calcul">
      <form onSubmit={(e) => e.preventDefault()}>
        {CHAMPS.map((c) => (
          <label key={c.id}>
            <span>{c.libelle} ({c.unite})</span>
            <input
              type="text"
              inputMode="decimal"
              value={valeurs[c.id]}
              onInput={(e) => setValeurs({ ...valeurs, [c.id]: (e.target as HTMLInputElement).value })}
            />
            {c.aide && <small>{c.aide}</small>}
          </label>
        ))}
      </form>

      <div class="resultat" aria-live="polite">
        {erreur && <p class="erreur">{erreur}</p>}
        {resultat && total !== null && (
          <dl>
            <dt>Dimensions intérieures</dt>
            <dd>
              {fr(resultat.interieur.longueurCm)} × {fr(resultat.interieur.largeurCm)} ×{' '}
              {fr(resultat.interieur.hauteurCm)} cm
            </dd>
            <dt>Volume intérieur de la cuve</dt>
            <dd>{fr(resultat.volumeInterieurL)} L</dd>
            <dt>Volume d'eau dans la cuve</dt>
            <dd>{fr(resultat.volumeEauL)} L</dd>
            <dt>Volume d'eau du système (cuve + décantation)</dt>
            <dd class="total">{fr(total)} L</dd>
          </dl>
        )}
      </div>
    </div>
  );
}
