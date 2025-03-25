import { api } from "@/lib/api";


export interface INotifications {
  createdAt: string;
  description: string;
  id: number;
  identify: string
  recipients: [
    {
      id: number,
      userId: number,
      notificationId: number,
      status: 'unread' | 'read',
    }
  ]
}

export class NotificationService {
  static async findById(notificationId: number) {
    const response = await api.get<INotifications>(`/notification/${notificationId}`);

    return response.data;
  }

  static async readedNotification(notificationId: number) {
    const response = await api.put(`/notification/${notificationId}`);

    return response.data;
  }

  static async list() {
    const response = await api.get<INotifications[]>(`/notification`);

    return response.data;
  }
}
