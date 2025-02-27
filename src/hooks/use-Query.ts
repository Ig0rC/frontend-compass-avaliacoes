import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";

export function useQuery() {
  const [getQuery, setQuery] = useSearchParams();
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalProposes: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  function updateQuery(pageNumber: string | number) {
    setQuery((prev) => {
      const params = new URLSearchParams(prev);
      params.set('page', pageNumber.toString())
      return params;
    });
  }



  const loadQuerys = useCallback(() => {
    return {
      page: getQuery.get('page') || pagination.currentPage,
      searchTerm: getQuery.get('search') || '',
    }
  }, [getQuery, pagination.currentPage])

  function pageNext() {
    const nextPageNumber = Number(loadQuerys().page) + 1;

    updateQuery(nextPageNumber)

    return nextPageNumber;
  }

  function pageMove(pageNumber: string | number) {
    updateQuery(pageNumber)

    return pageNumber;
  }


  function pagePrevious() {
    const previousPageNumber = Number(loadQuerys().page) - 1;

    updateQuery(previousPageNumber)

    return previousPageNumber;
  }

  return {
    pageNext, pagePrevious,
    pagination, setPagination,
    loadQuerys, pageMove, setQuery
  }
}