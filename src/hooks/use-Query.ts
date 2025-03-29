import { useCallback, useLayoutEffect, useState } from "react";


export interface IFilters {
  searchTerm: string,
  page: number,
  inspectionDateFrom?: Date,
  inspectionDateTo?: Date,
  proposeDateFrom?: Date,
  proposeDateTo?: Date,
  proposeStatus?: string[],
  userInfoIdUser?: string,
  inspectionStatus?: string[],
}

export interface IFiltersChange {
  inspectionDateFrom?: Date,
  inspectionDateTo?: Date,
  proposeDateFrom?: Date,
  proposeDateTo?: Date,
  proposeStatus?: string[],
  userInfoIdUser?: string,
  inspectionStatus?: string[],
}

export function useQuery() {
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalProposes: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [filters, setFilters] = useState<IFilters | null>(null);

  function updateStorage(filters: IFilters) {
    localStorage.setItem('filters', JSON.stringify({
      ...filters,
    }))
  }

  const loadFilters = useCallback(() => {
    const filtersStorage = localStorage.getItem('filters');

    if (filtersStorage) {
      setFilters(JSON.parse(filtersStorage))
    } else {
      setFilters({
        page: 1,
        searchTerm: '',
      })
    }
  }, []);


  useLayoutEffect(() => {
    console.log('here');
    loadFilters()
  }, [loadFilters])

  function onFilterChange(filters: IFiltersChange) {
    setFilters(prevState => {
      let newState: IFilters;
      if (prevState) {
        newState = {
          ...prevState,
          ...filters,
        }
      } else {
        newState = {
          page: 1,
          searchTerm: '',
          ...filters,
        };
      }
      updateStorage(newState);

      return newState;
    })
  }

  function clearFilter() {
    setFilters(prevState => {
      let newState: IFilters;
      if (prevState) {
        newState = {
          page: prevState.page,
          searchTerm: prevState.searchTerm,
        }
      } else {
        newState = {
          page: 1,
          searchTerm: '',
        };
      }

      updateStorage(newState);

      return newState;
    })
  }

  function onSearchTermChange(searchTerm: string) {
    setFilters(prevState => {
      let newState: IFilters;

      if (prevState) {
        newState = {
          ...prevState,
          searchTerm,
        }
      } else {
        newState = {
          page: 1,
          searchTerm: ''
        }
      }
      updateStorage(newState);

      return newState;
    })
  }

  function pageNext() {
    setFilters(prevState => {
      let newState: IFilters;

      if (prevState && filters?.page) {
        newState = {
          ...prevState,
          page: filters.page + 1,
        }
        updateStorage(newState);

        return newState;
      }


      return null;
    })
  }

  function pageMove(pageNumber: string | number) {
    setFilters(prevState => {
      let newState: IFilters;

      if (prevState && filters?.page) {
        newState = {
          ...prevState,
          page: Number(pageNumber),
        }
        updateStorage(newState);

        return newState;
      }

      return null;
    })
  }

  function pagePrevious() {
    setFilters(prevState => {
      let newState: IFilters;

      if (prevState && filters?.page) {
        newState = {
          ...prevState,
          page: filters.page - 1,
        }
        updateStorage(newState);

        return newState;
      }


      return null;
    })
  }

  return {
    pageNext, pagePrevious, setFilters, clearFilter,
    pagination, setPagination, filters, onFilterChange,
    loadFilters, pageMove, onSearchTermChange
  }
}