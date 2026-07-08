import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG, ENDPOINTS, buildUrl } from './config';
import { tokenStorage } from './tokenStorage';

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

function getAccessToken(): string | null {
  return tokenStorage.getAccessToken();
}

function getRefreshToken(): string | null {
  return tokenStorage.getRefreshToken();
}

function setTokens(access: string, refresh?: string) {
  tokenStorage.setTokens(access, refresh);
}

export function clearSession() {
  tokenStorage.clearAll();
}

// Turns a DRF error response body into a readable message instead of
// axios's generic "Request failed with status code 400".
export function extractErrorMessage(body: unknown, fallback: string): string {
  if (!body || typeof body !== 'object') return fallback;

  const obj = body as Record<string, unknown>;

  if (typeof obj.detail === 'string') return obj.detail;

  const messages: string[] = [];
  for (const [field, value] of Object.entries(obj)) {
    const values = Array.isArray(value) ? value : [value];
    for (const v of values) {
      if (typeof v !== 'string') continue;
      if (field === 'non_field_errors') {
        messages.push(v);
      } else {
        const label = field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, ' ');
        messages.push(`${label}: ${v}`);
      }
    }
  }

  return messages.length > 0 ? messages.join(' ') : fallback;
}

// Extra per-request options layered on top of AxiosRequestConfig.
// NOTE: `auth` here is OUR flag, not axios's built-in `config.auth`
// (which triggers HTTP Basic Auth with username/password). It gets
// translated to `requiresAuth` before reaching axios so the two
// never collide.
interface RequestOptions extends Omit<AxiosRequestConfig, 'auth'> {
  auth?: boolean; // attach Authorization header (default: true)
}

// Internal axios config uses `requiresAuth`, NOT `auth`, so it never
// shadows axios's reserved `config.auth` field.
interface InternalConfig extends InternalAxiosRequestConfig {
  requiresAuth?: boolean;
  _retry?: boolean;
}

const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Request interceptor: attach bearer token unless requiresAuth:false ---
axiosInstance.interceptors.request.use((config: InternalConfig) => {
  if (config.requiresAuth !== false) {
    const existingAuthHeader =
      typeof config.headers?.get === 'function'
        ? config.headers.get('Authorization')
        : (config.headers as Record<string, unknown> | undefined)?.['Authorization'];

    if (!existingAuthHeader) {
      const token = getAccessToken();
      if (token) {
        config.headers = (config.headers || {}) as any;
        (config.headers as any)['Authorization'] = `Bearer ${token}`;
      }
    }
  }
  return config;
});

// A bare axios call (no interceptors) used only for the refresh request,
// so a failed refresh can't recursively trigger another refresh attempt.
// Shared in-flight refresh promise so concurrent 401s (e.g. two components
// mounting at once, or React StrictMode's double-invoke in dev) don't each
// fire their own refresh call. With ROTATE_REFRESH_TOKENS on, only the first
// call would succeed and the rest would fail against an already-used token --
// this makes every caller await the same single attempt instead.
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refresh = getRefreshToken();
    if (!refresh) return null;

    try {
      const res = await axios.post(
        buildUrl(ENDPOINTS.AUTH.LOGIN.replace('login', 'refresh')),
        { refresh },
        { headers: { 'Content-Type': 'application/json' } }
      );
      const newAccess = res.data?.access as string | undefined;
      const newRefresh = res.data?.refresh as string | undefined; // present because ROTATE_REFRESH_TOKENS is on
      if (!newAccess) return null;
      setTokens(newAccess, newRefresh);
      return newAccess;
    } catch {
      return null;
    }
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

// --- Response interceptor: on 401, try one silent refresh + retry ---
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalConfig | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      originalRequest.requiresAuth !== false &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const newToken = await refreshAccessToken();

      if (newToken) {
        const retryConfig: InternalConfig = {
          ...originalRequest,
          headers: {
            ...(originalRequest.headers as any),
            Authorization: `Bearer ${newToken}`,
          } as any,
        };

        return axiosInstance(retryConfig);
      }

      clearSession();
    }

    return Promise.reject(error);
  }
);

export async function apiRequest<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { auth = true, method = 'GET', data, ...rest } = options;

  try {
    const response = await axiosInstance.request<T>({
      url: path,
      method,
      data,
      requiresAuth: auth, 
      ...rest,
    } as InternalConfig);
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 0;
      const body = err.response?.data ?? null;
      const message = extractErrorMessage(body, err.message || `Request failed with status ${status}`);
      throw new ApiError(message, status, body);
    }
    throw err;
  }
}

export { setTokens, getAccessToken };