import axios from "axios";
import { clearToken, getAccessToken, getRefreshToken, setToken } from "./token";
import { refreshToken as refreshTokenApi } from "../features/auth/api/auth-api";

const BASE_URL =
  import.meta.env.VITE_API_URL || "https://localhost:7025/api/v1";

export const publicApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const privateApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

privateApi.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

let isRefreshing = false;
let failedQueue: {
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

privateApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return privateApi(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const localRefreshToken = getRefreshToken();
      const localAccessToken = getAccessToken();
      if (!localRefreshToken || !localAccessToken) {
        clearToken();
        // Redirect to login page
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const response = await refreshTokenApi({
          "access-token": localAccessToken,
          "refresh-token": localRefreshToken,
        });

        const {
          "access-token": newAccessToken,
          "refresh-token": newRefreshToken,
        } = response;
        setToken(newAccessToken, newRefreshToken);

        privateApi.defaults.headers.common["Authorization"] =
          "Bearer " + newAccessToken;
        originalRequest.headers["Authorization"] = "Bearer " + newAccessToken;

        processQueue(null, newAccessToken);
        return privateApi(originalRequest);
      } catch (err: any) {
        processQueue(err, null);
        clearToken();
        // Redirect to login page
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default privateApi;
