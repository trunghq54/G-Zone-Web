const USER_DATA_KEY = "GZONE_USER_DATA";

export const getUser = (): any | null => {
  const userDataString = localStorage.getItem(USER_DATA_KEY);
  if (!userDataString) {
    return null;
  }
  try {
    return JSON.parse(userDataString);
  } catch (error) {
    console.error("Failed to parse user data from localStorage", error);
    return null;
  }
};

export const setUser = (userData: any) => {
  try {
    const userDataString = JSON.stringify(userData);
    localStorage.setItem(USER_DATA_KEY, userDataString);
  } catch (error) {
    console.error("Failed to save user data to localStorage", error);
  }
};

export const removeUser = () => {
  localStorage.removeItem(USER_DATA_KEY);
};
