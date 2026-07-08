import { ENDPOINTS } from './config';
import { apiRequest, setTokens, clearSession } from './apiClient';
import { tokenStorage } from './tokenStorage';

export interface User {
  id: number;
  name: string;
  email: string;
  is_staff: boolean;
  is_admin: boolean;
  is_active: boolean;
  create_date_time: string;
  update_date_time: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface ClientRedirect {
  id: number;
  name: string | null;
  redirect_url: string | null;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
  client: ClientRedirect | null;
}

export interface RegisterResponse {
  user: User;
  tokens: AuthTokens;
}

export interface LoginPayload {
  email: string;
  password: string;
  clientId?: number | string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

function persistSession(user: User, tokens: AuthTokens) {
  setTokens(tokens.access, tokens.refresh);
  tokenStorage.setUser(user);
}

export const userService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const data = await apiRequest<LoginResponse>(ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      auth: false,
      data: {
        email: payload.email,
        password: payload.password,
        client_id: payload.clientId,
      },
    });
    persistSession(data.user, data.tokens);
    return data;
  },

  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    const data = await apiRequest<RegisterResponse>(ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      auth: false,
      data: payload,
    });
    persistSession(data.user, data.tokens);
    return data;
  },

  async fetchProfile(): Promise<User> {
    return apiRequest<User>(ENDPOINTS.AUTH.PROFILE, { method: 'GET' });
  },

  async updateProfile(payload: { name?: string; email?: string }): Promise<User> {
    const user = await apiRequest<User>(ENDPOINTS.AUTH.PROFILE, {
      method: 'PATCH',
      data: payload,
    });
    // Update local storage user details
    tokenStorage.setUser(user);
    return user;
  },

  async logout(): Promise<void> {
    const refresh = tokenStorage.getRefreshToken();
    try {
      await apiRequest(ENDPOINTS.AUTH.LOGOUT, {
        method: 'POST',
        data: { refresh },
      });
    } finally {
      clearSession();
    }
  },

  getStoredUser(): User | null {
    return tokenStorage.getUser<User>();
  },
};