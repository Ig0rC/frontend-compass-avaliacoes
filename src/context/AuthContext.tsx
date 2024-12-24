import { api } from "@/lib/api";
import { AuthServices } from "@/services/AuthServices";
import qs from "qs";
import { createContext, useCallback, useState } from "react";

interface IAuthContext {
  signedIn: boolean;
  signInWithGogle(): void;
  signOut(): void;
  signIn(email: string, password: string, keepLoggedIn: boolean): Promise<void>;
  loadAccessToken(code: string): Promise<void>;
}

const AuthContext = createContext({} as IAuthContext);

interface IAuthContextProviderProps {
  children: React.ReactNode;
}

export default function AuthContextProvider({ children }: IAuthContextProviderProps) {
  const [signedIn, setSignedIn] = useState(() => !!localStorage.getItem("accessToken"));

  const signInWithGogle = useCallback(() => {
    const baseURL = 'https://accounts.google.com/o/oauth2/v2/auth';

    const options = qs.stringify({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      redirect_uri: 'http://localhost:5173/callbacks/google',
      response_type: 'code',
      scope: 'email profile'
    });

    window.location.href = `${baseURL}?${options}`
  }, []);

  const signOut = useCallback(() => {
    localStorage.clear();

    setSignedIn(false);
  }, []);

  const loadAccessToken = useCallback(async (code: string) => {
    const { data } = await api.post<{ accessToken: string }>('/auth/google', {
      code,
    });

    localStorage.setItem("accessToken", data.accessToken);

    setSignedIn(true);
  }, [])

  const signIn = useCallback(async (email: string, password: string, keepLoggedIn: boolean) => {
    const { accessToken } = await AuthServices.signIn({ email, password, keepLoggedIn });

    localStorage.setItem("accessToken", accessToken);

    setSignedIn(true);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signedIn,
        loadAccessToken,
        signIn,
        signOut,
        signInWithGogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}


export { AuthContext };
