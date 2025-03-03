import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FileSpreadsheet, SquareKanban } from "lucide-react";
import { useState } from "react";

interface Props {
  toggleView: string;
  onToggleViewChange: (value: "L" | "K") => void;
}


export function ViewMode({ toggleView, onToggleViewChange }: Props) {
  const [user] = useState(JSON.parse(localStorage.getItem('user')));

  return (
    <ToggleGroup value={toggleView} onValueChange={onToggleViewChange} variant="search" size="search" type="single">
      <ToggleGroupItem className="rounded-sm " value="L">
        <FileSpreadsheet size={32} color="black" />
      </ToggleGroupItem>
      {!(user.role === 'F') && (
        <ToggleGroupItem className="rounded-sm " value="K">
          <SquareKanban size={32} color="black" />
        </ToggleGroupItem>
      )}
    </ToggleGroup>
  )
}

