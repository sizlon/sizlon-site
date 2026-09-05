import { content, type Lang } from './content';

// 2026-09-05 개편 v3: 한국어가 기본 로케일(루트), 영어는 /en/ 한 장만.
export const defaultLang: Lang = 'ko';
export const languages: Record<Lang, string> = { ko: 'KO', en: 'EN' };

/** Locale of a URL pathname ('/en' or '/en/...' → 'en', otherwise ko). */
export function langFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  return first === 'en' ? 'en' : defaultLang;
}

/** Strip the /en prefix to the logical (default-locale) path. */
export function logicalPath(url: URL): string {
  const stripped = url.pathname.replace(/^\/en(?=\/|$)/, '');
  return stripped === '' ? '/' : stripped;
}

/**
 * Map a logical path to its localized URL. Only the home page has an English
 * twin (/en/); every other path is Korean-only and returned unchanged.
 */
export function localizePath(path: string, lang: Lang): string {
  if (path.startsWith('http')) return path;
  if (lang === 'en' && path === '/') return '/en/';
  return path;
}

/** Chrome-level accessor (Nav/Footer/Base). Page bodies read content.ko directly. */
export function t(lang: Lang) {
  return content[lang];
}
