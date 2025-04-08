import { api } from "@/lib/api";

export class UserNotificationService {
  static async create(userId: number, message: string) {
    await api.post(`/user-notification`, {
      notificationDescription: message,
      userId: userId,
    });

  }
}
