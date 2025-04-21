// src/lib/urlSync.ts
import qs from 'qs';

export function readState<T = any>(): Partial<T> {
  // parse the query‑string into a plain object
  const parsed = qs.parse(location.search, { ignoreQueryPrefix: true }) as Record<string, any>;

  // (optional) decompress % fields here …

  return parsed as Partial<T>;
}

export function writeState(obj: any) {
  const query = qs.stringify(obj, {
    addQueryPrefix: true,
    encoder: (str: string) => (str === undefined ? '' : str), // skip undefined
    format: 'RFC1738',
  });
  history.replaceState(null, '', query);
}
