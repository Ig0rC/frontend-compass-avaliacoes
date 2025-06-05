import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { processSchema } from "@/schemas/create-process-schema";
import { colors } from "@/utils/colors";
import { maskPhoneNumber } from "@/utils/maskPhoneNumber";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { StepperNextButton, StepperPreviousButton } from ".";
import { TitleForm } from "../TitleForm";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useStepper } from "./useStepper";


export function StepThree() {
  const { nextStep } = useStepper();


  const {
    control,
    trigger
  } = useFormContext<z.infer<typeof processSchema>>();


  async function handleStepperNext() {
    const isValid = await trigger('clientSchema');


    if (isValid) {
      nextStep();
    }
  }




  return (
    <>
      <TitleForm title="Cliente" />

      <FormField
        control={control}
        name="clientSchema.clientName"
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
        name="clientSchema.phoneNumberClient"
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
        name="clientSchema.accompanyingName"
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
        name="clientSchema.priority"
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
        name="clientSchema.color"
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

      <div className="flex flex-col w-full mt-10 gap-[22px]">
        <StepperNextButton onClick={handleStepperNext} hidden />
        <StepperPreviousButton hidden />
      </div>
    </>
  )
}