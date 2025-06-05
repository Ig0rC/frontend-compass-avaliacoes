import { FooterTable } from "@/components/footer-table";
import { InputSearch } from "@/components/input-search";
import { Loader } from "@/components/loader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserService } from "@/services/user-service";
import { useQuery } from "@tanstack/react-query";
import { ListStartIcon, Plus, Search } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { z } from "zod";





export function UserManegement() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') ?? '');
  const pageIndex = z.coerce.number().parse(searchParams.get('page') ?? '1');

  const {
    data: result,
    isLoading: isLoadingService,
    refetch,
  } = useQuery({
    queryKey: ['services', pageIndex],
    queryFn: () =>
      UserService.list(pageIndex, searchTerm),
  });

  async function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      refetch();
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

  function handlePaginate(pageIndex: number) {
    setSearchParams((prev) => {
      prev.set('page', (pageIndex).toString())

      return prev
    })
  }


  return (
    <div>
      {isLoadingService && <Loader />}

      <InputSearch
        onChange={handleSearchTerm}
        onKeyDown={handleKeyDown}
      />

      <Link to="/" className="flex items-center underline flex-start gap-2 mt-11 mb-10 box-border min-w-[180px]">
        <ListStartIcon size={22} />
        Voltar para Processos
      </Link>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Ativo</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {result?.users.map((user) => (
            <TableRow>
              <TableCell>
                <Link to={`/edit-user/${user.idUser}`}>
                  <Search size={21} className="text-primary" />
                </Link>
              </TableCell>
              <TableCell>
                {user.username}
              </TableCell>
              <TableCell>
                {user.userEmail}
              </TableCell>
              <TableCell>
                {user.userStatus === 'A' && 'Ativo'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>



      <FooterTable
        onPageChange={handlePaginate}
        pageIndex={pageIndex}
        totalCount={result ? result.pagination.totalPages : 0}
      >
        <div className="lg:col-start-3 lg:justify-self-end justify-self-center">
          <Link to="/new-user" state={{ searchParams: searchParams.toString() }}
            className="w-96 h-[52px] justify-center items-center flex rounded bg-primary-light text-primary-foreground hover:bg-primary-hover font-bold text-xl"
          >
            <Plus size={24} />
            Novo Usuário
          </Link>
        </div>
      </FooterTable>
    </div>
  )
}