import api from '@/lib/axios-api';

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
    const payload = {
      "issue-description": data.issueDescription,
      "customer-id": data.customerId,
      "order-detail-id": data.orderDetailId
    };
    const response = await api.post<{ statusCode: number; message: string; data: WarrantyClaimResponse }>('/warranty-claims', payload);
    return response.data;
  },

  getClaims: async (params?: { pageNumber?: number; pageSize?: number; customerId?: string }) => {
    const queryParams: any = {};
    if (params) {
      if (params.pageNumber !== undefined) queryParams.pageNumber = params.pageNumber;
      if (params.pageSize !== undefined) queryParams.pageSize = params.pageSize;
      if (params.customerId !== undefined) queryParams["customer-id"] = params.customerId;
    }
    const response = await api.get<{ statusCode: number; message: string; data: { dataList: WarrantyClaimResponse[], totalCount: number, pageIndex: number, pageSize: number } }>('/warranty-claims', { params: queryParams });
    return response.data;
  },

  updateClaim: async (id: string, data: WarrantyClaimUpdateRequest) => {
    const payload = {
      "claim-status": data.claimStatus,
      "resolution-notes": data.resolutionNotes,
      "repair-cost": data.repairCost,
      "processed-by-staff-id": data.processedByStaffId,
      status: data.status
    };
    const response = await api.put<{ statusCode: number; message: string; data: WarrantyClaimResponse }>(`/warranty-claims/${id}`, payload);
    return response.data;
  }
};
