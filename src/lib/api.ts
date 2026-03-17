import axios from "axios";
import { getToken } from "./token";
import { getUser, setUser, removeUser } from "./local-storage";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add the access token to the header
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check for network errors or other issues where response is not available
    if (!error.response) {
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const token = getToken();
      if (token) {
        try {
          const response = await axios.post(
            `${API_BASE_URL}/auth/refresh-token`,
            {
              refreshToken: token.refreshToken,
            },
          );
          // Assuming the refresh token response gives new tokens
          const { accessToken, refreshToken } = response.data;
          const user = getUser();
          if (user) {
            const newUser = {
              ...user,
              "access-token": accessToken,
              "refresh-token": refreshToken,
            };
            setUser(newUser);
          }

          api.defaults.headers.common["Authorization"] =
            `Bearer ${accessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          removeUser();
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      } else {
        removeUser();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
