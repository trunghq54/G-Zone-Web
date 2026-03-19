import api from "@/lib/axios-api";

export interface Account {
  id: string;
  "refresh-token": string | null;
  "refresh-token-expiry-time": string | null;
  "avatar-url": string | null;
  username: string;
  email: string;
  phone: string | null;
  "full-name": string | null;
  role: string;
  status: string;
  "is-active": boolean;
  "created-at": string;
  "date-of-birth": string | null;
  gender: string | null;
  "loyalty-points": number | null;
  salary: number | null;
  "hire-date": string | null;
}

export interface AccountQuery {
  "search-term"?: string;
  role?: string;
  status?: string;
  "is-active"?: boolean;
  "from-date"?: string;
  "to-date"?: string;
}

export interface PaginatedAccounts {
  "page-index": number;
  "page-size": number;
  "total-count": number;
  "total-page": number;
  "data-list": Account[];
}

interface ApiResponse {
  "status-code": number;
  message: string;
  data: PaginatedAccounts;
}

const API_URL = "/accounts";

export const getAccounts = async (
  pageNumber: number = 1,
  pageSize: number = 10,
  query?: AccountQuery,
) => {
  const params = {
    pageNumber,
    pageSize,
    ...query,
  };
  const { data } = await api.get<ApiResponse>(API_URL, {
    params,
  });
  return data.data;
};
