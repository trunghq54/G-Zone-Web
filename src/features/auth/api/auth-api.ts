import api from "@/lib/api";

export const loginApi = async (email, password) => {
  const response = await api.post(
    "/auths/login",
    { email, password },
    {
      headers: {
        "Content-Type": "application/json-patch+json",
      },
    }
  );

  return response.data.data;
};
