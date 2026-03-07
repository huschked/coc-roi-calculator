// src/lib/urlSync.ts
import qs from "qs";

export function readState<T = Record<string, unknown>>(): Partial<T> {
  const parsed = qs.parse(location.search, {
    ignoreQueryPrefix: true,
    parseArrays: false,
  }) as Record<string, unknown>;

  return parsed as Partial<T>;
}

export function writeState(obj: Record<string, unknown>) {
  const compact = Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined && value !== null),
  );

  const query = qs.stringify(compact, {
    addQueryPrefix: true,
    format: "RFC1738",
  });

  history.replaceState(null, "", query);
}
