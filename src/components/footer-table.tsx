import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { CustomPagination } from "./custom-pagination";

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
  pathTo: string;
  onPageMove(number: string | number): void;
  buttonName: string;
}

export function FooterTable({ onPageMove, onPageNext, onPagePrevious, pagination, pathTo, buttonName }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
      <CustomPagination
        onPageMove={onPageMove}
        onPageNext={onPageNext}
        onPagePrevious={onPagePrevious}
        pagination={pagination}
      />

      <div className="lg:col-start-3 lg:justify-self-end justify-self-center">
        <Link to={pathTo}
          className="w-96 h-[52px] justify-center items-center flex rounded bg-primary-light text-primary-foreground hover:bg-primary-hover font-bold text-xl"
        >
          <Plus size={24} />
          {buttonName}
        </Link>
      </div>
    </div>
  )
}