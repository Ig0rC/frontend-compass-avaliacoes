import { Search } from "lucide-react";
import { InputHTMLAttributes } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type Props = InputHTMLAttributes<HTMLInputElement>;


export function InputSearch(props: Props) {
  const [getQuery] = useSearchParams();


  return (
    <div className="flex-1">
      <Label>Pesquisar</Label>
      <div className="relative h-[46px]">
        <Search
          className="size-8 absolute left-4 inset-y-0 my-auto"
          color="#C4C5CC"
        />
        <Input
          {...props}
          placeholder="Pesquisar"
          value={getQuery.get("search") ?? ''}
          className="h-[46px] pl-[75.25px]"
        />
      </div>
    </div>
  )
}

