import { apiClient } from './interceptor';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  UserResponse,
} from '../types/auth';

export const authApi = {
  register: async (data: RegisterRequest): Promise<UserResponse> => {
    const response = await apiClient.post<UserResponse>('/api/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/api/auth/login', data);
    return response.data;
  },

  me: async (): Promise<UserResponse> => {
    const response = await apiClient.get<UserResponse>('/api/me');
    return response.data;
  },
};