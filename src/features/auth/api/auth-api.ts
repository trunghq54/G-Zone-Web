import { publicApi } from "@/lib/axios-api";

export const loginApi = async (email, password) => {
  const response = await publicApi.post(
    "/auths/login",
    { email, password },
    {
      headers: {
        "Content-Type": "application/json-patch+json",
      },
    },
  );

  return response.data.data;
};

export const registerApi = async (userName, email, password) => {
  const response = await publicApi.post(
    "/auths/register",
    { "user-name": userName, email, password },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
};

export const refreshToken = async (tokenData: {
  "access-token": string;
  "refresh-token": string;
}) => {
  const response = await publicApi.post("/auths/refresh-token", tokenData);
  return response.data.data;
};
