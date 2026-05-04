import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { authApi } from '../api/auth';
import type { LoginRequest, RegisterRequest, UserResponse } from '../types/auth';

const TOKEN_STORAGE_KEY = 'axa-pulse-token';

type AuthContextValue = {
  user: UserResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  register: (data: RegisterRequest) => Promise<UserResponse>;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
};

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Au montage : si on a un token en localStorage, on tente de récupérer le user
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) {
      return;
    }

    let cancelled = false;

    async function fetchMe() {
        setIsLoading(true);
      try {
        const me = await authApi.me();
        if (!cancelled) {
          setUser(me);
        }
      } catch {
        if (!cancelled) {
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchMe();

    return () => {
      cancelled = true;
    };
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    const newUser = await authApi.register(data);
    return newUser;
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    setIsLoading(true);
    const response = await authApi.login(data);
    localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
    setUser(response.user);
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    setIsLoading(true);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setUser(null);
    setIsLoading(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: user !== null,
      register,
      login,
      logout,
    }),
    [user, isLoading, register, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}