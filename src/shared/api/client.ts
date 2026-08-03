import axios, { AxiosError } from "axios";

export class ApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) =>
    Promise.reject(
      new ApiError(
        error.response?.data?.message ??
          "Something went wrong. Please try again.",
        error.response?.status,
      ),
    ),
);
