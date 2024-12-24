import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

interface AuthGuardProps {
  isPrivate: boolean;
}

export function AuthGuard({ isPrivate }: AuthGuardProps) {
  const { signedIn } = useContext(AuthContext);

  if (!signedIn && isPrivate) {
    return <Navigate to="/sign-in" replace />
  }

  if (signedIn && !isPrivate) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
