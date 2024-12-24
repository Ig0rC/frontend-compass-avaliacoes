import { IUsersSupplier } from "@/entities/i-user-supplier";
import { api } from "@/lib/api";

export class UserService {
  static async findProfileData() {
    const user = await api.get<IUsersSupplier>('/users');

    return user.data;
  }

  static async update(name: string, email: string) {
    const user = await api.put<{ status: number, message: string }>('/users', {
      name, email
    });

    return user.data;
  }
}