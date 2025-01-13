import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { IPropose } from "@/entities/ipropose";
import { cn } from "@/lib/utils";
import { processSchema } from "@/schemas/process-schema";
import { ProposeMapper } from "@/services/mappers/propose-mapper";
import { formatDate } from "@/utils/formatDate";
import { getStatus } from "@/utils/getStatus";
import { maskCep } from "@/utils/maskCEP";
import { maskCurrency } from "@/utils/maskCurrency";
import { maskDate } from "@/utils/maskDate";
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
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Textarea } from "./ui/textarea";

interface CustomServiceTableProps {
  proposes: IPropose[];
  onUpdatePropose: (selectedPropose: IPropose, data: z.infer<typeof processSchema>) => Promise<void>;
}

interface IGetCepResponse {
  logradouro: string;
  bairro: string;
  complemento: string;
  localidade: string;
  uf: string;
}

export function CustomServiceTable({ proposes, onUpdatePropose }: CustomServiceTableProps) {
  const form = useForm<z.infer<typeof processSchema>>({
    resolver: zodResolver(processSchema)
  });
  const [selectedPropose, setSelectedPropose] = useState<IPropose | null>(null);

  function handleSelectedProposeEdit(propose: IPropose) {
    setSelectedPropose(propose);

    form.reset(ProposeMapper.toDomain(propose));
  }

  async function onSubmit(data: z.infer<typeof processSchema>) {
    if (selectedPropose) {

      await onUpdatePropose(selectedPropose, data);

      setSelectedPropose(null);
    }
  };

  function handleCepChange(value: string) {
    form.setValue('cep', value);
    if (value.length === 10) {
      axios.get<IGetCepResponse>(`https://viacep.com.br/ws/${value.replace(/\D/g, '')}/json/`)
        .then(({ data }) => {
          form.setValue('street', data.logradouro);
          form.setValue('neighborhood', data.bairro);
          form.setValue('complement', data.complemento);
          form.setValue('city', data.localidade);
          form.setValue('uf', data.uf);
        }).catch((error) => {
          console.log(error)
          toast.error('Não foi possível buscar o endereço!')
        });
    }
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
                      <Link to={`edit-process/${data.idProposes}`}>
                        <Search size={21} className="text-primary" />
                      </Link>
                    </TableCell>

                    <TableCell>
                      <FormField
                        control={form.control}
                        name="processNumber"
                        render={({ field, formState }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                className={formState.errors.processNumber && 'border-red-500'}
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
                        name="resType"
                        render={({ field, formState }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className={formState.errors.resType && 'border-red-500'}
                              >
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {propertyTypes.map((propertyType) => (
                                <SelectItem key={propertyType} value={propertyType}>{propertyType}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </TableCell>

                    <TableCell>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline">{data.proposeAddress.slice(0, 22)}...</Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[400px] bg-white">
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <h4 className="font-medium leading-none">Endereço</h4>
                            </div>
                            <div className="grid gap-2">
                              <FormField
                                control={form.control}
                                name="cep"
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
                                name="city"
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
                                name="uf"
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
                                name="street"
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
                                name="neighborhood"
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
                                name="number"
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
                                name="complement"
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
                      <FormField
                        control={form.control}
                        name="proposeSolicitationDate"
                        render={({ field, formState }) => (
                          <FormControl>
                            <Input
                              {...field}
                              maxLength={10}
                              className={formState.errors.proposeSolicitationDate && 'border-red-500'}
                              value={maskDate(field.value || '')}
                            />
                          </FormControl>
                        )}
                      />

                    </TableCell>

                    <TableCell>

                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field, formState }) => (
                          <FormControl>
                            <Input
                              placeholder="__/__/____"
                              maxLength={10}
                              className={formState.errors.date && 'border-red-500'}
                              {...field}
                              value={maskDate(field.value)}
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
                              <SelectItem value="P">Em Andamento</SelectItem>
                              <SelectItem value="M">Fazer Laudo</SelectItem>
                              <SelectItem value="T">Remarcar</SelectItem>
                              <SelectItem value="D">Problemas no Docs</SelectItem>
                              <SelectItem value="R">Cancelado</SelectItem>
                              <SelectItem value="F">Finalizado</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </TableCell>

                    <TableCell >
                      {'Não Entregue'}
                    </TableCell>

                    <TableCell >
                      <FormControl>
                        <FormField
                          control={form.control}
                          name="avaliationValue"
                          render={({ field, formState }) => (
                            <Input
                              {...field}
                              placeholder="R$"
                              className={formState.errors.avaliationValue && 'border-red-500'}
                              onChange={(e) => field.onChange(maskCurrency(e.target.value))}
                            />
                          )}
                        />
                      </FormControl>

                    </TableCell>

                    <TableCell>
                      <FormField
                        control={form.control}
                        name="kmValue"
                        render={({ field, formState }) => (
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="R$ "
                              onChange={(e) => field.onChange(maskCurrency(e.target.value))}
                              className={formState.errors.kmValue && 'border-red-500'}
                            />
                          </FormControl>

                        )}
                      />
                    </TableCell>

                    <TableCell>
                      <FormField
                        control={form.control}
                        name="displacementType"
                        render={({ field, formState }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className={formState.errors.displacementType && 'border-red-500'}>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>

                            <SelectContent>
                              <SelectItem value="Carro">Carro</SelectItem>
                              <SelectItem value="Avião">Avião</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </TableCell>

                    <TableCell>
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field, formState }) => (
                          <Popover>
                            <PopoverTrigger className="text-black underline">
                              <Button type="button" variant="outline">{data.proposeDescription.slice(0, 10)}...</Button>
                            </PopoverTrigger>
                            <PopoverContent>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  className={formState.errors.description && 'border-red-500'}
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
                    <Link to={`edit-process/${data.idProposes}`}>
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
                    {data.proposeAddress.slice(0, 46)}...
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
                    {data.proposeAdditionalInfo?.proposeAddDisplacementType || 'Carro'}
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