import exportFile from "@/assets/images/export-file.svg";
import { CustomPagination } from "@/components/custom-pagination";
import { CustomServiceTable } from "@/components/custom-service-table";
import { FilterListService } from "@/components/filter-list-service";
import { Loader } from "@/components/loader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { IPropose } from "@/entities/ipropose";
import { useQuery } from "@/hooks/use-Query";
import { processSchema } from "@/schemas/process-schema";
import { ProposeMapper } from "@/services/mappers/propose-mapper";
import { ProposeService } from "@/services/propose-service";
import {
  FileSpreadsheet,
  Plus,
  Search,
  SquareKanban
} from "lucide-react";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
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
    } catch {
      toast.error("Erro ao buscar propostas");
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

  async function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      setIsLoading(true)
      await loadData({
        searchTerm: event.currentTarget.value,
      });
    }

    if (event.key === 'Backspace' && event.currentTarget.value.length === 1) {
      setIsLoading(true);
      await loadData({
        searchTerm: event.currentTarget.value,
      });
    }
  };

  async function handleUpdatePropose(selectedPropose: IPropose, data: z.infer<typeof processSchema>) {
    try {
      if (selectedPropose) {

        await ProposeService.update(selectedPropose?.idProposes, data);
        const teste = ProposeMapper.toPersistence(data);

        setProposes(prevProposes => (
          prevProposes.map(propose => {
            if (propose.idProposes === selectedPropose.idProposes) {
              return teste;
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



  return (
    <div className="h-full">
      {isLoading && <Loader />}
      <header className="flex justify-between">
        <div className="flex-1">
          <Label>Pesquisar</Label>
          <div className="relative h-[46px]">
            <Search
              className="size-8 absolute left-4 inset-y-0 my-auto"
              color="#C4C5CC"
            />
            <Input
              onKeyDown={handleKeyDown}
              placeholder="Pesquisar"
              onChange={handleSearchTerm}
              value={getQuery.get("search") ?? ''}
              className="h-[46px] pl-[75.25px]"
            />
          </div>
        </div>

        <div className="flex items-end gap-1 ml-10">
          <FilterListService onLoadData={loadData} />
          <ToggleGroup variant="search" size="search" type="single">
            <ToggleGroupItem value="a">
              <FileSpreadsheet size={32} />
            </ToggleGroupItem>
            <ToggleGroupItem value="b">
              <SquareKanban size={32} />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </header>

      <button className="flex items-center underline flex-start gap-2 mt-11 mb-10 box-border min-w-[180px]">
        <img
          className="max-w-[24px] max-h-[24px] w-full h-full"
          src={exportFile}
          alt="export"
        />
        Exportar planilha
      </button>

      <div className="relative">
        <CustomServiceTable onUpdatePropose={handleUpdatePropose} proposes={proposes} />

        <CustomPagination

          onPageMove={handlePageMove}
          onPageNext={handlePageNext}
          onPagePrevious={handlePagePrevious}
          pagination={pagination}
        />

        <div className="absolute bottom-1 right-0">
          <Link to="/new-process"
            className="w-96 h-[52px] justify-center items-center flex rounded bg-primary-light text-primary-foreground hover:bg-primary-hover font-bold text-xl"
          >
            <Plus size={24} />
            Criar Processo
          </Link>
        </div>
      </div>
    </div>
  );
}
