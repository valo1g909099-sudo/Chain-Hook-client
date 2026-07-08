import { STORAGE_KEYS } from './config';

const COOKIE_MAX_AGE_ACCESS = 60 * 30; // 30 minutes
const COOKIE_MAX_AGE_REFRESH = 60 * 60 * 24 * 7; // 7 days

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  if (!isBrowser()) return;
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax${secure}`;
}

function getCookie(name: string): string | null {
  if (!isBrowser()) return null;
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split('=').slice(1).join('=')) : null;
}

function deleteCookie(name: string) {
  if (!isBrowser()) return;
  document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
}

function safeLocalStorageGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    // localStorage disabled/full/blocked
    return null;
  }
}

function safeLocalStorageSet(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function safeLocalStorageRemove(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* no-op */
  }
}

// The localStorage copy is wrapped with its own expiresAt timestamp so it
// can't silently outlive the cookie's Max-Age. Without this, an expired
// cookie would fall through to a *still-valid-looking* localStorage entry
// that never expires on its own, and the app would keep sending dead tokens.
interface StoredEntry {
  value: string;
  expiresAt: number; // epoch ms
}

function writeDual(key: string, value: string, maxAgeSeconds: number) {
  const entry: StoredEntry = {
    value,
    expiresAt: Date.now() + maxAgeSeconds * 1000,
  };
  safeLocalStorageSet(key, JSON.stringify(entry));
  setCookie(key, value, maxAgeSeconds);
}

/**
 * Read a value, trying localStorage first (if not expired), then falling
 * back to the cookie. If the localStorage entry is expired or malformed,
 * it's removed so it can't be read again.
 */
function readDual(key: string): string | null {
  const raw = safeLocalStorageGet(key);
  if (raw !== null) {
    try {
      const entry = JSON.parse(raw) as StoredEntry;
      if (typeof entry.expiresAt === 'number' && Date.now() < entry.expiresAt) {
        return entry.value;
      }
      // expired -- drop it and fall through to the cookie
      safeLocalStorageRemove(key);
    } catch {
      // Malformed/legacy entry (e.g. written by the old un-expiring format).
      // Discard rather than trusting it indefinitely.
      safeLocalStorageRemove(key);
    }
  }
  return getCookie(key);
}

/** Remove a value from both backends. */
function removeDual(key: string) {
  safeLocalStorageRemove(key);
  deleteCookie(key);
}

export const tokenStorage = {
  getAccessToken(): string | null {
    return readDual(STORAGE_KEYS.ACCESS_TOKEN);
  },

  getRefreshToken(): string | null {
    return readDual(STORAGE_KEYS.REFRESH_TOKEN);
  },

  setTokens(access: string, refresh?: string) {
    writeDual(STORAGE_KEYS.ACCESS_TOKEN, access, COOKIE_MAX_AGE_ACCESS);
    if (refresh) {
      writeDual(STORAGE_KEYS.REFRESH_TOKEN, refresh, COOKIE_MAX_AGE_REFRESH);
    }
  },

  getUser<T = unknown>(): T | null {
    const raw = readDual(STORAGE_KEYS.USER);
    return raw ? (JSON.parse(raw) as T) : null;
  },

  setUser(user: unknown) {
    // User profile is kept alive as long as the refresh token is, since
    // there's no point remembering "who's logged in" longer than the
    // session that could actually re-authenticate them.
    writeDual(STORAGE_KEYS.USER, JSON.stringify(user), COOKIE_MAX_AGE_REFRESH);
  },

  clearAll() {
    removeDual(STORAGE_KEYS.ACCESS_TOKEN);
    removeDual(STORAGE_KEYS.REFRESH_TOKEN);
    removeDual(STORAGE_KEYS.USER);
  },
};