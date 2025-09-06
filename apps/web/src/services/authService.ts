import { apiClient } from './api';
import { User, LoginRequest, RegisterRequest, AuthTokens } from '@online-hiring-system/types';

export const authService = {
  async login(credentials: LoginRequest): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const response = await apiClient.post<{ user: User; accessToken: string; refreshToken: string }>('/auth/login', credentials);
    return response.data!;
  },

  async register(userData: RegisterRequest): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const response = await apiClient.post<{ user: User; accessToken: string; refreshToken: string }>('/auth/register', userData);
    return response.data!;
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    return response.data!;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  async refreshToken(): Promise<AuthTokens> {
    const response = await apiClient.post<AuthTokens>('/auth/refresh');
    return response.data!;
  },
};
