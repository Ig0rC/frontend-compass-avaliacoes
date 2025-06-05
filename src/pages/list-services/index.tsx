import exportFile from "@/assets/images/export-file.svg";
import Board from "@/components/Board";
import { CustomServiceTable } from "@/components/custom-service-table";
import { FilterListService } from "@/components/filter-list-service";
import { FooterTable } from "@/components/footer-table";
import { InputSearch } from "@/components/input-search";
import { Loader } from "@/components/loader";

import { ViewMode } from "@/components/view-mode";
import { ProposeList } from "@/entities/ipropose";
import { updateProposeSchema } from "@/schemas/update-propose-schema";
import { IGetProposesResponse, ProposeService } from "@/services/propose-service";
import { clearMaskCurrency } from "@/utils/clearMaskCurrency";
import { safeParseJSON } from "@/utils/safeParseJSON";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";


export function ListServices() {
  const [toggleView, setToggleView] = useState<'L' | 'K'>(
    localStorage.getItem('toggleView') as 'L' | 'K' || 'L'
  );
  const queryClient = useQueryClient();
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

  const { mutateAsync: updatePropose } = useMutation({
    mutationFn: ProposeService.updateInTable,
    onSuccess(_, variables) {
      queryClient.setQueryData<IGetProposesResponse>(
        ['services', pageIndex, userInfoIdUser, inspectionStatus, proposeStatus, proposeDateTo, inspectionDateTo], (cached) => {
          if (!cached) return cached;

          const updatedProposes = cached.proposes.map((item) =>
            item.idProposes === variables.idProposes ? {
              ...variables,
              proposeAddress: `${variables.proposeAdditionalInfo.proposeAddStreet}, ${variables.proposeAdditionalInfo.proposeAddNumber}, ${variables.proposeAdditionalInfo.proposeAddNeighborhood}, ${variables.proposeAdditionalInfo.proposeAddCity} - ${variables.proposeAdditionalInfo.proposeAddUf}, ${variables.proposeCep}`,
              inspections: item.inspections,
            } : item
          );

          return {
            ...cached,
            proposes: updatedProposes,
          };
        });
    }
  });

  async function handleUpdatePropose(selectedPropose: ProposeList, data: z.infer<typeof updateProposeSchema>) {
    try {
      if (selectedPropose) {
        await updatePropose({
          ...data,
          proposeAdditionalInfo: {
            ...data.proposeAdditionalInfo,
            proposeAddKmValue: clearMaskCurrency(data.proposeAdditionalInfo.proposeAddKmValue),
            proposeAddAvaliationValue: clearMaskCurrency(data.proposeAdditionalInfo.proposeAddAvaliationValue),
            proposeAddDisplacementValue: clearMaskCurrency(data.proposeAdditionalInfo.proposeAddDisplacementValue),
          },
        });
        toast.success('Processo atualizado com sucesso');
      }

    } catch {
      toast.error('Erro ao atualizar o processo');
    }
  };

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
        <CustomServiceTable
          searchParams={searchParams.toString()}
          onUpdatePropose={handleUpdatePropose}
          proposes={result ? result.proposes : []}
        />

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
