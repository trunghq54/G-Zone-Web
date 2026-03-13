import { getUser } from "./user";

export const getToken = (): { accessToken: string; refreshToken: string } | null => {
  const user = getUser();
  if (!user) {
    return null;
  }

  const accessToken = user["access-token"];
  const refreshToken = user["refresh-token"];

  if (!accessToken || !refreshToken) {
    return null;
  }

  return { accessToken, refreshToken };
};
