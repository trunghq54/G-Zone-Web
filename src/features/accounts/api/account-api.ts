import api from "@/lib/api";

export const getAccountMe = async () => {
  const response = await api.get("/accounts/me");
  return response.data.data;
};

export const updateAccount = async (accountData: any) => {
  const response = await api.put("/accounts", accountData);
  return response.data;
};

export const updateAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.patch("/accounts/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getAvatarImage = async (relativeUrl: string) => {
  const response = await api.get(`/image/${relativeUrl}`, {
    responseType: "blob",
  });
  return response.data;
};
