/**
 * Runtime language switch (TR / EN). UI strings come from tr.ts / en.ts; event prose comes from the content
 * bundle through the engine's text keys (`renderText`), so a switch re-renders the whole feed in the new language.
 */
import { createContext, useContext } from 'react';
import { renderText } from '@motto/engine';
import type { Locale } from '@motto/engine';
import { getBundle } from '../content/bundle';
import { tr, type Strings } from './tr';
import { en } from './en';

export type { Strings };
export const CATALOG: Record<Locale, Strings> = { tr, en };

export interface I18n {
  locale: Locale;
  s: Strings;
  /** Engine text key → localized, `{param}`-filled string (empty when the key is unknown). */
  text: (key: string, params?: Readonly<Record<string, number | string>>) => string;
}

export function makeI18n(locale: Locale): I18n {
  return { locale, s: CATALOG[locale], text: (key, params) => renderText(getBundle(), key, locale, params) ?? '' };
}

export const I18nContext = createContext<I18n>(makeI18n('tr'));
export const useI18n = (): I18n => useContext(I18nContext);
export { upperTr, upper, groupDigits } from './format';

/** Motto of the Year: the engine's ritual variant of the pool for `key` (pattern | good | bad | none). */
export function mottoLine(s: Strings, key: string, i = 0): string {
  const pool = s.motto[key] ?? s.motto.none!;
  return pool[((i % pool.length) + pool.length) % pool.length] ?? '';
}
export const noEnvelopeLine = (s: Strings, i = 0): string => s.noEnvelope[((i % s.noEnvelope.length) + s.noEnvelope.length) % s.noEnvelope.length]!;
