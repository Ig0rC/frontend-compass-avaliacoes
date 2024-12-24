import { AuthContext } from "@/context/AuthContext";
import { Loader2Icon } from "lucide-react";
import { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

export function GoogleCallback() {
  const { loadAccessToken } = useContext(AuthContext);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const code = queryParams.get('code');

  useEffect(() => {
    async function load() {
      try {
        if (code) {
          await loadAccessToken(code)
        }

        toast.success('Autenticado com sucesso!');
      } catch {
        toast.error('Erro ao acessar com o Google');
      }
    }

    load();
  }, [code])

  return (
    <div className="h-full w-full flex justify-center items-center">
      <Loader2Icon className="size-7 animate-spin" />
      <h1 className="text-3xl tracking-tighter semibold">Carregando...</h1>
    </div>
  )
}