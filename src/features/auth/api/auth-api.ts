import api from "@/lib/api";

export const loginApi = async (email, password) => {
  const response = await api.post(
    "/auths/login",
    { email, password },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.data;
};

export const registerApi = async (userName, email, password) => {
  const response = await api.post(
    "/auths/register",
    { userName, email, password },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};
