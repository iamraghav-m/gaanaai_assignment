
import React, { useState, useEffect } from "react";
import { Filter, Loader2, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

interface ColumnFilterPopoverProps {
  columnId: string;
  filterValue: string;
  onApplyFilter: (columnId: string, value: string) => void;
  onClearFilter: (columnId: string) => void;
  isActive: boolean;
}

const ColumnFilterPopover = ({
  columnId,
  filterValue,
  onApplyFilter,
  onClearFilter,
  isActive,
}: ColumnFilterPopoverProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [inputValue, setInputValue] = useState(filterValue || "");
  
  // Reset input value when filter value changes
  useEffect(() => {
    setInputValue(filterValue || "");
  }, [filterValue]);
  
  // Reset search when popover opens/closes
  useEffect(() => {
    if (!open) {
      setSearchValue("");
    }
  }, [open]);
  
  // Fetch filter options from API
  const { data: filterOptions = [], isLoading } = useQuery({
    queryKey: ["filterOptions", columnId],
    queryFn: () => api.getFilterOptions(columnId),
    enabled: open, // Only fetch when popover is open
  });
  
  // Filter options based on search
  const filteredOptions = filterOptions.filter(option => 
    option.toLowerCase().includes(searchValue.toLowerCase())
  );
  
  // Handle filter application
  const handleApplyFilter = () => {
    onApplyFilter(columnId, inputValue);
    setOpen(false);
  };
  
  // Handle filter clearing
  const handleClearFilter = () => {
    onClearFilter(columnId);
    setInputValue("");
    setOpen(false);
  };
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`h-6 w-6 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start">
        <div className="space-y-3">
          <div className="space-y-1">
            <h4 className="text-sm font-medium">Filter</h4>
            <p className="text-xs text-muted-foreground">
              Filter values for this column
            </p>
          </div>
          
          <Input 
            placeholder="Search values..." 
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="h-8"
          />
          
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <p className="text-xs font-medium">Select value</p>
              {inputValue && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5"
                  onClick={() => setInputValue("")}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            
            <ScrollArea className="h-40 rounded-md border">
              {isLoading ? (
                <div className="p-2 space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-6 w-full" />
                  ))}
                </div>
              ) : filteredOptions.length === 0 ? (
                <div className="p-2 text-center text-sm text-muted-foreground">
                  No options found
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {filteredOptions.map((option) => (
                    <Button
                      key={option}
                      variant="ghost"
                      className={`w-full justify-start text-xs h-7 ${inputValue === option ? 'bg-muted' : ''}`}
                      onClick={() => setInputValue(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilter}
              className="text-xs h-8"
            >
              Clear
            </Button>
            <Button
              size="sm"
              onClick={handleApplyFilter}
              disabled={!inputValue}
              className="text-xs h-8"
            >
              Apply Filter
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColumnFilterPopover;
