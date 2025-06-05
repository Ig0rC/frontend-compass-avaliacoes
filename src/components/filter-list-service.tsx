import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { IUser } from "@/entities/i-user-supplier";
import { UserSupplierService } from "@/services/user-supplier-service";
import { safeParseJSON } from "@/utils/safeParseJSON";
import { Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { DatePickerWithRange } from "./ui/dateRangePicker";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

interface FormValues {
  userInfoIdUser?: string;
  proposeDateRange: DateRange;
  inspectionDateRange: DateRange;
  proposeStatus: string[];
  inspectionStatus: string[];
}


export function FilterListService() {
  const [usersSupplier, setUsersSupplier] = useState<IUser[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const userInfoIdUser = searchParams.get('userInfoIdUser');
  const inspectionStatus = searchParams.get('inspectionStatus');
  const proposeStatus = searchParams.get('proposeStatus');

  const proposeDateFrom = searchParams.get('proposeDateFrom')
  const proposeDateTo = searchParams.get('proposeDateTo');
  const inspectionDateFrom = searchParams.get('inspectionDateFrom');
  const inspectionDateTo = searchParams.get('inspectionDateTo');


  const form = useForm<FormValues>({
    defaultValues: {
      userInfoIdUser: userInfoIdUser ?? '',
      proposeDateRange: {
        from: safeParseJSON(proposeDateFrom, undefined),
        to: safeParseJSON(proposeDateTo, undefined),
      },
      inspectionDateRange: {
        from: safeParseJSON(inspectionDateFrom, undefined),
        to: safeParseJSON(inspectionDateTo, undefined),
      },
      proposeStatus: safeParseJSON<string[]>(proposeStatus, []),
      inspectionStatus: safeParseJSON<string[]>(inspectionStatus, []),
    }
  });



  useEffect(() => {
    UserSupplierService.list().then(setUsersSupplier).catch(() => {
      toast.error('Não foi possível carregar prestadores!')
    });
  }, []);

  function handleFilter(data: FormValues) {
    setSearchParams(prevState => {
      if (data.userInfoIdUser) {
        prevState.set('userInfoIdUser', data.userInfoIdUser)
      } else {
        prevState.delete('userInfoIdUser')
      }

      if (data.proposeDateRange?.from) {
        prevState.set('proposeDateFrom', JSON.stringify(data.proposeDateRange?.from))
      } else {
        prevState.delete('proposeDateFrom')
      }

      if (data.proposeDateRange?.to) {
        prevState.set('proposeDateTo', JSON.stringify(data.proposeDateRange?.to))
      } else {
        prevState.delete('proposeDateTo')
      }

      if (data.inspectionDateRange?.from) {
        prevState.set('inspectionDateFrom', JSON.stringify(data.inspectionDateRange?.from))
      } else {
        prevState.delete('inspectionDateFrom')
      }

      if (data.inspectionDateRange?.to) {
        prevState.set('inspectionDateTo', JSON.stringify(data.inspectionDateRange?.to))
      } else {
        prevState.delete('inspectionDateTo')
      }

      if (data?.inspectionStatus.length > 0) {
        prevState.set('inspectionStatus', JSON.stringify(data.inspectionStatus))
      } else {
        prevState.delete('inspectionStatus')
      }


      if (data?.proposeStatus.length > 0) {
        prevState.set('proposeStatus', JSON.stringify(data.proposeStatus))
      } else {
        prevState.delete('proposeStatus')
      }

      prevState.set('page', '1')

      return prevState;
    })
  }


  function handleClearFilters() {
    form.reset({
      userInfoIdUser: '',
      proposeDateRange: {
        from: undefined,
        to: undefined,
      },
      inspectionDateRange: {
        from: undefined,
        to: undefined,
      },
      inspectionStatus: [],
      proposeStatus: [],
    });


    setSearchParams(prevState => {
      prevState.delete('userInfoIdUser')
      prevState.delete('proposeDateFrom')
      prevState.delete('proposeDateTo')
      prevState.delete('inspectionDateFrom')
      prevState.delete('inspectionDateTo')
      prevState.delete('proposeStatus')
      prevState.delete('inspectionStatus')

      return prevState;
    });
  }



  return (
    <Popover>
      <PopoverTrigger className="text-black underline">
        <Filter className="text-primary" size={32} />
      </PopoverTrigger>
      <PopoverContent className="w-[442px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFilter)} className="space-y-5">

            <div className="flex gap-2 justify-between">
              <p>Filtro</p>
              <button type="button" onClick={handleClearFilters} className="text-[#C38E73] text-sm hover:underline">
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
                    form.handleSubmit(handleFilter)()
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
                        form.handleSubmit(handleFilter)()
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
                      form.handleSubmit(handleFilter)()
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
                        form.handleSubmit(handleFilter)()
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
                        form.handleSubmit(handleFilter)()
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