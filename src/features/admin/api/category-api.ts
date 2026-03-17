import api from "@/lib/axios-api";

export interface Category {
  categoryId: string;
  categoryName: string;
  description?: string;
  slug?: string;
  imageUrl?: string;
  displayOrder: number;
  isActive: boolean;
  parentCategoryId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CategoryRequest {
  categoryName: string;
  description?: string;
  slug?: string;
  imageUrl?: string;
  displayOrder: number;
  isActive: boolean;
  parentCategoryId?: string;
}

const mapToBackend = (data: CategoryRequest) => ({
  "category-name": data.categoryName,
  description: data.description || "",
  slug: data.slug || "",
  "image-url": data.imageUrl || "",
  "display-order": data.displayOrder,
  "is-active": data.isActive,
  "parent-category-id": data.parentCategoryId || null,
});

const mapToFrontend = (data: any): Category => ({
  categoryId: data["category-id"],
  categoryName: data["category-name"],
  description: data["description"],
  slug: data["slug"],
  imageUrl: data["image-url"],
  displayOrder: data["display-order"],
  isActive: data["is-active"],
  parentCategoryId: data["parent-category-id"],
  createdAt: data["created-at"],
  updatedAt: data["updated-at"],
});

export const getCategories = async (pageNumber = 1, pageSize = 50) => {
  const response = await api.get(
    `/categories?pageNumber=${pageNumber}&pageSize=${pageSize}`,
  );
  const list = response.data?.data?.["data-list"] || [];
  return list.map(mapToFrontend);
};

export const getCategoryById = async (id: string) => {
  const response = await api.get(`/categories/${id}`);
  return mapToFrontend(response.data.data);
};

export const createCategory = async (category: CategoryRequest) => {
  const response = await api.post("/categories", mapToBackend(category));
  return mapToFrontend(response.data.data);
};

export const updateCategory = async (id: string, category: CategoryRequest) => {
  const response = await api.put(`/categories/${id}`, mapToBackend(category));
  return mapToFrontend(response.data.data);
};

export const deleteCategory = async (id: string) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};
