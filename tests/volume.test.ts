import { describe, expect, it } from 'vitest';
import { calculerVolumeCuve, volumeSysteme, ErreurSaisie } from '../src/lib/calculs/volume';

describe('calculerVolumeCuve', () => {
  it("cube de 10 cm sans verre = 1 litre (définition du litre)", () => {
    const r = calculerVolumeCuve({ longueurCm: 10, largeurCm: 10, hauteurCm: 10, epaisseurVerreMm: 0 });
    expect(r.volumeInterieurL).toBeCloseTo(1, 10);
    expect(r.volumeEauL).toBeCloseTo(1, 10);
  });

  it('déduit 2 parois en longueur/largeur et 1 fond en hauteur', () => {
    // 100 × 50 × 50 cm, verre 10 mm → intérieur 98 × 48 × 49 cm
    const r = calculerVolumeCuve({ longueurCm: 100, largeurCm: 50, hauteurCm: 50, epaisseurVerreMm: 10 });
    expect(r.interieur).toEqual({ longueurCm: 98, largeurCm: 48, hauteurCm: 49 });
    expect(r.volumeInterieurL).toBeCloseTo((98 * 48 * 49) / 1000, 10); // 230,496 L
  });

  it("utilise la hauteur d'eau quand elle est fournie", () => {
    const r = calculerVolumeCuve({
      longueurCm: 100, largeurCm: 50, hauteurCm: 50, epaisseurVerreMm: 10, hauteurEauCm: 45,
    });
    expect(r.volumeEauL).toBeCloseTo((98 * 48 * 45) / 1000, 10); // 211,68 L
  });

  it("refuse une hauteur d'eau supérieure à la hauteur intérieure", () => {
    expect(() =>
      calculerVolumeCuve({ longueurCm: 100, largeurCm: 50, hauteurCm: 50, epaisseurVerreMm: 10, hauteurEauCm: 50 }),
    ).toThrow(ErreurSaisie);
  });

  it('refuse les dimensions nulles, négatives ou non numériques', () => {
    expect(() => calculerVolumeCuve({ longueurCm: 0, largeurCm: 50, hauteurCm: 50, epaisseurVerreMm: 10 })).toThrow(ErreurSaisie);
    expect(() => calculerVolumeCuve({ longueurCm: -1, largeurCm: 50, hauteurCm: 50, epaisseurVerreMm: 10 })).toThrow(ErreurSaisie);
    expect(() => calculerVolumeCuve({ longueurCm: NaN, largeurCm: 50, hauteurCm: 50, epaisseurVerreMm: 10 })).toThrow(ErreurSaisie);
  });

  it('refuse un verre plus épais que la cuve', () => {
    expect(() => calculerVolumeCuve({ longueurCm: 2, largeurCm: 50, hauteurCm: 50, epaisseurVerreMm: 10 })).toThrow(ErreurSaisie);
  });
});

describe('volumeSysteme', () => {
  it('additionne bac et décantation', () => {
    expect(volumeSysteme(200, 50)).toBe(250);
    expect(volumeSysteme(200)).toBe(200);
  });
  it('refuse une décantation négative', () => {
    expect(() => volumeSysteme(200, -5)).toThrow(ErreurSaisie);
  });
});
