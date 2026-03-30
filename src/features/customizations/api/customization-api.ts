import api from "@/lib/axios-api";

export interface CustomizationResponse {
  customId: string;
  name: string;
  sku: string;
  color: string;
  weight: string;
  size: string;
  quotedPrice: number;
  status: string;
  createdAt: string;
  customerId: string;
  productId: string;
  customerName: string;
  staffName?: string;
  staffNote?: string;
  productName: string;
}

export interface CustomizationCreateRequest {
  name: string;
  sku: string;
  color: string;
  size: string;
  weight: number;
  staffNote?: string;
  customerId: string;
  productId: string;
}

export interface CustomizationUpdateRequest {
  name: string;
  color: string;
  size: string;
  weight: number;
  quotedPrice: number;
  staffNote?: string;
  status: string;
  confirmedByStaffId?: string | null;
}

// Helpers for mappings due to possible JSON policies
const mapToFrontend = (data: any): CustomizationResponse => ({
  customId: data.customId || data["custom-id"],
  name: data.name || data["name"],
  sku: data.sku || data["sku"],
  color: data.color || data["color"],
  weight: data.weight || data["weight"],
  size: data.size || data["size"],
  quotedPrice: data.quotedPrice || data["quoted-price"],
  status: data.status || data["status"],
  createdAt: data.createdAt || data["created-at"],
  customerId: data.customerId || data["customer-id"],
  productId: data.productId || data["product-id"],
  customerName: data.customerName || data["customer-name"],
  staffName: data.staffName || data["staff-name"],
  staffNote: data.staffNote || data["staff-note"],
  productName: data.productName || data["product-name"],
});

export const getCustomizations = async (pageIndex = 1, pageSize = 20) => {
  const response = await api.get(`/Customization?pageIndex=${pageIndex}&pageSize=${pageSize}`);
  const list = response.data?.data?.["data-list"] || response.data?.data?.dataList || [];
  return list.map(mapToFrontend);
};

export const getCustomizationById = async (id: string) => {
  const response = await api.get(`/Customization/${id}`);
  return mapToFrontend(response.data?.data);
};

export const createCustomization = async (data: CustomizationCreateRequest) => {
  const payload = {
    name: data.name,
    sku: data.sku,
    color: data.color,
    size: data.size,
    weight: data.weight,
    "staff-note": data.staffNote || "",
    "customer-id": data.customerId,
    "product-id": data.productId,
  };
  const response = await api.post("/Customization", payload);
  return mapToFrontend(response.data?.data);
};

export const updateCustomization = async (id: string, data: CustomizationUpdateRequest) => {
  const payload = {
    name: data.name,
    color: data.color,
    size: data.size,
    weight: data.weight,
    "quoted-price": data.quotedPrice,
    "staff-note": data.staffNote || "",
    status: data.status,
    "confirmed-by-staff-id": data.confirmedByStaffId,
  };
  const response = await api.put(`/Customization/${id}`, payload);
  return mapToFrontend(response.data?.data);
};
