import { IUsersSupplier } from "@/entities/i-user-supplier";
import { api } from "@/lib/api";

export class UserSupplierService {
  static async list() {
    const usersSupplier = await api.get<IUsersSupplier[]>('/users-supplier');

    return usersSupplier.data;
  }
}