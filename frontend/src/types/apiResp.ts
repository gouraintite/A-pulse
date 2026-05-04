export type ApiError = {
  status: number;
  message: string;
  details?: Record<string, string[]>; // pour validation errors
};