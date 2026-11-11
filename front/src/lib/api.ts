const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try { return localStorage.getItem('clinica_token'); } catch { return null; }
}

export function setToken(token: string) {
  try {
    localStorage.setItem('clinica_token', token);
    // Também seta cookie para o proxy.ts ler o papel
    const payload = JSON.parse(atob(token.split('.')[1]));
    document.cookie = `clinica_auth=${token}; path=/; max-age=${60 * 60 * 24 * 7}`;
    document.cookie = `clinica_role=${payload.role}; path=/; max-age=${60 * 60 * 24 * 7}`;
  } catch {}
}

export function clearToken() {
  try {
    localStorage.removeItem('clinica_token');
    document.cookie = 'clinica_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'clinica_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  } catch {}
}

export async function api<T = any>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers ?? {}),
  };

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Erro de rede' }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }

  const json = await res.json();
  // Desembala o envelope { statusCode, message, data }
  return 'data' in json ? json.data : json;
}
