import { PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";

interface Props {
  pagination: {
    currentPage: number,
    pageSize: number,
    totalProposes: number,
    totalPages: number,
    hasNextPage: boolean,
    hasPreviousPage: boolean,
  }
  onPagePrevious(): void;
  onPageNext(): void;
  onPageMove(number: string | number): void;
}

export function CustomPagination({ pagination, onPageNext, onPagePrevious, onPageMove }: Props) {
  function generatePaginationLink() {
    const page = pagination.currentPage;


    return (
      <>
        {Array.from({ length: pagination.totalPages }, (_, index) => {
          const pageNumber = index + 1;
          if (index < (page + 2)) {
            return (
              <PaginationLink onClick={() => onPageMove(pageNumber)} isActive={pagination.currentPage === pageNumber} size="pagination" key={index}>
                {pageNumber}
              </PaginationLink>
            )
          }
        })}
      </>
    )
  }


  return (
    <PaginationContent className="w-full justify-center lg:col-start-2">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={onPagePrevious} disabled={!pagination.hasPreviousPage} size="pagination" />
        </PaginationItem>
        <PaginationItem className="flex items-center gap-2">
          {generatePaginationLink()}
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext onClick={onPageNext} disabled={!pagination.hasNextPage} size="pagination" />
        </PaginationItem>
      </PaginationContent>
    </PaginationContent>
  )
}