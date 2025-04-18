import React, { useState, useEffect } from "react";
import { Port, TableColumn, PaginationState, SortingState, TableFilters } from "@/types/table";
import { api } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronDown,
  ChevronUp,
  Edit,
  Filter,
  MoreVertical,
  Search,
  Trash,
  Eye,
  Plus,
  Columns,
  Loader2,
  FilterX
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import UserFormDialog from "./UserFormDialog";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import ColumnVisibilityDropdown from "./ColumnVisibilityDropdown";
import ColumnFilterPopover from "./ColumnFilterPopover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const DataTable = () => {
  // Default columns configuration
  const defaultColumns: TableColumn[] = [
    { id: "id", label: "ID", accessor: "id", isVisible: true, filterable: true },
    { id: "name", label: "Name", accessor: "name", isVisible: true, filterable: true },
    { id: "country", label: "Country", accessor: "country", isVisible: true, filterable: true },
    { id: "continent", label: "Continent", accessor: "continent", isVisible: true, filterable: true },
    { id: "province", label: "Province", accessor: "province", isVisible: true, filterable: true },
    { id: "code", label: "Code", accessor: "code", isVisible: true, filterable: true },
    { id: "timezone", label: "Timezone", accessor: "timezone", isVisible: true, filterable: true },
    { id: "latitude", label: "Latitude", accessor: "coordinates.latitude", isVisible: false, filterable: false },
    { id: "longitude", label: "Longitude", accessor: "coordinates.longitude", isVisible: false, filterable: false },
  ];

  // State for table configuration
  const [columns, setColumns] = useState<TableColumn[]>(defaultColumns);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filters, setFilters] = useState<TableFilters>({ search: "" });
  const [searchInput, setSearchInput] = useState("");
  const [activeColumnFilter, setActiveColumnFilter] = useState<string | null>(null);
  
  // State for CRUD operations
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPort, setEditingPort] = useState<Port | null>(null);
  const [deletingPortId, setDeletingPortId] = useState<string | null>(null);
  const [viewingPort, setViewingPort] = useState<Port | null>(null);

  const queryClient = useQueryClient();

  // Query for fetching ports with current table state
  const {
    data: ports = [],
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["ports", pagination, sorting, filters],
    queryFn: () => api.getPorts(pagination, sorting, filters),
    placeholderData: (prev) => prev,
  });

  // Query for total count (for pagination)
  const {
    data: totalCount = 0,
    isLoading: isCountLoading,
  } = useQuery({
    queryKey: ["portsCount", filters],
    queryFn: () => api.getTotalCount(filters),
  });

  // Calculate total pages
  const pageCount = Math.ceil(totalCount / pagination.pageSize);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const currentPage = pagination.pageIndex + 1;
    const totalPages = pageCount;
    
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    if (currentPage <= 3) {
      return [1, 2, 3, 4, 'ellipsis', totalPages - 1, totalPages];
    }
    
    if (currentPage >= totalPages - 2) {
      return [1, 2, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    
    return [
      1,
      'ellipsis',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      'ellipsis',
      totalPages
    ];
  };

  // Handle search input with debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchInput }));
      setPagination(prev => ({ ...prev, pageIndex: 0 })); // Reset to first page on search
    }, 300);

    return () => clearTimeout(handler);
  }, [searchInput]);

  // Handle column sorting
  const handleSort = (columnId: string) => {
    setSorting(prevSorting => {
      // Check if we're already sorting by this column
      const existingSortIdx = prevSorting.findIndex(sort => sort.id === columnId);
      
      if (existingSortIdx !== -1) {
        // If already sorting by this column, toggle direction or remove
        const existingSort = prevSorting[existingSortIdx];
        
        if (existingSort.desc) {
          // If currently desc, remove sorting
          return [];
        } else {
          // If currently asc, change to desc
          return [{ ...existingSort, desc: true }];
        }
      } else {
        // Start with ascending sort
        return [{ id: columnId, desc: false }];
      }
    });
  };

  // Get sort direction indicator for a column
  const getSortDirectionIcon = (columnId: string) => {
    const sort = sorting.find(s => s.id === columnId);
    if (!sort) return null;
    return sort.desc ? <ChevronDown className="ml-1 h-4 w-4" /> : <ChevronUp className="ml-1 h-4 w-4" />;
  };

  // Handle column visibility toggle
  const toggleColumnVisibility = (columnId: string) => {
    setColumns(prevColumns =>
      prevColumns.map(column =>
        column.id === columnId
          ? { ...column, isVisible: !column.isVisible }
          : column
      )
    );
  };

  // Handle column filter application
  const applyColumnFilter = (columnId: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [columnId]: value
    }));
    setPagination(prev => ({ ...prev, pageIndex: 0 })); // Reset to first page on filter
    setActiveColumnFilter(null);
  };

  // Clear a specific column filter
  const clearColumnFilter = (columnId: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[columnId];
      return newFilters;
    });
    setPagination(prev => ({ ...prev, pageIndex: 0 })); // Reset to first page
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({ search: "" });
    setSearchInput("");
    setPagination(prev => ({ ...prev, pageIndex: 0 })); // Reset to first page
  };

  // Handle port creation
  const handleCreatePort = async (portData: Omit<Port, "id">) => {
    try {
      await api.createPort(portData);
      queryClient.invalidateQueries({ queryKey: ["ports"] });
      queryClient.invalidateQueries({ queryKey: ["portsCount"] });
      toast.success("Port created successfully");
      setIsCreateDialogOpen(false);
    } catch (err) {
      toast.error("Failed to create port");
      console.error(err);
    }
  };

  // Handle port update
  const handleUpdatePort = async (id: string, portData: Partial<Port>) => {
    try {
      await api.updatePort(id, portData);
      queryClient.invalidateQueries({ queryKey: ["ports"] });
      toast.success("Port updated successfully");
      setEditingPort(null);
    } catch (err) {
      toast.error("Failed to update port");
      console.error(err);
    }
  };

  // Handle port deletion
  const handleDeletePort = async (id: string) => {
    try {
      await api.deletePort(id);
      queryClient.invalidateQueries({ queryKey: ["ports"] });
      queryClient.invalidateQueries({ queryKey: ["portsCount"] });
      toast.success("Port deleted successfully");
      setDeletingPortId(null);
    } catch (err) {
      toast.error("Failed to delete port");
      console.error(err);
    }
  };

  // Helper to get nested property value using accessor string
  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((prev, curr) => {
      return prev ? prev[curr] : null;
    }, obj);
  };

  // Count active filters (excluding search)
  const activeFilterCount = Object.keys(filters).filter(key => key !== 'search').length;

  if (isError) {
    console.error("Error loading data:", error);
    toast.error(`Error loading data: ${(error as Error).message}`);
  }

  const visibleColumns = columns.filter(col => col.isVisible);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Sea Ports Management System</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Port
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search ports..."
            className="pl-8"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            aria-label="Search ports by name, country, code, continent, or province"
          />
          {isFetching && filters.search && (
            <div className="absolute right-2.5 top-2.5">
              <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Search by name, country, code, continent, or province
          </p>
        </div>
        
        <div className="flex gap-2">
          {activeFilterCount > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearAllFilters}
              className="flex items-center gap-1"
              aria-label="Clear all filters"
            >
              <FilterX className="h-4 w-4" />
              Clear Filters ({activeFilterCount})
            </Button>
          )}
          <ColumnVisibilityDropdown 
            columns={columns} 
            toggleVisibility={toggleColumnVisibility} 
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.map((column) => (
                <TableHead key={column.id} className="whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <div 
                      className="flex items-center cursor-pointer"
                      onClick={() => handleSort(column.id)}
                    >
                      {column.label}
                      {getSortDirectionIcon(column.id)}
                    </div>
                    
                    {column.filterable && (
                      <div className="flex items-center">
                        <ColumnFilterPopover
                          columnId={column.id}
                          filterValue={filters[column.id] as string}
                          onApplyFilter={applyColumnFilter}
                          onClearFilter={clearColumnFilter}
                          isActive={!!filters[column.id]}
                        />
                      </div>
                    )}
                  </div>
                </TableHead>
              ))}
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading || isFetching ? (
              Array.from({ length: pagination.pageSize }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  {visibleColumns.map((column) => (
                    <TableCell key={`skeleton-cell-${column.id}-${index}`}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Skeleton className="h-9 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : ports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={visibleColumns.length + 1} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p className="text-muted-foreground">No results found</p>
                    {(Object.keys(filters).length > 1 || filters.search) && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={clearAllFilters}
                        className="flex items-center gap-1"
                      >
                        <FilterX className="h-4 w-4" />
                        Clear all filters
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              ports.map((port) => (
                <TableRow key={port.id}>
                  {visibleColumns.map((column) => (
                    <TableCell key={`${port.id}-${column.id}`}>
                      {getNestedValue(port, column.accessor)?.toString() || ''}
                    </TableCell>
                  ))}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => api.getPortById(port.id).then(setViewingPort)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => api.getPortById(port.id).then(setEditingPort)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => setDeletingPortId(port.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          {isCountLoading ? (
            <Skeleton className="h-4 w-32" />
          ) : (
            <>
              Showing {totalCount === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1} to{" "}
              {Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalCount)} of{" "}
              {totalCount} entries
              {isFetching && !isLoading && (
                <span className="ml-2">
                  <Loader2 className="inline-block h-3 w-3 animate-spin" />
                </span>
              )}
            </>
          )}
        </div>
        
        {pageCount > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => 
                    setPagination((prev) => ({ 
                      ...prev, 
                      pageIndex: Math.max(0, prev.pageIndex - 1) 
                    }))
                  }
                  className={pagination.pageIndex === 0 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {getPageNumbers().map((page, i) => (
                page === 'ellipsis' ? (
                  <PaginationItem key={`ellipsis-${i}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={`page-${page}`}>
                    <PaginationLink 
                      isActive={pagination.pageIndex + 1 === page}
                      onClick={() => setPagination(prev => ({ ...prev, pageIndex: (page as number) - 1 }))}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => 
                    setPagination((prev) => ({ 
                      ...prev, 
                      pageIndex: Math.min(pageCount - 1, prev.pageIndex + 1) 
                    }))
                  }
                  className={pagination.pageIndex >= pageCount - 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      {isCreateDialogOpen && (
        <UserFormDialog
          open={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onSubmit={(data) => {
            const newPort: Omit<Port, "id"> = {
              name: data.name || "New Port",
              country: data.country || "Unknown",
              continent: data.continent || "Unknown",
              coordinates: {
                latitude: data.coordinates?.latitude || 0,
                longitude: data.coordinates?.longitude || 0
              },
              province: data.province || "Unknown",
              timezone: data.timezone || "UTC",
              code: data.code || `PORT_${Date.now()}`,
              unlocs: data.unlocs || []
            };
            handleCreatePort(newPort);
          }}
          title="Add New Port"
        />
      )}

      {editingPort && (
        <UserFormDialog
          open={!!editingPort}
          onClose={() => setEditingPort(null)}
          onSubmit={(data) => handleUpdatePort(editingPort.id, data)}
          initialData={editingPort}
          title="Edit Port"
        />
      )}

      {viewingPort && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Port Details</h2>
            <div className="space-y-2">
              {columns.map((column) => (
                <div key={column.id} className="grid grid-cols-3 gap-4">
                  <span className="font-medium text-gray-700">{column.label}:</span>
                  <span className="col-span-2">
                    {getNestedValue(viewingPort, column.accessor)?.toString() || '-'}
                  </span>
                </div>
              ))}
              {viewingPort.unlocs && viewingPort.unlocs.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  <span className="font-medium text-gray-700">UNLOCs:</span>
                  <span className="col-span-2">
                    {viewingPort.unlocs.join(', ')}
                  </span>
                </div>
              )}
              {viewingPort.alias && viewingPort.alias.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  <span className="font-medium text-gray-700">Aliases:</span>
                  <span className="col-span-2">
                    {viewingPort.alias.join(', ')}
                  </span>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={() => setViewingPort(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {deletingPortId !== null && (
        <DeleteConfirmDialog
          open={deletingPortId !== null}
          onClose={() => setDeletingPortId(null)}
          onConfirm={() => deletingPortId && handleDeletePort(deletingPortId)}
        />
      )}
    </div>
  );
};

export default DataTable;
