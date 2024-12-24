import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { processSchema } from "@/schemas/process-schema";
import { maskDate } from "@/utils/maskDate";
import { maskHour } from "@/utils/maskHour";
import { maskPhoneNumber } from "@/utils/maskPhoneNumber";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { TitleForm } from "../TitleForm";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";



export function StepTwo() {
  const {
    control,
  } = useFormContext<z.infer<typeof processSchema>>();

  return (
    <>
      <TitleForm title="Vistoria" />
      <FormField
        control={control}
        name="date"
        render={({ field }) => (
          <FormItem className="lg:max-w-52 w-full">
            <FormLabel>Data</FormLabel>
            <FormControl>
              <Input
                maxLength={10}
                className="text-black/50" type="text"
                placeholder="__/__/____"
                {...field}
                value={maskDate(field.value)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="hour"
        render={({ field }) => (
          <FormItem className="lg:max-w-52 w-full">
            <FormLabel>Horário</FormLabel>
            <FormControl>
              <Input
                className="text-black/50"
                placeholder="__:__"
                maxLength={5}
                {...field}
                value={maskHour(field.value)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="phoneNumber"
        render={({ field }) => (
          <FormItem className="lg:max-w-[457px] w-full">
            <FormLabel>Telefone</FormLabel>
            <FormControl>
              <Input
                className="text-black/50"
                placeholder="(__) _____-____"
                {...field}
                maxLength={15}
                value={maskPhoneNumber(field.value)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Descrição</FormLabel>
            <FormControl>
              <Textarea className="h-40" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}