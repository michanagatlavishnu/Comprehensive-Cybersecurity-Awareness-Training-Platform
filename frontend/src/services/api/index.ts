import axios from "axios";
import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

import { API_BASE_URL, ENDPOINTS } from "./endpoints";
import tokenService from "../auth/tokenService";

/* ==========================================================
   CYBERAWARE AXIOS INSTANCE
========================================================== */

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ==========================================================
   REFRESH TOKEN QUEUE
========================================================== */

let isRefreshing = false;

let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: AxiosError) => void;
}[] = [];

const processQueue = (
  error: AxiosError | null,
  token?: string
) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token!);
    }
  });

  failedQueue = [];
};

/* ==========================================================
   REQUEST INTERCEPTOR
========================================================== */

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenService.getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers["X-App-Name"] = "CyberAware";
    config.headers["Accept-Language"] =
      localStorage.getItem("cyberaware-language") || "en";

    return config;
  },
  (error) => Promise.reject(error)
);

/* ==========================================================
   RESPONSE INTERCEPTOR
========================================================== */

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const currentPath = window.location.pathname;
    const requestUrl = originalRequest?.url || "";

    /* ------------------------------------------------------
       Ignore 401 while already on authentication pages
    ------------------------------------------------------ */

    const isAuthPage =
      currentPath.startsWith("/login") ||
      currentPath.startsWith("/signup") ||
      currentPath.startsWith("/forgot-password") ||
      currentPath.startsWith("/verify-otp") ||
      currentPath.startsWith("/reset-password");

    if (error.response?.status === 401 && isAuthPage) {
      return Promise.reject(error);
    }

    /* ------------------------------------------------------
       Refresh Access Token
    ------------------------------------------------------ */

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      tokenService.getRefreshToken() &&
      !requestUrl.includes("/auth/login") &&
      !requestUrl.includes("/auth/refresh")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          `${API_BASE_URL}${ENDPOINTS.AUTH.REFRESH_TOKEN}`,
          {
            refresh_token: tokenService.getRefreshToken(),
          }
        );

        const { access_token, refresh_token } = response.data.data;

        tokenService.saveTokens(access_token, refresh_token);

        processQueue(null, access_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError);

        tokenService.clearTokens();
        localStorage.removeItem("user");

        if (!isAuthPage) {
          window.location.replace("/login");
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    /* ------------------------------------------------------
       Any Other Unauthorized Request
    ------------------------------------------------------ */

    if (error.response?.status === 401 && !isAuthPage) {
      tokenService.clearTokens();
      localStorage.removeItem("user");
      window.location.replace("/login");
    }

    return Promise.reject(error);
  }
);

export default api;