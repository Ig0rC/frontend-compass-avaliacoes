import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { IUser } from "@/entities/i-user-supplier";
import { processSchema } from "@/schemas/process-schema";
import { UserSupplierService } from "@/services/user-supplier-service";
import { maskCurrency } from "@/utils/maskCurrency";
import { maskPhoneNumber } from "@/utils/maskPhoneNumber";
import { useCallback, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { StepperNextButton, StepperPreviousButton } from ".";
import { Loader } from "../loader";
import { TitleForm } from "../TitleForm";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useStepper } from "./useStepper";


export function StepFour() {
  const { nextStep } = useStepper();

  const [isLoading, setIsLoading] = useState(true);
  const [usersSupplier, setUsersSupplier] = useState<IUser[]>([]);
  const {
    control,
    watch,
    trigger,
    setValue,
  } = useFormContext<z.infer<typeof processSchema>>();

  async function handleStepperNext() {
    const isValid = await trigger('valuesSchema');

    if (isValid) {
      nextStep();
    }
  }

  const loadUserSupplier = useCallback(async () => {
    try {
      const data = await UserSupplierService.list();

      setUsersSupplier(data);
    } catch {
      toast.error('Erro a carregar prestadores de serviços');
    } finally {
      setIsLoading(false)
    }
  }, []);

  useEffect(() => {
    loadUserSupplier()
  }, [loadUserSupplier]);



  function handleUserSupplierIdChange(value: string) {
    if (value === 'others') {
      setValue('valuesSchema.userSupplierSchema.userEmail', '')
      setValue('valuesSchema.userSupplierSchema.userDoc', '')
      setValue('valuesSchema.userSupplierSchema.username', '');
      setValue('valuesSchema.userSupplierSchema.userPhoneNumber', '');
      setValue('valuesSchema.userSupplierSchema.userCreaOrCau', '');
      setValue('valuesSchema.userSupplierSchema.userId', 'others')


      return;
    }

    const userSupllier = usersSupplier.find((userSupllier) => userSupllier.idUser === Number(value));

    if (userSupllier) {
      setValue('valuesSchema.userSupplierSchema.userId', userSupllier.idUser.toString())
      setValue('valuesSchema.userSupplierSchema.userEmail', userSupllier.userEmail)
      setValue('valuesSchema.userSupplierSchema.userDoc', userSupllier.userDoc);
      setValue('valuesSchema.userSupplierSchema.username', userSupllier.username);
      setValue('valuesSchema.userSupplierSchema.userPhoneNumber', '');
      setValue('valuesSchema.userSupplierSchema.userCreaOrCau', userSupllier.additionalInfo?.userAdditionalCreaOrCau || '');
    }
  }

  return (
    <>
      {isLoading && <Loader />}
      <TitleForm title="Prestador" />


      <FormField
        control={control}
        name="valuesSchema.userSupplierSchema.userId"
        render={({ field }) => {
          return (
            (
              <FormItem className="w-full">
                <FormLabel>Selecionar Prestador</FormLabel>
                <Select onValueChange={handleUserSupplierIdChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    <SelectItem value="others">
                      Outro
                    </SelectItem>
                    {usersSupplier.map((userSupplier) => (
                      <SelectItem key={userSupplier.idUser} value={userSupplier.idUser.toString()}>
                        {userSupplier.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )
          )
        }}
      />

      {watch('valuesSchema.userSupplierSchema.userId') === 'others' && (
        <>
          <FormField
            control={control}
            name="valuesSchema.userSupplierSchema.username"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Nome completo</FormLabel>
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
            name="valuesSchema.userSupplierSchema.userEmail"
            render={({ field }) => (
              <FormItem className="lg:max-w-[457px] w-full">
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input
                    className="text-black/50"
                    placeholder="Digite o seu e-mail" {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="valuesSchema.userSupplierSchema.userPhoneNumber"
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
            name="valuesSchema.userSupplierSchema.userCreaOrCau"
            render={({ field }) => (
              <FormItem className="lg:max-w-[457px] w-full">
                <FormLabel>Crea ou Cau</FormLabel>
                <FormControl>
                  <Input
                    maxLength={11}
                    className="text-black/50"
                    placeholder="Digite CREA ou CAU"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="valuesSchema.userSupplierSchema.userDoc"
            render={({ field }) => (
              <FormItem className="lg:max-w-[457px] w-full">
                <FormLabel>RG ou CPF</FormLabel>
                <FormControl>
                  <Input
                    className="text-black/50"
                    placeholder="Digite RG ou CPF"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}

      <TitleForm title="Valor do Serviço" />

      <FormField
        control={control}
        name="valuesSchema.kmValue"
        render={({ field }) => (
          <FormItem className="lg:max-w-[457px] w-full">
            <FormLabel>Valor de KM</FormLabel>
            <FormControl>
              <Input
                className="text-black/50"
                placeholder="R$"
                {...field}
                maxLength={16}
                onChange={(e) => field.onChange(maskCurrency(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="valuesSchema.displacementValue"
        render={({ field }) => (
          <FormItem className="lg:max-w-[457px] w-full">
            <FormLabel>Valor de deslocamento</FormLabel>
            <FormControl>
              <Input
                className="text-black/50"
                placeholder="R$"
                {...field}
                maxLength={16}
                onChange={(e) => field.onChange(maskCurrency(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="valuesSchema.avaliationValue"
        render={({ field }) => (
          <FormItem className="lg:max-w-[457px] w-full">
            <FormLabel>Valor de Avaliação</FormLabel>
            <FormControl>
              <Input
                className="text-black/50"
                placeholder="R$"
                {...field}
                maxLength={16}
                onChange={(e) => field.onChange(maskCurrency(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="valuesSchema.galleryValue"
        render={({ field }) => (
          <FormItem className="lg:max-w-[457px] w-full">
            <FormLabel>Valor da Galleria</FormLabel>
            <FormControl>
              <Input
                className="text-black/50"
                placeholder="R$"
                {...field}
                maxLength={16}
                onChange={(e) => field.onChange(maskCurrency(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="valuesSchema.propertyValue"
        render={({ field }) => (
          <FormItem className="lg:max-w-[457px] w-full">
            <FormLabel>Valor da estimado do imóvel</FormLabel>
            <FormControl>
              <Input
                className="text-black/50"
                placeholder="R$"
                {...field}
                maxLength={16}
                onChange={(e) => field.onChange(maskCurrency(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="valuesSchema.customerValue"
        render={({ field }) => (
          <FormItem className="lg:max-w-[457px] w-full">
            <FormLabel>Valor que o cliente precisa</FormLabel>
            <FormControl>
              <Input
                className="text-black/50"
                placeholder="R$"
                {...field}
                maxLength={16}
                onChange={(e) => field.onChange(maskCurrency(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="valuesSchema.preReportValue"
        render={({ field }) => (
          <FormItem className="lg:max-w-[457px] w-full">
            <FormLabel>Valor de pré-loudo</FormLabel>
            <FormControl>
              <Input
                className="text-black/50"
                placeholder="R$"
                {...field}
                maxLength={16}
                onChange={(e) => field.onChange(maskCurrency(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />


      <div className="flex flex-col w-full mt-10 gap-[22px]">
        <StepperNextButton onClick={handleStepperNext} />
        <StepperPreviousButton />
      </div>
    </>
  )
}