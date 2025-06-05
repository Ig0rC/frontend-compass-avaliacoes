import { PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";

interface Props {
  pageIndex: number
  totalCount: number
  onPageChange: (pageIndex: number) => Promise<void> | void
  children: React.ReactNode;
}

export function FooterTable({ pageIndex, totalCount, onPageChange, children }: Props) {

  function generatePaginationLink() {
    const page = pageIndex;


    return (
      <>
        {Array.from({ length: totalCount }, (_, index) => {
          const pageNumber = index + 1;
          if (index < (page + 2)) {
            return (
              <PaginationLink onClick={() => onPageChange(pageNumber)} isActive={pageIndex === pageNumber} size="pagination" key={index}>
                {pageNumber}
              </PaginationLink>
            )
          }
        })}
      </>
    )
  }


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
      <PaginationContent className="w-full justify-center lg:col-start-2">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={() => onPageChange(pageIndex - 1)} disabled={pageIndex === 1} size="pagination" />
          </PaginationItem>
          <PaginationItem className="flex items-center gap-2">
            {generatePaginationLink()}
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext onClick={() => onPageChange(pageIndex + 1)} disabled={pageIndex >= totalCount} size="pagination" />
          </PaginationItem>
        </PaginationContent>
      </PaginationContent>

      {children}
    </div>
  )
}