import { api } from "@/lib/api";

export class ResetPasswordService {
  static async forgotPassword(email: string) {
    const response = await api.get(`/forgot-password?email=${email}`);

    return response.data;
  }

  static async resetPassword(token: string, newPassword: string, retryNewPassword: string) {
    const response = await api.post('/reset-password', {
      token,
      newPassword,
      retryNewPassword,
    });

    return response.data;
  }
}