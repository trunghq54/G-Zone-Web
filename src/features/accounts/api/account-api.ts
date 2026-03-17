import api from "@/lib/axios-api";

export const getAccountMe = async () => {
  const response = await api.get("/accounts/me");
  return response.data.data;
  /* Response data structure for getAccountMe API
  {
    "status-code": 0,
    "message": "string",
    "data": {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "refresh-token": "string",
      "refresh-token-expiry-time": "2026-03-16T19:55:00.238Z",
      "avatar-url": "string",
      "username": "string",
      "email": "string",
      "phone": "string",
      "full-name": "string",
      "role": "string",
      "status": "string",
    "is-active": true,
    "created-at": "2026-03-16T19:55:00.238Z",
    "date-of-birth": "2026-03-16T19:55:00.238Z",
    "gender": "string",
    "loyalty-points": 0,
    "salary": 0,
    "hire-date": "2026-03-16T19:55:00.238Z"
    }
    }
    */
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
