import { api } from "@/lib/api";
import { AuthServices } from "@/services/AuthServices";
import qs from "qs";
import { createContext, useCallback, useLayoutEffect, useState } from "react";
import { toast } from "sonner";

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
  const [signedIn, setSignedIn] = useState(() => !!localStorage.getItem("user"));

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

  useLayoutEffect(() => {
    const interceptorId = api.interceptors.request.use((config) => {
      const loadUser = localStorage.getItem("user");

      if (loadUser) {
        const user = JSON.parse(loadUser);
        config.headers.Authorization = `Bearer ${user.accessToken}`;
      }

      return config;
    });


    return () => {
      api.interceptors.request.eject(interceptorId);
    }
  }, []);

  useLayoutEffect(() => {
    const interceptorId = api.interceptors.response.use(
      response => response,
      error => {
        if (error.response.status === 401) {
          localStorage.removeItem("user");
          setSignedIn(false);
          toast.warning('Sessão expirada. Por favor, entre novamente.');
          return Promise.reject(error)
        }

        if (error.response.status === 400) {
          console.log(error.response.data)
          toast.error(error.response.data?.error || error.response.data || 'Ops, aconteceu algum erro!');
        }

        return Promise.reject(error)
      }
    )

    return () => {
      api.interceptors.response.eject(interceptorId);
    }
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
    const response = await AuthServices.signIn({ email, password, keepLoggedIn });
    const stringfy = JSON.stringify(response);
    localStorage.setItem("user", stringfy);
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
