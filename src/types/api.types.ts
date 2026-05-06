export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    results: T[];
    count: number;
    next: string | null;
    previous: string | null;
  };
}
