import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { processSchema } from "@/schemas/process-schema";
import { colors } from "@/utils/colors";
import { maskPhoneNumber } from "@/utils/maskPhoneNumber";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { TitleForm } from "../TitleForm";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";


export function StepThree() {
  const {
    control,
  } = useFormContext<z.infer<typeof processSchema>>();

  return (
    <>
      <TitleForm title="Cliente" />

      <FormField
        control={control}
        name="clientName"
        render={({ field }) => (
          <FormItem className="lg:max-w-[457px] w-full">
            <FormLabel>Nome do cliente</FormLabel>
            <FormControl>
              <Input
                className="text-black/50" type="text"
                placeholder="Digite o nome do cliente" {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="phoneNumberClient"
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
        name="accompanyingName"
        render={({ field }) => (
          <FormItem className="lg:max-w-[457px] w-full">
            <FormLabel>Nome do acompanhante</FormLabel>
            <FormControl>
              <Input
                className="text-black/50"
                placeholder="Digite o nome do acompanhante"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />


      <FormField
        control={control}
        name="priority"
        render={({ field }) => (
          <FormItem className="lg:max-w-[457px] w-full">
            <FormLabel>Prioridade</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
              </FormControl>

              <SelectContent>
                <SelectItem value="1">
                  Sim
                </SelectItem>
                <SelectItem value="0">
                  Não
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />


      <FormField
        control={control}
        name="color"
        render={({ field }) => (
          <FormItem className="lg:max-w-[457px] w-full">
            <FormLabel>Cor</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
              </FormControl>

              <SelectContent>
                {colors.map((color) => (
                  <SelectItem key={color.id} value={color.id}>
                    <div className="w-full flex gap-2">
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{
                          backgroundColor: color.backgroundColor,
                          borderColor: color.borderColor,
                          borderWidth: '1px',
                          borderStyle: 'solid'
                        }}
                      ></div>
                      <p>{color.description}</p>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}