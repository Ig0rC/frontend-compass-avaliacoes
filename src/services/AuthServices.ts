import { api } from "@/lib/api";

interface ISignInDTO {
  email: string;
  password: string;
  keepLoggedIn: boolean;
}

interface ISignInResponse {
  accessToken: string;
}

export class AuthServices {
  static async signIn(data: ISignInDTO) {
    const response = await api.post<ISignInResponse>("/sign-in", data);

    return response.data;
  }
}
