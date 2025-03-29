import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { IUser } from "@/entities/i-user-supplier";
import { IFilters, IFiltersChange } from "@/hooks/use-Query";
import { UserSupplierService } from "@/services/user-supplier-service";
import { Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { useForm } from "react-hook-form";
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


interface Props {
  onFilterChange(filters: IFiltersChange): void
  onClearFilter(): void;
  filters: IFilters | null;
}


export function FilterListService({ onFilterChange, onClearFilter, filters }: Props) {
  console.log(filters)
  const [usersSupplier, setUsersSupplier] = useState<IUser[]>([]);
  const form = useForm<FormValues>({
    defaultValues: {
      userInfoIdUser: filters?.userInfoIdUser ?? '',
      proposeDateRange: {
        from: filters?.proposeDateFrom ? new Date(filters.proposeDateFrom) : undefined,
        to: filters?.proposeDateTo ? new Date(filters.proposeDateTo) : undefined,
      },
      inspectionDateRange: {
        from: filters?.inspectionDateFrom ? new Date(filters.inspectionDateFrom) : undefined,
        to: filters?.inspectionDateTo ? new Date(filters.inspectionDateTo) : undefined,
      },
      proposeStatus: filters?.proposeStatus ?? [],
      inspectionStatus: filters?.inspectionStatus ?? [],
    }
  });

  function handleFilterClear() {
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
    onClearFilter();
  }

  useEffect(() => {
    UserSupplierService.list().then(setUsersSupplier).catch(() => {
      toast.error('Não foi possível carregar prestadores!')
    });
  }, []);

  async function onSubmit(data: FormValues) {
    const filters = {
      inspectionDateFrom: data.inspectionDateRange?.from,
      inspectionDateTo: data.inspectionDateRange?.to,
      proposeDateFrom: data.proposeDateRange?.from,
      proposeDateTo: data.proposeDateRange?.to,
      proposeStatus: data.proposeStatus,
      userInfoIdUser: data.userInfoIdUser,
      inspectionStatus: data.inspectionStatus
    }

    onFilterChange(filters)
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
              <button type="button" onClick={handleFilterClear} className="text-[#C38E73] text-sm hover:underline">
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