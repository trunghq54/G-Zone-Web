import api from "@/lib/api";

export interface UserAddress {
  "address-id": string;
  "address-label": string;
  "receiver-name": string;
  "receiver-phone": string;
  address: string;
  city: string;
  district: string;
  ward: string;
  "is-default": boolean;
  "updated-at": string;
  "account-id": string;
}

export const getUserAddresses = async (): Promise<UserAddress[]> => {
  const response = await api.get("/user-addresses");
  return response.data.data;
};

export const getUserAddress = async (id: string): Promise<UserAddress> => {
  const response = await api.get(`/user-addresses/${id}`);
  return response.data.data;
};

export const createUserAddress = async (addressData: Omit<UserAddress, "address-id" | "updated-at">) => {
  const response = await api.post("/user-addresses", addressData);
  return response.data;
};

export const updateUserAddress = async (addressData: UserAddress) => {
  const response = await api.put("/user-addresses", addressData);
  return response.data;
};

export const deleteUserAddress = async (id: string) => {
  const response = await api.delete(`/user-addresses/${id}`);
  return response.data;
};
