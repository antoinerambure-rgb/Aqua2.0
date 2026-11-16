import { describe, expect, it } from 'vitest';
import {
  meqLVersDkh, dkhVersMeqL, meqLVersMgLCaCO3, fahrenheitVersCelsius, celsiusVersFahrenheit, formaterFr,
} from '../src/lib/calculs/unites';

describe('alcalinité', () => {
  it('2,5 meq/L = 7 dKH (valeur « eau de mer » de Holmes-Farley)', () => {
    expect(meqLVersDkh(2.5)).toBeCloseTo(7, 10);
  });
  it('4 meq/L = 11,2 dKH ≈ borne haute 11 dKH de la plage cible', () => {
    expect(meqLVersDkh(4)).toBeCloseTo(11.2, 10);
  });
  it('1 dKH ≈ 0,357 meq/L', () => {
    expect(dkhVersMeqL(1)).toBeCloseTo(0.357, 3);
  });
  it('aller-retour sans perte', () => {
    expect(dkhVersMeqL(meqLVersDkh(3.1))).toBeCloseTo(3.1, 10);
  });
  it('1 meq/L = 50 mg/L éq. CaCO3', () => {
    expect(meqLVersMgLCaCO3(1)).toBe(50);
  });
});

describe('température', () => {
  it('points de référence', () => {
    expect(fahrenheitVersCelsius(32)).toBeCloseTo(0, 10);
    expect(fahrenheitVersCelsius(212)).toBeCloseTo(100, 10);
  });
  it('76–83 °F ≈ 24,4–28,3 °C (plage cible de Holmes-Farley)', () => {
    expect(fahrenheitVersCelsius(76)).toBeCloseTo(24.4, 1);
    expect(fahrenheitVersCelsius(83)).toBeCloseTo(28.3, 1);
  });
  it('aller-retour sans perte', () => {
    expect(celsiusVersFahrenheit(fahrenheitVersCelsius(80))).toBeCloseTo(80, 10);
  });
});

describe('formaterFr', () => {
  it('virgule décimale', () => {
    expect(formaterFr(2.5)).toBe('2,5');
    expect(formaterFr(0.02)).toBe('0,02');
  });
});
