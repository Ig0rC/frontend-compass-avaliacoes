import exportFile from "@/assets/images/export-file.svg";
import Board from "@/components/Board";
import { CustomServiceTable } from "@/components/custom-service-table";
import { FilterListService } from "@/components/filter-list-service";
import { FooterTable } from "@/components/footer-table";
import { InputSearch } from "@/components/input-search";
import { Loader } from "@/components/loader";

import { ViewMode } from "@/components/view-mode";
import { IPropose } from "@/entities/ipropose";
import { useQuery } from "@/hooks/use-Query";
import { processSchema } from "@/schemas/process-schema";
import { ProposeService } from "@/services/propose-service";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";


interface ILoadParamsData {
  inspectionDateTo?: string;
  inspectionDateFrom?: string;
  proposeDateTo?: string;
  proposeDateFrom?: string;
  userInfoIdUser?: string;
  page?: string | number;
  proposeStatus?: string | string[];
  searchTerm?: string;
}

export function ListServices() {
  const [toggleView, setToggleView] = useState<'L' | 'K'>(
    localStorage.getItem('toggleView') as 'L' | 'K' || 'L'
  );
  const [getQuery, setQuery] = useSearchParams();
  const { pageNext, pagePrevious, pagination, setPagination, loadQuerys, pageMove } = useQuery();
  const [isLoading, setIsLoading] = useState(true);
  const [proposes, setProposes] = useState<IPropose[]>([]);

  const loadData = useCallback(async (params: ILoadParamsData) => {
    try {
      const data = await ProposeService.getProposes({
        ...params,
        page: params.page || loadQuerys().page,
        searchTerm: params.searchTerm || loadQuerys().searchTerm
      });

      setProposes(data.proposes);
      setPagination(data.pagination);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000)
    }
  }, [])

  useEffect(() => {
    loadData({});
  }, [loadData]);

  async function handleSearchTerm(e: ChangeEvent<HTMLInputElement>) {
    setQuery((prev) => {
      const params = new URLSearchParams(prev);
      params.set('search', e.target.value)
      return params;
    });
  }

  async function handleExportProposes() {
    try {
      const data = await ProposeService.getExportProposes({
        searchTerm: getQuery.get('searchTerm') || '',
        inspectionDateFrom: getQuery.get('inspectionDateFrom') ? new Date(getQuery.get('inspectionDateFrom')!).toISOString() : undefined,
        inspectionDateTo: getQuery.get('inspectionDateTo') ? new Date(getQuery.get('inspectionDateTo')!).toISOString() : undefined,
        proposeDateFrom: getQuery.get('proposeDateFrom') ? new Date(getQuery.get('proposeDateFrom')!).toISOString() : undefined,
        proposeDateTo: getQuery.get('proposeDateTo') ? new Date(getQuery.get('proposeDateTo')!).toISOString() : undefined,
        proposeStatus: getQuery.get('proposeStatus') ? JSON.parse(getQuery.get('proposeStatus')!) : undefined,
        userInfoIdUser: getQuery.get('userInfoIdUser') || undefined,
        inspectionStatus: getQuery.get('inspectionStatus') ? JSON.parse(getQuery.get('inspectionStatus')!) : undefined,
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
    }
  }

  async function handlePageNext() {
    setIsLoading(true);
    const nextPageNumber = pageNext();

    await loadData({
      page: nextPageNumber,
    })
  }

  async function handlePagePrevious() {
    setIsLoading(true);
    const previousPageNumber = pagePrevious();

    await loadData({
      page: previousPageNumber,
    })
  }

  async function handlePageMove(pageNumber: string | number) {
    setIsLoading(true);
    await loadData({
      page: pageMove(pageNumber),
    })
  }

  function handleToggleViewChange(value: 'L' | 'K') {
    setToggleView(value);
    localStorage.setItem('toggleView', value);
  }



  async function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      setIsLoading(true);
      setQuery((prev) => {
        const params = new URLSearchParams(prev);
        params.set('page', '1')
        return params;
      });
      await loadData({
        searchTerm: event.currentTarget.value,
        page: 1,
      });
    }

    if (event.key === 'Backspace' && event.currentTarget.value.length === 1) {
      setIsLoading(true);
      setQuery((prev) => {
        const params = new URLSearchParams(prev);
        params.set('page', '1')
        return params;
      });
      await loadData({
        searchTerm: event.currentTarget.value,
        page: 1,
      });
    }
  };


  async function handleUpdatePropose(selectedPropose: IPropose, data: z.infer<typeof processSchema>) {
    try {
      if (selectedPropose) {

        await ProposeService.update(selectedPropose?.idProposes, data);
        setProposes(prevProposes => (
          prevProposes.map(propose => {
            if (propose.idProposes === selectedPropose.idProposes) {
              return {
                ...propose,
                proposeStatus: 'A',
              };
            }
            return propose;
          })
        ));


        toast.success('Processo atualizado com sucesso');
      }

    } catch {
      toast.error('Erro ao atualizar o processo');
    }
  };


  if (toggleView === 'K') {
    return (
      <>
        {isLoading && <Loader />}

        <header className="flex justify-between">
          <InputSearch
            onChange={handleSearchTerm}
            onKeyDown={handleKeyDown}
          />

          <div className="flex items-end gap-1 ml-10">
            <FilterListService onLoadData={loadData} />
            <ViewMode
              toggleView={toggleView}
              onToggleViewChange={handleToggleViewChange}
            />
          </div>
        </header>
        <Board proposes={proposes} />
      </>
    )
  }


  return (
    <div className="h-full">
      {isLoading && <Loader />}
      <header className="flex justify-between">
        <InputSearch
          onChange={handleSearchTerm}
          onKeyDown={handleKeyDown}

        />


        <div className="flex items-end gap-1 ml-10">
          <FilterListService onLoadData={loadData} />
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
        <CustomServiceTable onUpdatePropose={handleUpdatePropose} proposes={proposes} />

        <FooterTable
          onPageMove={handlePageMove}
          onPageNext={handlePageNext}
          onPagePrevious={handlePagePrevious}
          pagination={pagination}
          pathTo="/new-process"
          buttonName="Novo Processo"

        />
      </div>
    </div>
  );
}
