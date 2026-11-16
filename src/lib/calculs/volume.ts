/**
 * Calculs de volume d'une cuve parallélépipédique en verre.
 *
 * Géométrie pure : aucune hypothèse aquariophile ici.
 * Le « volume net » (déduction des pierres, du sable, du matériel) n'est
 * PAS calculé : il demande des hypothèses sourcées, prévues au jalon J2.
 *
 * Conventions :
 *  - dimensions EXTÉRIEURES en centimètres ;
 *  - épaisseur de verre en millimètres (parois et fond de même épaisseur) ;
 *  - 1 litre = 1 000 cm³.
 */

export interface DimensionsCuve {
  longueurCm: number;
  largeurCm: number;
  hauteurCm: number;
  epaisseurVerreMm: number;
  /** Hauteur d'eau mesurée depuis le fond intérieur. Par défaut : cuve pleine. */
  hauteurEauCm?: number;
}

export interface ResultatVolume {
  /** Dimensions intérieures, en cm. */
  interieur: { longueurCm: number; largeurCm: number; hauteurCm: number };
  /** Volume intérieur total de la cuve (pleine à ras bord), en litres. */
  volumeInterieurL: number;
  /** Volume d'eau pour la hauteur d'eau indiquée, en litres. */
  volumeEauL: number;
}

export class ErreurSaisie extends Error {}

function verifierPositif(nom: string, valeur: number): void {
  if (!Number.isFinite(valeur) || valeur <= 0) {
    throw new ErreurSaisie(`${nom} doit être un nombre strictement positif.`);
  }
}

export function calculerVolumeCuve(d: DimensionsCuve): ResultatVolume {
  verifierPositif('La longueur', d.longueurCm);
  verifierPositif('La largeur', d.largeurCm);
  verifierPositif('La hauteur', d.hauteurCm);
  if (!Number.isFinite(d.epaisseurVerreMm) || d.epaisseurVerreMm < 0) {
    throw new ErreurSaisie("L'épaisseur du verre doit être positive ou nulle.");
  }

  const e = d.epaisseurVerreMm / 10; // mm → cm
  const interieur = {
    longueurCm: d.longueurCm - 2 * e,
    largeurCm: d.largeurCm - 2 * e,
    hauteurCm: d.hauteurCm - e, // un seul fond, pas de couvercle en verre
  };
  if (interieur.longueurCm <= 0 || interieur.largeurCm <= 0 || interieur.hauteurCm <= 0) {
    throw new ErreurSaisie("L'épaisseur du verre est trop grande pour ces dimensions.");
  }

  const hauteurEau = d.hauteurEauCm ?? interieur.hauteurCm;
  verifierPositif("La hauteur d'eau", hauteurEau);
  if (hauteurEau > interieur.hauteurCm) {
    throw new ErreurSaisie(
      `La hauteur d'eau (${hauteurEau} cm) dépasse la hauteur intérieure (${arrondir(interieur.hauteurCm, 1)} cm).`,
    );
  }

  const surfaceCm2 = interieur.longueurCm * interieur.largeurCm;
  return {
    interieur,
    volumeInterieurL: (surfaceCm2 * interieur.hauteurCm) / 1000,
    volumeEauL: (surfaceCm2 * hauteurEau) / 1000,
  };
}

/** Volume total d'eau du système = eau du bac + eau de la décantation. */
export function volumeSysteme(volumeBacL: number, volumeDecantationL = 0): number {
  if (!Number.isFinite(volumeDecantationL) || volumeDecantationL < 0) {
    throw new ErreurSaisie('Le volume de décantation doit être positif ou nul.');
  }
  return volumeBacL + volumeDecantationL;
}

export function arrondir(valeur: number, decimales = 0): number {
  const f = 10 ** decimales;
  return Math.round(valeur * f) / f;
}
