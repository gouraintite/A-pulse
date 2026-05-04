// Req POST /api/auth/register
export type RegisterRequest = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  department?: string;
};

// Requête POST /api/auth/login
export type LoginRequest = {
  email: string;
  password: string;
};

// Resp Register et /api/me
export type UserResponse = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  department?: string;
  role: 'User' | 'Manager' | 'HR' | 'Admin';
  createdAt: string; // ISO date string
};

// Resp POST /api/auth/login
export type LoginResponse = {
  token: string;
  expiresAt: string;
  user: UserResponse;
};