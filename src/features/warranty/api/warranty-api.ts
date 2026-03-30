import { publicApi as api } from '@/lib/axios-api';

export interface WarrantyClaimRequest {
  issueDescription: string;
  customerId: string;
  orderDetailId: string;
}

export interface WarrantyClaimUpdateRequest {
  claimStatus?: string;
  resolutionNotes?: string;
  repairCost?: number;
  processedByStaffId?: string;
  status?: string;
}

export interface WarrantyClaimResponse {
  claimId: string;
  claimNumber: string;
  issueDescription: string;
  claimStatus: string;
  claimDate: string;
  resolutionDate: string | null;
  resolutionNotes: string | null;
  repairCost: number;
  createdAt: string;
  updatedAt: string | null;
  status: string;
  customerId: string;
  processedByStaffId: string | null;
  orderDetailId: string;
}

export const warrantyApi = {
  createClaim: async (data: WarrantyClaimRequest) => {
    const response = await api.post<{ statusCode: number; message: string; data: WarrantyClaimResponse }>('/WarrantyClaims', data);
    return response.data;
  },
  
  getClaims: async (params?: { pageNumber?: number; pageSize?: number; customerId?: string }) => {
    const response = await api.get<{ statusCode: number; message: string; data: { dataList: WarrantyClaimResponse[], totalCount: number, pageIndex: number, pageSize: number } }>('/WarrantyClaims', { params });
    return response.data;
  },

  updateClaim: async (id: string, data: WarrantyClaimUpdateRequest) => {
    const response = await api.put<{ statusCode: number; message: string; data: WarrantyClaimResponse }>(`/WarrantyClaims/${id}`, data);
    return response.data;
  }
};


