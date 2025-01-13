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
import { zodResolver } from "@hookform/resolvers/zod";
import { Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { DatePickerWithRange } from "./ui/dateRangePicker";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";


const schema = z.object({
  userInfoIdUser: z.string().optional(),
  proposeDateRange: z.object({
    from: z.date().optional(),
    to: z.date().optional()
  }).optional(),
  inspectionDateRange: z.object({
    from: z.date().optional(),
    to: z.date().optional()
  }).optional(),
  proposeStatus: z.union([
    z.array(z.string()),
    z.string().transform((val) => [val]),
    z.undefined(),
  ]),
  inspectionStatus: z.union([
    z.array(z.string()),
    z.string().transform((val) => [val]),
    z.undefined(),
  ]),
});


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
  const [usersSupplier, setUsersSupplier] = useState<IUsersSupplier[]>([]);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      userInfoIdUser: '',
      proposeDateRange: {
        from: undefined,
        to: undefined,
      },
      inspectionDateRange: {
        from: undefined,
        to: undefined,
      },
      proposeStatus: undefined,
      inspectionStatus: undefined,
    }
  });


  function handleFilterClear() {
    form.reset({
      proposeStatus: [],
      inspectionStatus: [],
    })
  }

  useEffect(() => {
    UserSupplierService.list().then(setUsersSupplier).catch(() => {
      toast.error('Não foi possível carregar prestadores!')
    });
  }, []);

  async function onSubmit(data: z.infer<typeof schema>) {
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