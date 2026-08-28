export interface ApiError {
  message: string;
  status?: number;
  statusText?: string;
  url?: string;
  errors?: Record<string, string[]>;
}
