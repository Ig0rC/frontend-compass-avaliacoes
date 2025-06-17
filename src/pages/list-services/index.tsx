import exportFile from "@/assets/images/export-file.svg";
import Board from "@/components/Board";
import { FilterListService } from "@/components/filter-list-service";
import { FooterTable } from "@/components/footer-table";
import { InputSearch } from "@/components/input-search";
import { Loader } from "@/components/loader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ViewMode } from "@/components/view-mode";
import { ProposeService } from "@/services/propose-service";
import { formatDate } from "@/utils/formatDate";
import { getStatus } from "@/utils/getStatus";
import { safeParseJSON } from "@/utils/safeParseJSON";
import { Label } from "@radix-ui/react-label";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";



export function ListServices() {
  const [toggleView, setToggleView] = useState<'L' | 'K'>(
    localStorage.getItem('toggleView') as 'L' | 'K' || 'L'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') ?? '');

  const pageIndex = z.coerce.number().parse(searchParams.get('page') ?? '1')
  const userInfoIdUser = searchParams.get('userInfoIdUser');
  const inspectionStatus = searchParams.get('inspectionStatus');
  const proposeStatus = searchParams.get('proposeStatus');
  const proposeDateFrom = searchParams.get('proposeDateFrom')
  const proposeDateTo = searchParams.get('proposeDateTo');
  const inspectionDateFrom = searchParams.get('inspectionDateFrom');
  const inspectionDateTo = searchParams.get('inspectionDateTo');

  const {
    data: result,
    isLoading: isLoadingService,
    refetch,
  } = useQuery({
    queryKey: ['services', pageIndex, userInfoIdUser, inspectionStatus, proposeStatus, proposeDateTo, inspectionDateTo],
    queryFn: () =>
      ProposeService.getProposes({
        page: pageIndex,
        searchTerm,
        userInfoIdUser,
        proposeDateFrom: safeParseJSON(proposeDateFrom, null),
        proposeDateTo: safeParseJSON(proposeDateTo, null),
        inspectionDateFrom: safeParseJSON(inspectionDateFrom, null),
        inspectionDateTo: safeParseJSON(inspectionDateTo, null),
        proposeStatus: safeParseJSON(proposeStatus, undefined),
        inspectionStatus: safeParseJSON(inspectionStatus, [])
      }),
  });

  async function handleSearchTerm(e: ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);

    setSearchParams(prevState => {
      prevState.set('search', e.target.value);
      return prevState;
    });

    if (!e.target.value) {
      setSearchParams(prevState => {
        prevState.delete('search');
        return prevState;
      });
    }
  }

  async function handleExportProposes() {
    try {
      setIsLoading(true);
      const data = await ProposeService.getExportProposes({
        searchTerm: searchTerm,
        inspectionDateFrom: safeParseJSON(inspectionDateFrom, undefined),
        inspectionDateTo: safeParseJSON(inspectionDateTo, undefined),
        proposeDateFrom: safeParseJSON(proposeDateFrom, undefined),
        proposeDateTo: safeParseJSON(proposeDateTo, undefined),
        proposeStatus: safeParseJSON(proposeStatus, undefined),
        userInfoIdUser: safeParseJSON(userInfoIdUser, undefined),
        inspectionStatus: safeParseJSON(inspectionStatus, undefined),
      });

      // Criar URL do blob
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const url = window.URL.createObjectURL(blob)

      // Criar link e fazer download
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'relatorio.xlsx')
      document.body.appendChild(link)
      link.click()

      // Cleanup
      window.URL.revokeObjectURL(url)
      document.body.removeChild(link)
      toast.success('Arquivo exportado com sucesso')
    } catch {
      toast.error('Erro ao exportar arquivo')
    } finally {
      setIsLoading(false);
    }
  }

  function handleToggleViewChange(value: 'L' | 'K') {
    setToggleView(value);
    localStorage.setItem('toggleView', value);
  }

  async function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      refetch();
    }
  };

  if (toggleView === 'K') {
    return (
      <>
        {isLoadingService && <Loader />}

        <header className="flex justify-between">
          <InputSearch
            value={searchTerm}
            onChange={handleSearchTerm}
            onKeyDown={handleKeyDown}
          />

          <div className="flex items-end gap-1 ml-10">
            <FilterListService />
            <ViewMode
              toggleView={toggleView}
              onToggleViewChange={handleToggleViewChange}
            />
          </div>
        </header>
        <Board proposes={result ? result.proposes : []} />
      </>
    )
  }

  function handlePaginate(pageIndex: number) {
    setSearchParams((prev) => {
      prev.set('page', (pageIndex).toString())

      return prev
    })
  }

  return (
    <div className="h-full">
      {(isLoadingService || isLoading) && <Loader />}
      <header className="flex justify-between">
        <InputSearch
          onChange={handleSearchTerm}
          value={searchTerm}
          onKeyDown={handleKeyDown}
        />


        <div className="flex items-end gap-1 ml-10">
          <FilterListService />
          <ViewMode
            toggleView={toggleView}
            onToggleViewChange={handleToggleViewChange}
          />
        </div>
      </header>

      <button onClick={handleExportProposes} className="flex items-center underline flex-start gap-2 mt-11 mb-10 box-border min-w-[180px]">
        <img
          className="max-w-[24px] max-h-[24px] w-full h-full"
          src={exportFile}
          alt="export"
        />
        Exportar planilha
      </button>

      <div>
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
              <TableHead>Prestador</TableHead>
              <TableHead>Obs.</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {result?.proposes.map((data) => {
              return (
                <TableRow key={data.idProposes}>
                  <TableCell>
                    <Link state={{ searchParams: searchParams.toString() }} to={`edit-process/${data.idProposes}`}>
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
                    {data.user.username}
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
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <FooterTable
          onPageChange={handlePaginate}
          pageIndex={pageIndex}
          totalCount={result ? result.pagination.totalPages : 0}
        >
          <div className="lg:col-start-3 lg:justify-self-end justify-self-center">
            <Link to="/new-process" state={{ searchParams: searchParams.toString() }}
              className="w-96 h-[52px] justify-center items-center flex rounded bg-primary-light text-primary-foreground hover:bg-primary-hover font-bold text-xl"
            >
              <Plus size={24} />
              Novo Processo
            </Link>
          </div>
        </FooterTable>
      </div>
    </div>
  );
}
