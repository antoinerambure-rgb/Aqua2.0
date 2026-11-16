/**
 * Conversions d'unités.
 * Source des facteurs d'alcalinité : affirmation « kh-conversion »
 * (1 meq/L = 2,8 dKH = 50 mg/L éq. CaCO3).
 */

export const DKH_PAR_MEQ_L = 2.8;
export const MG_L_CACO3_PAR_MEQ_L = 50;

export const meqLVersDkh = (meqL: number) => meqL * DKH_PAR_MEQ_L;
export const dkhVersMeqL = (dkh: number) => dkh / DKH_PAR_MEQ_L;
export const meqLVersMgLCaCO3 = (meqL: number) => meqL * MG_L_CACO3_PAR_MEQ_L;

/** Conversion de définition : °C = (°F − 32) × 5/9. */
export const fahrenheitVersCelsius = (f: number) => ((f - 32) * 5) / 9;
export const celsiusVersFahrenheit = (c: number) => (c * 9) / 5 + 32;

/** Nombre formaté à la française, sans zéros inutiles. */
export function formaterFr(valeur: number, decimalesMax = 2): string {
  return valeur.toLocaleString('fr-FR', { maximumFractionDigits: decimalesMax });
}
