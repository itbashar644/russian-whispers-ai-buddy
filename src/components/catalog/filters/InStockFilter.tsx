
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface InStockFilterProps {
  inStockOnly: boolean;
  handleInStockChange: (checked: boolean) => void;
  loading: boolean;
}

const InStockFilter: React.FC<InStockFilterProps> = ({
  inStockOnly,
  handleInStockChange,
  loading
}) => {
  return (
    <div className="border-t pt-6">
      <h3 className="font-semibold mb-4">Наличие</h3>
      <div className="flex items-center space-x-2">
        <Switch
          id="in-stock"
          checked={inStockOnly}
          onCheckedChange={handleInStockChange}
          disabled={loading}
        />
        <Label htmlFor="in-stock" className="cursor-pointer">
          Только в наличии
        </Label>
      </div>
    </div>
  );
};

export default InStockFilter;
