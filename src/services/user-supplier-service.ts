import { IUser } from "@/entities/i-user-supplier";
import { api } from "@/lib/api";

export class UserSupplierService {
  static async list() {
    const usersSupplier = await api.get<IUser[]>('/users-supplier');

    return usersSupplier.data;
  }
}