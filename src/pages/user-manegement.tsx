import { FooterTable } from "@/components/footer-table";
import { InputSearch } from "@/components/input-search";
import { Loader } from "@/components/loader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IUser } from "@/entities/i-user-supplier";
import { useQuery } from "@/hooks/use-Query";
import { UserService } from "@/services/user-service";
import { ListStartIcon, Search } from "lucide-react";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";





export function UserManegement() {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<IUser[]>([]);
  const { pageNext, pagePrevious, pagination, setPagination, loadQuerys, pageMove, setQuery } = useQuery();

  const loadData = useCallback(async () => {
    try {

      console.log('entrei')

      const data = await UserService.list(
        loadQuerys().page || '1',
        loadQuerys().searchTerm || ''
      );

      setUsers(data.users);
      setPagination(data.pagination);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000)
    }
  }, [loadQuerys, setPagination])

  useEffect(() => {
    loadData();
  }, [loadData]);

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

  async function handleSearchTerm(e: ChangeEvent<HTMLInputElement>) {
    setQuery((prev) => {
      const params = new URLSearchParams(prev);
      params.set('search', e.target.value)
      return params;
    });
  }

  return (
    <div>
      {isLoading && <Loader />}

      <InputSearch
        onChange={handleSearchTerm}
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
          {users.map((user) => (
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
        onPageMove={handlePageMove}
        onPageNext={handlePageNext}
        onPagePrevious={handlePagePrevious}
        pagination={pagination}
        pathTo="/new-user"
        buttonName="Novo Usuário"
      />
    </div>
  )
}