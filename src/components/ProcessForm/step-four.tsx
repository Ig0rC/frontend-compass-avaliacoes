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
import { Loader } from "../loader";
import { TitleForm } from "../TitleForm";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";


export function StepFour() {
  const [isLoading, setIsLoading] = useState(true);
  const [usersSupplier, setUsersSupplier] = useState<IUser[]>([]);
  const {
    control,
    watch,
    setValue,
  } = useFormContext<z.infer<typeof processSchema>>();

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
    setValue('userSupplier.userId', value);

    if (value === 'others') {
      setValue('userSupplier.userEmail', '')
      setValue('userSupplier.userDoc', '')
      setValue('userSupplier.username', '');
      setValue('userSupplier.userPhoneNumber', '');
      setValue('userSupplier.userCreaOrCau', '');

      return;
    }

    const userSupllier = usersSupplier.find((userSupllier) => userSupllier.idUser === Number(value));

    if (userSupllier) {
      setValue('userSupplier.userEmail', userSupllier.userEmail)
      setValue('userSupplier.userDoc', userSupllier.userDoc);
      setValue('userSupplier.username', userSupllier.username);
      setValue('userSupplier.userPhoneNumber', '');
      setValue('userSupplier.userCreaOrCau', userSupllier.additionalInfo?.userAdditionalCreaOrCau || '');
    }
  }

  return (
    <>
      {isLoading && <Loader />}
      <TitleForm title="Prestador" />


      <FormField
        control={control}
        name="userSupplier.userId"
        render={({ field }) => (
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
        )}
      />

      {watch('userSupplier.userId') === 'others' && (
        <>
          <FormField
            control={control}
            name="userSupplier.username"
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
            name="userSupplier.userEmail"
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
            name="userSupplier.userPhoneNumber"
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
            name="userSupplier.userCreaOrCau"
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
            name="userSupplier.userDoc"
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
        name="kmValue"
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
        name="displacementValue"
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
        name="avaliationValue"
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
        name="galleryValue"
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
        name="propertyValue"
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
        name="customerValue"
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
        name="preReportValue"
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
    </>
  )
}