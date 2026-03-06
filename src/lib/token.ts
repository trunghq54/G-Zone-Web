const GZONE_ACCESS_TOKEN = "GZONE_ACCESS_TOKEN";
const GZONE_REFRESH_TOKEN = "GZONE_REFRESH_TOKEN";

export const getToken = (): { accessToken: string; refreshToken: string } | null => {
  const accessToken = localStorage.getItem(GZONE_ACCESS_TOKEN);
  const refreshToken = localStorage.getItem(GZONE_REFRESH_TOKEN);

  if (!accessToken || !refreshToken) {
    return null;
  }

  return { accessToken, refreshToken };
};

export const setToken = (accessToken: string, refreshToken: string) => {
  localStorage.setItem(GZONE_ACCESS_TOKEN, accessToken);
  localStorage.setItem(GZONE_REFRESH_TOKEN, refreshToken);
};

export const removeToken = () => {
  localStorage.removeItem(GZONE_ACCESS_TOKEN);
  localStorage.removeItem(GZONE_REFRESH_TOKEN);
};
