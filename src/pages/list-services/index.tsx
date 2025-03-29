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
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";




export function ListServices() {
  const [toggleView, setToggleView] = useState<'L' | 'K'>(
    localStorage.getItem('toggleView') as 'L' | 'K' || 'L'
  );
  const { pageNext, pagePrevious, pagination, setPagination, pageMove, filters, onSearchTermChange, onFilterChange, clearFilter } = useQuery('filters');
  const [isLoading, setIsLoading] = useState(true);
  const [proposes, setProposes] = useState<IPropose[]>([]);
  const [searchTerm, setSearchTerm] = useState(filters?.searchTerm || '');
  const render = useRef(1);

  const loadData = useCallback(async () => {
    try {
      if (!filters) {
        return;
      }

      if (!isLoading) {
        setIsLoading(true);
      }

      const data = await ProposeService.getProposes({
        ...filters,
      });

      console.log(render.current, data);


      setProposes(data.proposes);
      setPagination(data.pagination);
      render.current = 2
    } finally {
      // alert('fim')
      setTimeout(() => {
        setIsLoading(false);
      }, 1000)
    }
  }, [filters])

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleSearchTerm(e: ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
  }

  async function handleExportProposes() {
    try {
      if (!filters) {
        toast.error('Filtro não foi carregado corretamente!')
        return;
      }
      setIsLoading(true);
      const data = await ProposeService.getExportProposes({
        searchTerm: filters.searchTerm,
        inspectionDateFrom: filters.inspectionDateFrom,
        inspectionDateTo: filters.inspectionDateTo,
        proposeDateFrom: filters.proposeDateFrom,
        proposeDateTo: filters.proposeDateTo,
        proposeStatus: filters.proposeStatus,
        userInfoIdUser: filters.userInfoIdUser,
        inspectionStatus: filters.inspectionStatus,
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

  async function handlePageNext() {
    setIsLoading(true);
    pageNext();
  }

  async function handlePagePrevious() {
    setIsLoading(true);
    pagePrevious();
  }

  async function handlePageMove(pageNumber: string | number) {
    setIsLoading(true);
    pageMove(pageNumber);
  }

  function handleToggleViewChange(value: 'L' | 'K') {
    setToggleView(value);
    localStorage.setItem('toggleView', value);
  }

  async function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      setIsLoading(true);
      onSearchTermChange(searchTerm)
      await loadData();
    }

    // if (event.key === 'Backspace' && event.currentTarget.value.length === 1) {
    //   setIsLoading(true);
    //   onSearchTermChange(searchTerm)
    //   await loadData();
    // }
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
            value={searchTerm}
            onChange={handleSearchTerm}
            onKeyDown={handleKeyDown}
          />

          <div className="flex items-end gap-1 ml-10">
            <FilterListService key={filters?.page} filters={filters} onClearFilter={clearFilter} onFilterChange={onFilterChange} />
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
          value={searchTerm}
          onKeyDown={handleKeyDown}
        />


        <div className="flex items-end gap-1 ml-10">
          <FilterListService key={filters?.page} filters={filters} onClearFilter={clearFilter} onFilterChange={onFilterChange} />
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
