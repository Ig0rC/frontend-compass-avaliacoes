import { Toaster } from "@/components/ui/sonner";
import AuthContextProvider from "@/context/AuthContext";
import { HeaderListLayout } from "@/layouts/HeaderListLayout";
import { EditProcess } from "@/pages/edit-process";
import { EditUser } from "@/pages/edit-user";
import { ForgotPassword } from "@/pages/forgot-password";
import { GoogleCallback } from "@/pages/google-callback";
import { ListServices } from "@/pages/list-services";
import { NewProcess } from "@/pages/new-process";
import { NewUser } from "@/pages/new-user";
import { ProfileUser } from "@/pages/profile-user";
import { ResetPassword } from "@/pages/reset-password";
import SignIn from "@/pages/sign-in";
import { UserManegement } from "@/pages/user-manegement";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthGuard } from "./AuthGuard";


const queryClient = new QueryClient();

export default function Router() {

  return (
    <AuthContextProvider>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route element={<AuthGuard isPrivate={false} />}>
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/callbacks/google" element={<GoogleCallback />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
            </Route>

            <Route element={<AuthGuard isPrivate />}>
              <Route path="/profile-user" element={<ProfileUser />} />
              <Route path="/new-process" element={<NewProcess />} />
              <Route path="/edit-process/:id" element={<EditProcess />} />
              <Route path="/edit-user/:id" element={<EditUser />} />
              <Route path="/new-user" element={<NewUser />} />

              <Route element={<HeaderListLayout />}>
                <Route path="/user-manegement" element={<UserManegement />} />
                <Route path="/" element={<ListServices />} />
              </Route>
            </Route>
          </Routes>
        </QueryClientProvider>
      </BrowserRouter>
      <Toaster />
    </AuthContextProvider>
  );
}
