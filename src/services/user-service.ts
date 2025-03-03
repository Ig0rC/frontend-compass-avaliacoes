import { IUser } from "@/entities/i-user-supplier";
import { api } from "@/lib/api";


interface IResponseList {
  users: IUser[]
  pagination: {
    currentPage: number
    pageSize: number
    totalProposes: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

export class UserService {
  static async findProfileData() {
    const user = await api.get<IUser>('/find-my-profile-data');

    return user.data;
  }

  static async updateMyProfile(name: string, email: string) {
    const user = await api.put<{ status: number, message: string }>('/update-my-profile', {
      name, email
    });

    return user.data;
  }

  static async update(id: number, username: string, useremail: string, typeUser: string, userStatus: string) {
    const user = await api.put<{ status: number, message: string }>('/users', {
      username, useremail, typeUser, userStatus, id
    });

    return user.data;
  }

  static async list(page: number | string, searchTerm: string) {
    const user = await api.get<IResponseList>(`/users?page=${page}&searchTerm=${searchTerm}`);

    return user.data;
  }

  static async findById(userId: string) {
    const user = await api.get<IUser>(`/users/${userId}`);

    return user.data;
  }

  static async create(username: string, email: string, password: string, retryPassword: string, typeUser: string, userStatus: string) {
    const user = await api.post<{ id: string }>('/users', {
      username, email, password, retryPassword, typeUser, userStatus,
    });

    return user.data;
  }
}