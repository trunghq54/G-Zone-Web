import { getUser, removeUser, setUser } from './local-storage';

export const getAccessToken = (): string | null => {
  const user = getUser();
  return user ? user['access-token'] : null;
};

export const getRefreshToken = (): string | null => {
  const user = getUser();
  return user ? user['refresh-token'] : null;
};

export const setToken = (accessToken: string, refreshToken: string) => {
  const user = getUser();
  if (!user) {
    return;
  }
  const newUser = {
    ...user,
    'access-token': accessToken,
    'refresh-token': refreshToken
  };
  setUser(newUser);
};

export const clearToken = () => {
  removeUser();
};
