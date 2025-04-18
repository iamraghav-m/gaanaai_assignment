
import React from "react";
import { Button } from "@/components/ui/button";
import { TableColumn } from "@/types/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Columns } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ColumnVisibilityDropdownProps {
  columns: TableColumn[];
  toggleVisibility: (columnId: string) => void;
}

const ColumnVisibilityDropdown: React.FC<ColumnVisibilityDropdownProps> = ({
  columns,
  toggleVisibility,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Columns className="h-4 w-4" />
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            checked={column.isVisible}
            onCheckedChange={() => toggleVisibility(column.id)}
          >
            {column.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ColumnVisibilityDropdown;
