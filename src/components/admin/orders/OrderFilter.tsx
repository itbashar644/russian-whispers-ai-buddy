
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Archive } from "lucide-react";

interface OrderFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  showArchived: boolean;
  onToggleArchived: () => void;
}

const OrderFilter: React.FC<OrderFilterProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  showArchived,
  onToggleArchived,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-1/3">
        <Input
          placeholder="Поиск по ID, имени или контактам"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="w-full md:w-1/3">
        <Select
          value={statusFilter}
          onValueChange={onStatusChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Все статусы" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="new">Новые</SelectItem>
            <SelectItem value="processing">В обработке</SelectItem>
            <SelectItem value="shipped">Отправленные</SelectItem>
            <SelectItem value="delivered">Доставленные</SelectItem>
            <SelectItem value="cancelled">Отмененные</SelectItem>
            <SelectItem value="archived">Архивированные</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full md:w-1/3 flex items-center space-x-2">
        <Button 
          variant={showArchived ? "default" : "outline"} 
          onClick={onToggleArchived}
        >
          <Archive className="h-4 w-4 mr-2" />
          {showArchived ? "Скрыть архивные" : "Показать архивные"}
        </Button>
      </div>
    </div>
  );
};

export default OrderFilter;
