"use client"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { ptBR } from "date-fns/locale"
import { SelectSingleEventHandler } from "react-day-picker"
import { date } from "zod"

interface Props {
  className?: string;
  value: Date;
  onSelect?: SelectSingleEventHandler | undefined;
}

export function DatePicker({ className, value, onSelect, }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            className,
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {value ? format(value, "dd '/' MM '/' y", { locale: ptBR }) : <span>Selecione</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onSelect}
          initialFocus
          numberOfMonths={1}
          locale={ptBR}
        />
      </PopoverContent>
    </Popover>
  )
}

