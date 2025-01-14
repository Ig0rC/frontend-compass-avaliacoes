import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { IUsersSupplier } from "@/entities/i-user-supplier";
import { UserSupplierService } from "@/services/user-supplier-service";
import { Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { DatePickerWithRange } from "./ui/dateRangePicker";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

// const schema = z.object({
//   userInfoIdUser: z.string().optional(),
//   proposeDateRange: z.object({
//     from: z.date().transform(val => val || undefined), // from é required, mas pode ser undefined
//     to: z.date().optional()
//   }),
//   inspectionDateRange: z.object({
//     from: z.date().transform(val => val || undefined), // from é required, mas pode ser undefined
//     to: z.date().optional()
//   }),
//   proposeStatus: z.union([
//     z.array(z.string()),
//     z.string().transform((val) => [val]),
//     z.undefined(),
//   ]),
//   inspectionStatus: z.union([
//     z.array(z.string()),
//     z.string().transform((val) => [val]),
//     z.undefined(),
//   ]),
// });


interface FormValues {
  userInfoIdUser?: string;
  proposeDateRange: DateRange;
  inspectionDateRange: DateRange;
  proposeStatus: string[] | undefined;
  inspectionStatus: string[] | undefined;
}


interface ILoadParamsData {
  inspectionDateTo?: string;
  inspectionDateFrom?: string;
  proposeDateTo?: string;
  proposeDateFrom?: string;
  userInfoIdUser?: string;
  searchTerm?: string | undefined;
  page: number | string;
  proposeStatus?: string | string[]
  inspectionStatus?: string | string[];
}



interface Props {
  onLoadData(parmas: ILoadParamsData): Promise<void>
}


export function FilterListService({ onLoadData }: Props) {
  const [getQuery, setQuery] = useSearchParams();

  const [usersSupplier, setUsersSupplier] = useState<IUsersSupplier[]>([]);
  const form = useForm<FormValues>({
    defaultValues: {
      userInfoIdUser: getQuery.get('userInfoIdUser') || '',
      proposeDateRange: {
        from: getQuery.get('proposeDateFrom') ? new Date(getQuery.get('proposeDateFrom')!) : undefined,
        to: getQuery.get('proposeDateTo') ? new Date(getQuery.get('proposeDateTo')!) : undefined,
      },
      inspectionDateRange: {
        from: getQuery.get('inspectionDateFrom') ? new Date(getQuery.get('inspectionDateFrom')!) : undefined,
        to: getQuery.get('inspectionDateTo') ? new Date(getQuery.get('inspectionDateTo')!) : undefined,
      },
      proposeStatus: getQuery.get('proposeStatus') ? JSON.parse(getQuery.get('proposeStatus')!) : [],
      inspectionStatus: getQuery.get('inspectionStatus') ? JSON.parse(getQuery.get('inspectionStatus')!) : [],
    }
  });


  function handleFilterClear() {
    setQuery((prev) => {
      const params = new URLSearchParams(prev);

      // Salva os valores de 'page' e 'searchTerm'
      const page = params.get('page') || '1';
      const searchTerm = params.get('searchTerm');

      // Limpa todos os parâmetros
      params.delete('proposeStatus');
      params.delete('inspectionStatus');
      params.delete('userInfoIdUser');
      params.delete('inspectionDateFrom');
      params.delete('inspectionDateTo');
      params.delete('proposeDateFrom');
      params.delete('proposeDateTo');

      // Redefine apenas 'page' e 'searchTerm' se tiverem valor
      params.set('page', page);

      if (searchTerm) {
        params.set('searchTerm', searchTerm);
      }

      return params.toString();
    });

    form.reset({
      userInfoIdUser: '',
      proposeStatus: [],
      inspectionStatus: [],
    });

    onLoadData({
      page: 1,
      searchTerm: '',
    });
  }

  useEffect(() => {
    UserSupplierService.list().then(setUsersSupplier).catch(() => {
      toast.error('Não foi possível carregar prestadores!')
    });
  }, []);

  async function onSubmit(data: FormValues) {
    setQuery((prev) => {
      const params = new URLSearchParams(prev);

      // Definindo todos os parâmetros
      params.set('page', '1');
      params.set('searchTerm', prev.get('search') || '');

      if (data.inspectionDateRange?.from) {
        params.set('inspectionDateFrom', data.inspectionDateRange.from.toISOString());
      } else {
        params.delete('inspectionDateFrom');
      }

      if (data.inspectionDateRange?.to) {
        params.set('inspectionDateTo', data.inspectionDateRange.to.toISOString());
      } else {
        params.delete('inspectionDateTo');
      }

      if (data.proposeDateRange?.from) {
        params.set('proposeDateFrom', data.proposeDateRange.from.toISOString());
      } else {
        params.delete('proposeDateFrom');
      }

      if (data.proposeDateRange?.to) {
        params.set('proposeDateTo', data.proposeDateRange.to.toISOString());
      } else {
        params.delete('proposeDateTo');
      }

      if (data.proposeStatus) {
        params.set('proposeStatus', JSON.stringify(data.proposeStatus));
      } else {
        params.delete('proposeStatus');
      }

      if (data.userInfoIdUser) {
        params.set('userInfoIdUser', data.userInfoIdUser.toString());
      } else {
        params.delete('userInfoIdUser');
      }

      if (data.inspectionStatus) {
        params.set('inspectionStatus', JSON.stringify(data.inspectionStatus));
      } else {
        params.delete('inspectionStatus');
      }

      return params.toString();
    });

    await onLoadData({
      page: 1,
      searchTerm: '',
      inspectionDateFrom: data.inspectionDateRange?.from?.toISOString(),
      inspectionDateTo: data.inspectionDateRange?.to?.toISOString(),
      proposeDateFrom: data.proposeDateRange?.from?.toISOString(),
      proposeDateTo: data.proposeDateRange?.to?.toISOString(),
      proposeStatus: data.proposeStatus,
      userInfoIdUser: data.userInfoIdUser,
      inspectionStatus: data.inspectionStatus
    });
  }

  return (
    <Popover>
      <PopoverTrigger className="text-black underline">
        <Filter className="text-primary" size={32} />
      </PopoverTrigger>
      <PopoverContent className="w-[442px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

            <div className="flex gap-2 justify-between">
              <p>Filtro</p>
              <button type="submit" onClick={handleFilterClear} className="text-[#C38E73] text-sm hover:underline">
                Limpar
              </button>
            </div>

            <FormField
              control={form.control}
              name="userInfoIdUser"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prestador de Serviço</FormLabel>
                  <Select onValueChange={(value) => {
                    field.onChange(value)
                    form.handleSubmit(onSubmit)()
                  }} value={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um prestador" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {usersSupplier.map((userSupplier) => (
                        <SelectItem key={userSupplier.idUser} value={userSupplier.idUser.toString()}>{userSupplier.username}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="proposeDateRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Data prevista</FormLabel>
                  <FormControl >
                    <DatePickerWithRange
                      onChange={(value) => {
                        field.onChange(value)
                        form.handleSubmit(onSubmit)()
                      }}
                      value={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="inspectionDateRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Data de entrega</FormLabel>
                  <FormControl >
                    <DatePickerWithRange onChange={(value) => {
                      field.onChange(value)
                      form.handleSubmit(onSubmit)()
                    }}
                      value={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="inspectionStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Status</FormLabel>
                  <FormControl >
                    <ToggleGroup
                      onValueChange={(value) => {
                        field.onChange(value)
                        form.handleSubmit(onSubmit)()
                      }}

                      value={field.value}
                      className="flex flex-wrap gap-2 justify-start"
                      type="multiple"
                      variant="default"
                    >
                      <ToggleGroupItem value="P">Em Andamento</ToggleGroupItem>
                      <ToggleGroupItem value="B">Fazer Laudo</ToggleGroupItem>
                      <ToggleGroupItem value="R">Remarcar</ToggleGroupItem>
                      <ToggleGroupItem value="C">Cancelado</ToggleGroupItem>
                      <ToggleGroupItem value="E">Problemas docs</ToggleGroupItem>
                      <ToggleGroupItem value="F">Entregue</ToggleGroupItem>
                    </ToggleGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="proposeStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status do laudo</FormLabel>
                  <FormControl >
                    <ToggleGroup
                      onValueChange={(value) => {
                        field.onChange(value)
                        form.handleSubmit(onSubmit)()
                      }}
                      value={field.value} className="flex flex-wrap gap-2 justify-start" type="multiple">
                      <ToggleGroupItem value="A">Aceito</ToggleGroupItem>
                      <ToggleGroupItem value="R">Recusado</ToggleGroupItem>
                      <ToggleGroupItem value="C">Concluído</ToggleGroupItem>
                    </ToggleGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </form>
        </Form >
      </PopoverContent>
    </Popover>
  )
}