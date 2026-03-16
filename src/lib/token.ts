import { getUser } from "./user";

export const getToken = (): { accessToken: string; refreshToken: string } | null => {
  const user = getUser();
  if (!user) {
    return null;
  }

  // Handle both camelCase from BE directly and hyphenated format
  const accessToken = user.accessToken || user["access-token"];
  const refreshToken = user.refreshToken || user["refresh-token"];

  if (!accessToken || !refreshToken) {
    return null;
  }

  return { accessToken, refreshToken };
};
