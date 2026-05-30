'use client';

const ACCESS_KEY = 'ipmp_access_token';
const REFRESH_KEY = 'ipmp_refresh_token';
const REMEMBER_KEY = 'ipmp_remember_me';

function getStorage(remember?: boolean) {
  if (typeof window === 'undefined') return null;
  const useLocal =
    remember ?? localStorage.getItem(REMEMBER_KEY) === 'true';
  return useLocal ? localStorage : sessionStorage;
}

export function setRememberMe(remember: boolean) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(REMEMBER_KEY, String(remember));
}

export function getTokens() {
  if (typeof window === 'undefined') {
    return { accessToken: null, refreshToken: null };
  }
  const storage =
    localStorage.getItem(REMEMBER_KEY) === 'true'
      ? localStorage
      : sessionStorage;
  return {
    accessToken: storage.getItem(ACCESS_KEY),
    refreshToken: storage.getItem(REFRESH_KEY),
  };
}

export function setTokens(
  accessToken: string,
  refreshToken: string,
  remember?: boolean,
) {
  const storage = getStorage(remember);
  if (!storage) return;
  storage.setItem(ACCESS_KEY, accessToken);
  storage.setItem(REFRESH_KEY, refreshToken);
  if (remember !== undefined) {
    setRememberMe(remember);
    if (remember) {
      sessionStorage.removeItem(ACCESS_KEY);
      sessionStorage.removeItem(REFRESH_KEY);
    } else {
      localStorage.removeItem(ACCESS_KEY);
      localStorage.removeItem(REFRESH_KEY);
    }
  }
}

export function clearTokens() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  sessionStorage.removeItem(ACCESS_KEY);
  sessionStorage.removeItem(REFRESH_KEY);
}

export function getUserFromStorage(): import('@/lib/api/types').User | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('ipmp_user') ?? sessionStorage.getItem('ipmp_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setUserInStorage(
  user: import('@/lib/api/types').User,
  remember?: boolean,
) {
  const storage = getStorage(remember);
  if (!storage) return;
  storage.setItem('ipmp_user', JSON.stringify(user));
}

export function clearUserFromStorage() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('ipmp_user');
  sessionStorage.removeItem('ipmp_user');
}

export function clearSession() {
  clearTokens();
  clearUserFromStorage();
}
