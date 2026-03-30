import { publicApi as api } from '@/lib/axios-api';

export interface UserNotificationResponse {
  notificationId: string;
  accountId: string;
  title: string;
  message: string;
  notificationType: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

export const notificationApi = {
  getNotificationsByAccount: async (accountId: string) => {
    const response = await api.get<{ statusCode: number; message: string; data: UserNotificationResponse[] }>(`/UserNotifications/${accountId}`);
    return response.data;
  },

  markAsRead: async (accountId: string, notificationId: string) => {
    const response = await api.put<{ statusCode: number; message: string; data: boolean }>(`/UserNotifications/${accountId}/mark-read/${notificationId}`);
    return response.data;
  },
};

