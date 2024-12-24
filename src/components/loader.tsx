import { Loader2Icon } from "lucide-react";

export function Loader() {
  return (
    <div className="h-full w-full flex justify-center items-center fixed top-0 left-0 z-50 bg-black/70">
      <Loader2Icon className="size-7 animate-spin text-white" />
      <h1 className="text-3xl tracking-tighter semibold text-white">Carregando...</h1>
    </div>
  )
}
