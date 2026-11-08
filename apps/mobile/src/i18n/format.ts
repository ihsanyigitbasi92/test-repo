/** Locale helpers without Intl (Hermes builds may ship without full ICU data). */
export function groupDigits(x: number, sep: string): string {
  const s = String(Math.trunc(Math.abs(x)));
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
}
/** Turkish-aware upper case (i → İ, ı → I) — the DateLine / labels are uppercase. */
export const upperTr = (s: string): string => s.replace(/i/g, 'İ').replace(/ı/g, 'I').toUpperCase();
export const lowerTr = (s: string): string => s.replace(/İ/g, 'i').replace(/I/g, 'ı').toLowerCase();
/** Locale-aware upper case: Turkish rules for TR (i → İ), plain toUpperCase otherwise. */
export const upper = (locale: string, s: string): string => (locale === 'tr' ? upperTr(s) : s.toUpperCase());
