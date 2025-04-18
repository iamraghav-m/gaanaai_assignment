
import { PaginationState, SortingState, TableFilters, Port } from "@/types/table";

// URL for the sea ports data
const API_URL = "https://raw.githubusercontent.com/marchah/sea-ports/refs/heads/master/lib/ports.json";

// Local in-memory cache to hold the ports data
let portsCache: Port[] = [];

// Helper function to build query params for pagination, sorting, and filtering
const applyFilters = (
  data: Port[],
  pagination: PaginationState,
  sorting: SortingState,
  filters: TableFilters
): Port[] => {
  let filteredData = [...data];
  
  // Apply search filter if present
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredData = filteredData.filter(port => {
      // Safety check for potentially undefined properties
      const name = port.name?.toLowerCase() || '';
      const country = port.country?.toLowerCase() || '';
      const code = port.code?.toLowerCase() || '';
      const continent = port.continent?.toLowerCase() || '';
      const province = port.province?.toLowerCase() || '';
      
      return name.includes(searchTerm) ||
        country.includes(searchTerm) ||
        code.includes(searchTerm) ||
        continent.includes(searchTerm) ||
        province.includes(searchTerm);
    });
  }
  
  // Apply column-specific filters
  Object.entries(filters).forEach(([key, value]) => {
    if (key !== "search" && value) {
      filteredData = filteredData.filter(port => {
        if (!port) return false;
        
        let portValue: any;
        if (key.includes('.')) {
          // Handle nested properties safely
          try {
            portValue = key.split('.').reduce((obj, path) => obj && obj[path], port);
          } catch (e) {
            portValue = undefined;
          }
        } else {
          portValue = port[key];
        }
        
        return portValue && portValue.toString().toLowerCase().includes(value.toString().toLowerCase());
      });
    }
  });
  
  // Apply sorting if present
  if (sorting.length > 0) {
    const sort = sorting[0];
    filteredData.sort((a, b) => {
      let aValue: any, bValue: any;
      
      if (sort.id.includes('.')) {
        // Handle nested properties safely
        try {
          aValue = sort.id.split('.').reduce((obj, path) => obj && obj[path], a);
          bValue = sort.id.split('.').reduce((obj, path) => obj && obj[path], b);
        } catch (e) {
          aValue = undefined;
          bValue = undefined;
        }
      } else {
        aValue = a[sort.id];
        bValue = b[sort.id];
      }
      
      // Handle undefined values in sorting
      if (aValue === undefined) aValue = '';
      if (bValue === undefined) bValue = '';
      
      if (aValue < bValue) return sort.desc ? 1 : -1;
      if (aValue > bValue) return sort.desc ? -1 : 1;
      return 0;
    });
  }
  
  return filteredData;
};

// Simulate server-side processing delay
const simulateServerDelay = (ms: number = 300) => 
  new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Initialize the cache by fetching all ports
  async initCache(): Promise<void> {
    if (portsCache.length === 0) {
      try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
          throw new Error("Failed to fetch ports data");
        }
        
        const data = await response.json();
        
        // Transform the data into an array of ports with IDs
        portsCache = Object.entries(data).map(([code, portData]: [string, any]) => ({
          id: code,
          code,
          ...portData
        }));
      } catch (error) {
        console.error("Error initializing ports cache:", error);
        throw error;
      }
    }
  },
  
  // Get the total count of records with server-side filtering
  async getTotalCount(filters: TableFilters = { search: "" }): Promise<number> {
    try {
      await this.initCache();
      await simulateServerDelay(200); // Simulate server processing delay
      
      let filteredData = [...portsCache];
      
      // Apply search filter if present
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredData = filteredData.filter(port => {
          // Safety check for potentially undefined properties
          const name = port.name?.toLowerCase() || '';
          const country = port.country?.toLowerCase() || '';
          const code = port.code?.toLowerCase() || '';
          const continent = port.continent?.toLowerCase() || '';
          const province = port.province?.toLowerCase() || '';
          
          return name.includes(searchTerm) ||
            country.includes(searchTerm) ||
            code.includes(searchTerm) ||
            continent.includes(searchTerm) ||
            province.includes(searchTerm);
        });
      }
      
      // Apply other column-specific filters
      Object.entries(filters).forEach(([key, value]) => {
        if (key !== "search" && value) {
          filteredData = filteredData.filter(port => {
            if (!port) return false;
            
            let portValue: any;
            if (key.includes('.')) {
              // Handle nested properties safely
              try {
                portValue = key.split('.').reduce((obj, path) => obj && obj[path], port);
              } catch (e) {
                portValue = undefined;
              }
            } else {
              portValue = port[key];
            }
            
            return portValue && portValue.toString().toLowerCase().includes(value.toString().toLowerCase());
          });
        }
      });
      
      return filteredData.length;
    } catch (error) {
      console.error("Error fetching total count:", error);
      throw error;
    }
  },
  
  // Get ports with server-side pagination, sorting and filtering
  async getPorts(
    pagination: PaginationState,
    sorting: SortingState = [],
    filters: TableFilters = { search: "" }
  ): Promise<Port[]> {
    try {
      await this.initCache();
      await simulateServerDelay(); // Simulate server processing delay
      
      // First apply all filters and sorting to get the complete filtered dataset
      const filteredData = applyFilters(portsCache, pagination, sorting, filters);
      
      // Then apply pagination
      const start = pagination.pageIndex * pagination.pageSize;
      const end = start + pagination.pageSize;
      return filteredData.slice(start, end);
    } catch (error) {
      console.error("Error fetching ports:", error);
      throw error;
    }
  },
  
  // Get a single port by ID
  async getPortById(id: string): Promise<Port> {
    try {
      await this.initCache();
      await simulateServerDelay(200); // Simulate server processing delay
      
      const port = portsCache.find(p => p.id === id);
      
      if (!port) {
        throw new Error(`Port with ID ${id} not found`);
      }
      
      return port;
    } catch (error) {
      console.error(`Error fetching port ${id}:`, error);
      throw error;
    }
  },
  
  // Create a new port (simulated server-side operation)
  async createPort(port: Omit<Port, "id">): Promise<Port> {
    try {
      await this.initCache();
      await simulateServerDelay(500); // Simulate server processing delay
      
      // Generate a new ID
      const newId = `PORT_${Date.now()}`;
      
      const newPort: Port = {
        ...port,
        id: newId
      };
      
      // Add to the cache
      portsCache.push(newPort);
      
      return newPort;
    } catch (error) {
      console.error("Error creating port:", error);
      throw error;
    }
  },
  
  // Update an existing port (simulated server-side operation)
  async updatePort(id: string, port: Partial<Port>): Promise<Port> {
    try {
      await this.initCache();
      await simulateServerDelay(500); // Simulate server processing delay
      
      const index = portsCache.findIndex(p => p.id === id);
      
      if (index === -1) {
        throw new Error(`Port with ID ${id} not found`);
      }
      
      // Update the port
      portsCache[index] = {
        ...portsCache[index],
        ...port
      };
      
      return portsCache[index];
    } catch (error) {
      console.error(`Error updating port ${id}:`, error);
      throw error;
    }
  },
  
  // Delete a port (simulated server-side operation)
  async deletePort(id: string): Promise<void> {
    try {
      await this.initCache();
      await simulateServerDelay(500); // Simulate server processing delay
      
      const index = portsCache.findIndex(p => p.id === id);
      
      if (index === -1) {
        throw new Error(`Port with ID ${id} not found`);
      }
      
      // Remove from the cache
      portsCache.splice(index, 1);
    } catch (error) {
      console.error(`Error deleting port ${id}:`, error);
      throw error;
    }
  },
  
  // Add column-specific filtering capability
  async getFilterOptions(columnId: string): Promise<string[]> {
    try {
      await this.initCache();
      await simulateServerDelay(300); // Simulate server processing delay
      
      // Get unique values for the specified column
      const uniqueValues = new Set<string>();
      
      portsCache.forEach(port => {
        let value: any;
        
        if (columnId.includes('.')) {
          // Handle nested properties
          try {
            value = columnId.split('.').reduce((obj, path) => obj && obj[path], port);
          } catch (e) {
            value = undefined;
          }
        } else {
          value = port[columnId];
        }
        
        if (value !== undefined && value !== null) {
          uniqueValues.add(value.toString());
        }
      });
      
      return Array.from(uniqueValues).sort();
    } catch (error) {
      console.error(`Error fetching filter options for ${columnId}:`, error);
      throw error;
    }
  }
};
