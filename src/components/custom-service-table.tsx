import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ProposeList } from "@/entities/ipropose";
import { cn } from "@/lib/utils";
import { updateProposeSchema } from "@/schemas/update-propose-schema";
import { formatDate } from "@/utils/formatDate";
import { getStatus } from "@/utils/getStatus";
import { maskCep } from "@/utils/maskCEP";
import { maskCurrency } from "@/utils/maskCurrency";
import { propertyTypes } from "@/utils/propertyTypes";
import { states } from "@/utils/states";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { LucideSave, Search, SquarePen } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "./ui/button";
import { DatePicker } from "./ui/date-picker";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Textarea } from "./ui/textarea";

interface CustomServiceTableProps {
  proposes: ProposeList[];
  onUpdatePropose: (selectedPropose: ProposeList, data: z.infer<typeof updateProposeSchema>) => Promise<void>;
  searchParams: string;
}

interface IGetCepResponse {
  logradouro: string;
  bairro: string;
  complemento: string;
  localidade: string;
  uf: string;
}

export function CustomServiceTable({ proposes, onUpdatePropose, searchParams }: CustomServiceTableProps) {
  const form = useForm<z.infer<typeof updateProposeSchema>>({
    mode: 'onBlur',
    resolver: zodResolver(updateProposeSchema)
  });

  const [selectedPropose, setSelectedPropose] = useState<ProposeList | null>(null);

  function handleSelectedProposeEdit(propose: ProposeList) {
    setSelectedPropose(propose);

    form.reset({
      idProposes: propose.idProposes,
      proposeCep: propose.proposeCep,
      proposeDescription: propose.proposeDescription,
      proposeAdditionalInfo: {
        ...propose.proposeAdditionalInfo,
        proposeAddKmValue: maskCurrency(propose.proposeAdditionalInfo.proposeAddKmValue, true),
        proposeAddAvaliationValue: maskCurrency(propose.proposeAdditionalInfo.proposeAddAvaliationValue, true),
        proposeAddDisplacementValue: maskCurrency(propose.proposeAdditionalInfo.proposeAddDisplacementValue, true),
      },
      proposeDate: propose.proposeDate,
      proposeResType: propose.proposeResType,
      proposeStatus: propose.proposeStatus
    });
  }

  async function onSubmit(data: z.infer<typeof updateProposeSchema>) {
    if (selectedPropose) {

      await onUpdatePropose({
        ...selectedPropose,
        proposeDate: `${data.proposeDate}T${selectedPropose.proposeDate.split('T')[1]}`
      }, data);

      setSelectedPropose(null);
    }
  };

  function handleCepChange(value: string) {
    if (value.length === 10) {
      axios.get<IGetCepResponse>(`https://viacep.com.br/ws/${value.replace(/\D/g, '')}/json/`)
        .then(({ data }) => {
          form.setValue('proposeAdditionalInfo.proposeAddStreet', data.logradouro);
          form.setValue('proposeAdditionalInfo.proposeAddNeighborhood', data.bairro);
          form.setValue('proposeAdditionalInfo.proposeAddComplement', data.complemento);
          form.setValue('proposeAdditionalInfo.proposeAddCity', data.localidade);
          form.setValue('proposeAdditionalInfo.proposeAddUf', data.uf);
        }).catch(() => {
          toast.error('Não foi possível buscar o endereço!')
        });
    }
    form.setValue('proposeCep', value)
  }


  return (
    <Form {...form}  >
      <form onSubmit={form.handleSubmit(onSubmit)} className="contents">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Processo</TableHead>
              <TableHead>Tipo de Imóvel</TableHead>
              <TableHead>Endereço</TableHead>
              <TableHead>Solicitação</TableHead>
              <TableHead>Vistoria</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Entrega</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>KM</TableHead>
              <TableHead>Desloca.</TableHead>
              <TableHead>Obs.</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {proposes.map((data) => {
              if (selectedPropose?.idProposes === data.idProposes) {
                return (
                  <TableRow key={data.idProposes}>
                    <TableCell>
                      <Link
                        state={{ searchParams }}
                        to={`edit-process/${data.idProposes}`}>
                        <Search size={21} className="text-primary" />
                      </Link>
                    </TableCell>

                    <TableCell>
                      <FormField
                        control={form.control}
                        name="proposeAdditionalInfo.proposesAddProposeNumber"
                        render={({ field, formState }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                className={cn(formState.errors.proposeAdditionalInfo?.proposesAddProposeNumber && 'border-red-500', 'max-w-[150px]')}
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>

                    <TableCell>
                      <FormField
                        control={form.control}
                        name="proposeResType"
                        render={({ field, formState }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className={formState.errors?.proposeResType && 'border-red-500'}
                              >
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>

                            <SelectContent>
                              {propertyTypes.map((propertyType) => (
                                <SelectItem key={propertyType} value={propertyType}>
                                  {propertyType.trim()}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </TableCell>

                    <TableCell>
                      <Popover>
                        <PopoverTrigger asChild className="w-full m-0 justify-start">
                          <Button className="m-0" variant="outline">{data.proposeAddress?.slice(0, 35)}...</Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[400px] bg-white">
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <h4 className="font-medium leading-none">Endereço</h4>
                            </div>
                            <div className="grid gap-2">
                              <FormField
                                control={form.control}
                                name="proposeCep"
                                render={({ field }) => (
                                  <FormItem className="grid grid-flow-row grid-cols-4 items-center" >
                                    <FormLabel>Cep</FormLabel>
                                    <FormControl className="col-span-3">
                                      <Input
                                        maxLength={10}
                                        className="text-black/50"
                                        placeholder="Cep" {...field}
                                        value={maskCep(field.value)}
                                        onChange={(e) => handleCepChange(e.target.value)}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="proposeAdditionalInfo.proposeAddCity"
                                render={({ field }) => (
                                  <FormItem className="grid grid-flow-row grid-cols-4 items-center" >
                                    <FormLabel>Estado</FormLabel>

                                    <FormControl className="col-span-3">
                                      <Input maxLength={20} className="text-black/50 w-full" placeholder="Cidade" {...field} value={field.value} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="proposeAdditionalInfo.proposeAddUf"
                                render={({ field }) => (
                                  <FormItem className="grid grid-flow-row grid-cols-4 items-center" >
                                    <FormLabel>Estado</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                      <FormControl className="col-span-3">
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
                                control={form.control}
                                name="proposeAdditionalInfo.proposeAddStreet"
                                render={({ field }) => (
                                  <FormItem className="grid grid-flow-row grid-cols-4 items-center" >
                                    <FormLabel>Rua</FormLabel>
                                    <FormControl className="col-span-3">
                                      <Input className="text-black/50" placeholder="Digite" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="proposeAdditionalInfo.proposeAddNeighborhood"
                                render={({ field }) => (
                                  <FormItem className="grid grid-flow-row grid-cols-4 items-center" >
                                    <FormLabel>Bairro</FormLabel>
                                    <FormControl className="col-span-3">
                                      <Input className="text-black/50" placeholder="Digite" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="proposeAdditionalInfo.proposeAddNumber"
                                render={({ field }) => (
                                  <FormItem className="grid grid-flow-row grid-cols-4 items-center" >
                                    <FormLabel>Número</FormLabel>
                                    <FormControl className="col-span-3">
                                      <Input className="text-black/50" placeholder="Digite" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="proposeAdditionalInfo.proposeAddComplement"
                                render={({ field }) => (
                                  <FormItem className="grid grid-flow-row grid-cols-4 items-center" >
                                    <FormLabel>Comple.</FormLabel>
                                    <FormControl className="col-span-3">
                                      <Input className="text-black/50" placeholder="Digite" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TableCell>

                    <TableCell>
                      {formatDate(data.proposeAdditionalInfo?.proposesAddSolicitationDate).date}
                    </TableCell>

                    <TableCell>

                      <FormField
                        control={form.control}
                        name="proposeDate"
                        render={({ field, formState }) => (
                          <FormControl>
                            <DatePicker
                              className={cn(formState.errors?.proposeDate && 'border-red-500', 'max-w-[160px]')}
                              value={new Date(field.value)}
                              onSelect={(date) => {
                                field.onChange(date?.toISOString())
                              }}
                            />
                          </FormControl>

                        )}
                      />
                    </TableCell>

                    <TableCell>
                      <FormField
                        control={form.control}
                        name="proposeStatus"
                        render={({ field, formState }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className={cn(formState.errors.proposeStatus && 'border-red-500')}>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>

                            <SelectContent>
                              <SelectItem value="N">Novo</SelectItem>
                              <SelectItem value="A">Aceito</SelectItem>
                              <SelectItem value="P">Em Andamento</SelectItem>
                              <SelectItem value="R">Recusado</SelectItem>
                              <SelectItem value="F">Finalizado</SelectItem>
                              <SelectItem value="X">Cancelado</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </TableCell>

                    <TableCell >
                      {formatDate(selectedPropose.inspections.inspectionDate).date}
                    </TableCell>

                    <TableCell >
                      <FormControl>
                        <FormField
                          control={form.control}
                          name="proposeAdditionalInfo.proposeAddAvaliationValue"
                          render={({ field, formState }) => (
                            <Input
                              {...field}
                              placeholder="R$"
                              onChange={(e) => field.onChange(maskCurrency(e.target.value))}
                              className={cn(formState.errors.proposeAdditionalInfo?.proposeAddAvaliationValue && 'border - red - 500', 'max-w-[130px]')}
                            />
                          )}
                        />
                      </FormControl>

                    </TableCell>

                    <TableCell>
                      <FormField
                        control={form.control}
                        name="proposeAdditionalInfo.proposeAddKmValue"
                        render={({ field, formState }) => (
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="R$ "
                              value={maskCurrency(field.value)}
                              onChange={(e) => field.onChange(maskCurrency(e.target.value))}
                              className={cn(formState.errors.proposeAdditionalInfo?.proposeAddKmValue && 'border - red - 500', 'max-w-[130px]')}
                            />
                          </FormControl>

                        )}
                      />
                    </TableCell>

                    <TableCell>
                      <FormField
                        control={form.control}
                        name="proposeAdditionalInfo.proposeAddDisplacementValue"
                        render={({ field, formState }) => (
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="R$ "
                              value={maskCurrency(field.value)}
                              onChange={(e) => field.onChange(maskCurrency(e.target.value))}
                              className={cn(formState.errors.proposeAdditionalInfo?.proposeAddDisplacementValue && 'border-red-500', 'max-w-[130px]')}
                            />
                          </FormControl>
                        )}
                      />
                    </TableCell>

                    <TableCell>
                      <FormField
                        control={form.control}
                        name="proposeDescription"
                        render={({ field, formState }) => (
                          <Popover>
                            <PopoverTrigger className="text-black underline">
                              <Button type="button" variant="outline">{data.proposeDescription?.slice(0, 10)}...</Button>
                            </PopoverTrigger>
                            <PopoverContent>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  className={formState.errors.proposeDescription && 'border-red-500'}
                                />
                              </FormControl>
                            </PopoverContent>
                          </Popover>
                        )}
                      />

                    </TableCell>

                    <TableCell>
                      <button
                        type="submit"
                      >
                        <LucideSave size={26} color="black" />
                      </button>
                    </TableCell>

                  </TableRow>
                )
              }

              return (
                <TableRow key={data.idProposes}>
                  <TableCell>
                    <Link state={{ searchParams }} to={`edit-process/${data.idProposes}`}>
                      <Search size={21} className="text-primary" />
                    </Link>
                  </TableCell>
                  <TableCell>
                    {data?.proposeAdditionalInfo?.proposesAddProposeNumber}
                  </TableCell>

                  <TableCell>
                    {data.proposeResType}
                  </TableCell>

                  <TableCell>
                    {data.proposeAddress?.slice(0, 46)}...
                  </TableCell>

                  <TableCell>
                    {formatDate(data.proposeAdditionalInfo?.proposesAddSolicitationDate).date}
                  </TableCell>

                  <TableCell>
                    {formatDate(data.proposeDate).date}
                  </TableCell>

                  <TableCell>
                    {getStatus(data.proposeStatus)}
                  </TableCell>

                  <TableCell >
                    {data.inspections?.inspectionDate ? formatDate(data.inspections?.inspectionDate).date : "Não Entregue"}
                  </TableCell>

                  <TableCell >
                    {maskCurrency(data.proposeAdditionalInfo?.proposeAddAvaliationValue || '', true)}
                  </TableCell>

                  <TableCell >
                    {maskCurrency(data.proposeAdditionalInfo?.proposeAddKmValue || '', true)}
                  </TableCell>

                  <TableCell>
                    {maskCurrency(data.proposeAdditionalInfo?.proposeAddDisplacementValue || '', true)}
                  </TableCell>

                  <TableCell>
                    <Popover>
                      <PopoverTrigger className="text-black underline">
                        Ver mais
                      </PopoverTrigger>
                      <PopoverContent>
                        <Label >Observações</Label>
                        <p className="mt-[24px]">{data.proposeDescription}</p>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                  <TableCell>

                    <SquarePen
                      size={26}
                      onClick={() => handleSelectedProposeEdit(data)}
                      className="cursor-pointer"
                    />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </form>
    </Form>
  )
}