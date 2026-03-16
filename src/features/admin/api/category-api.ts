import api from "@/lib/api";

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

export const getCategories = async (pageNumber = 1, pageSize = 50) => {
  const response = await api.get(`/categories?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  // Assuming the API returns ApiResponse with a 'data' array or object
  return response.data.data;
};

export const getCategoryById = async (id: string) => {
  const response = await api.get(`/categories/${id}`);
  return response.data.data;
};

export const createCategory = async (category: CategoryRequest) => {
  const response = await api.post("/categories", category);
  return response.data.data;
};

export const updateCategory = async (id: string, category: CategoryRequest) => {
  const response = await api.put(`/categories/${id}`, category);
  return response.data.data;
};

export const deleteCategory = async (id: string) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data.data;
};
