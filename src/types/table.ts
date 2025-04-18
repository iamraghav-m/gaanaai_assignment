
export type SortDirection = 'asc' | 'desc';

export type TableColumn = {
  id: string;
  label: string;
  accessor: string;
  isVisible: boolean;
  filterable?: boolean;
};

export type Port = {
  id: string;
  name: string;
  country: string;
  continent: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  province: string;
  timezone: string;
  code: string;
  unlocs: string[];
  alias?: string[];
};

export type TableFilters = {
  search: string;
  [key: string]: string | number;
};

export type PaginationState = {
  pageIndex: number;
  pageSize: number;
};

export type SortingState = {
  id: string;
  desc: boolean;
}[];
