import { closest } from '../../internal/element';
import en from '../../translations/en';

import type { LitElement } from 'lit';
import type { Translation } from '../../translations/translation';

export type FunctionParams<T> = T extends (...args: infer U) => string ? U : never;

export { localize, translateDirective, formatDateDirective, formatNumberDirective } from './lit';

export const connectedElements = new Map<LitElement, string>();
const documentElementObserver = new MutationObserver(() => forceUpdate());
const translations: Map<string, Translation> = new Map();

export function detectLanguage(el: HTMLElement) {
  const closestEl = closest('[lang]', el) as HTMLElement;
  return closestEl?.lang;
}

export function registerTranslation(translation: Translation) {
  const code = translation.$code.toLowerCase();
  translations.set(code, translation);
  forceUpdate();
}

export function translate<T extends keyof Translation>(lang: string, key: T, ...args: FunctionParams<Translation[T]>) {
  const code = lang.toLowerCase().slice(0, 2); // e.g. en
  const subcode = lang.length > 2 ? lang.toLowerCase() : ''; // e.g. en-US
  const primary = translations.get(subcode);
  const secondary = translations.get(code);
  const fallback = translations.get('en')!;
  let term;

  // Look for a matching term using subcode, code, then the fallback
  if (primary && primary[key]) {
    term = primary[key];
  } else if (secondary && secondary[key]) {
    term = secondary[key];
  } else if (fallback && fallback[key]) {
    term = fallback[key];
  } else {
    throw new Error(`Cannot find "${key}" to translate.`);
  }

  if (typeof term === 'function') {
    // @ts-ignore
    return term(...args);
  }

  return term;
}

export function formatDate(lang: string, date: Date | string, options?: Intl.DateTimeFormatOptions) {
  date = new Date(date);
  return new Intl.DateTimeFormat(lang, options).format(date);
}

export function formatNumber(lang: string, number: number | string, options?: Intl.NumberFormatOptions) {
  number = Number(number);
  return isNaN(number) ? '' : new Intl.NumberFormat(lang, options).format(number);
}

export function forceUpdate() {
  [...connectedElements.keys()].map(el => {
    const lang = detectLanguage(el);
    connectedElements.set(el, lang);
    el.requestUpdate();
  });
}

// Register the fallback translation
registerTranslation(en);

// Update connected elements when a lang attribute changes
documentElementObserver.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['lang'],
  childList: true,
  subtree: true
});
