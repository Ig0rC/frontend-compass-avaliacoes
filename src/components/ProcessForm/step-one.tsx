import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { processSchema } from "@/schemas/create-process-schema"
import { maskCep } from "@/utils/maskCEP"
import { propertyTypes } from "@/utils/propertyTypes"
import { states } from "@/utils/states"
import axios from "axios"
import { useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { StepperNextButton } from "."
import { TitleForm } from "../TitleForm"
import { Loader } from "../loader"
import { useStepper } from "./useStepper"



interface IGetCepResponse {
  logradouro: string;
  bairro: string;
  complemento: string;
  localidade: string;
  uf: string;
}

export function StepOne() {
  const { nextStep } = useStepper();
  const [isLoading, setIsLoading] = useState(false);
  const {
    setValue,
    control,
    watch,
    trigger,
    formState
  } = useFormContext<z.infer<typeof processSchema>>();
  const cep = watch('basicInfoSchema.addressSchema.cep')
  console.log(cep, cep?.length === 10, formState.isDirty)
  useEffect(() => {
    if (cep && cep?.length === 10 && formState.isDirty) {
      setIsLoading(true);
      axios.get<IGetCepResponse>(`https://viacep.com.br/ws/${cep.replace(/\D/g, '')}/json/`)
        .then(({ data }) => {
          setValue('basicInfoSchema.addressSchema.street', data.logradouro);
          setValue('basicInfoSchema.addressSchema.neighborhood', data.bairro);
          setValue('basicInfoSchema.addressSchema.complement', data.complemento);
          setValue('basicInfoSchema.addressSchema.city', data.localidade);
          setValue('basicInfoSchema.addressSchema.uf', data.uf);
        }).catch(() => {
          toast.error('Não foi possível buscar o endereço!')
        }).finally(() => setIsLoading(false));
    }
  }, [cep, setValue]);

  async function handleStepperNext() {
    const isValid = await trigger('basicInfoSchema');

    if (isValid) {
      nextStep();
    }
  }


  return (
    <>
      {isLoading && <Loader />}
      <TitleForm title="Processo" />

      <FormField
        control={control}
        name="basicInfoSchema.title"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Título</FormLabel>
            <FormControl>
              <Input className="text-black/50" type="text" placeholder="Digite" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="basicInfoSchema.processNumber"
        render={({ field }) => (
          <FormItem className="lg:max-w-[457px] w-full">
            <FormLabel>Número do processo</FormLabel>
            <FormControl>
              <Input className="text-black/50" placeholder="Digite" {...field} value={field.value} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="basicInfoSchema.resType"
        render={({ field }) => (
          <FormItem className="lg:max-w-[457px] w-full">
            <FormLabel>Tipo de imóvel</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {propertyTypes.map((propertyType) => (
                  <SelectItem key={propertyType} value={propertyType}>{propertyType}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <TitleForm title="Endereço" />

      <FormField
        control={control}
        name="basicInfoSchema.addressSchema.cep"
        render={({ field }) => (
          <FormItem className="lg:max-w-56">
            <FormLabel>Cep</FormLabel>
            <FormControl>
              <Input maxLength={10} className="text-black/50" placeholder="Cep" {...field} value={maskCep(field.value)} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />


      <FormField
        control={control}
        name="basicInfoSchema.addressSchema.city"
        render={({ field }) => (
          <FormItem className="lg:max-w-[342px] w-full" >
            <FormLabel>Cidade</FormLabel>
            <FormControl>
              <Input maxLength={20} className="text-black/50" placeholder="Cidade" {...field} value={field.value} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />


      <FormField
        control={control}
        name="basicInfoSchema.addressSchema.uf"
        render={({ field }) => (
          <FormItem className="lg:max-w-[342px] w-full">
            <FormLabel>Estado</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state.uf} value={state.uf}>{`${state.state} - ${state.uf}`}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="basicInfoSchema.addressSchema.street"
        render={({ field }) => (
          <FormItem className="lg:max-w-[703px] w-full">
            <FormLabel>Rua</FormLabel>
            <FormControl>
              <Input className="text-black/50" placeholder="Digite" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="basicInfoSchema.addressSchema.number"
        render={({ field }) => (
          <FormItem className="lg:max-w-[209px] w-full">
            <FormLabel>Número</FormLabel>
            <FormControl>
              <Input className="text-black/50" placeholder="Digite" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="basicInfoSchema.addressSchema.neighborhood"
        render={({ field }) => (
          <FormItem className="lg:flex-1">
            <FormLabel>Bairro</FormLabel>
            <FormControl>
              <Input className="text-black/50" placeholder="Digite" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="basicInfoSchema.addressSchema.complement"
        render={({ field }) => (
          <FormItem className="lg:flex-1">
            <FormLabel>Complemento</FormLabel>
            <FormControl>
              <Input className="text-black/50" placeholder="Digite" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />


      <div className="flex flex-col w-full mt-10 gap-[22px]">
        <StepperNextButton onClick={handleStepperNext} hidden />
      </div>
    </>
  )
}