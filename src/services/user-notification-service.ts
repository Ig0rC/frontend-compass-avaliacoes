import { api } from "@/lib/api";

export class UserNotificationService {
  static async create(userId: string, message: string) {
    console.log('ok')
    await api.post(`/user-notification`, {
      notificationDescription: message,
      userId: Number(userId),
    });

  }
}
