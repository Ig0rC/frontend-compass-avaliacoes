import { Toaster } from "@/components/ui/sonner";
import AuthContextProvider from "@/context/AuthContext";
import { HeaderListLayout } from "@/layouts/HeaderListLayout";
import { EditProcess } from "@/pages/edit-process";
import { GoogleCallback } from "@/pages/google-callback";
import { ListServices } from "@/pages/list-services";
import { NewProcess } from "@/pages/new-process";
import { ProfileUser } from "@/pages/profile-user";
import SignIn from "@/pages/sign-in";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthGuard } from "./AuthGuard";



export default function Router() {

  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthGuard isPrivate={false} />}>
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/callbacks/google" element={<GoogleCallback />} />
          </Route>

          <Route element={<AuthGuard isPrivate />}>
            <Route path="/profile-user" element={<ProfileUser />} />
            <Route path="/new-process" element={<NewProcess />} />
            <Route path="/edit-process/:id" element={<EditProcess />} />

            <Route element={<HeaderListLayout />}>
              <Route path="/" element={<ListServices />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </AuthContextProvider>
  )
}