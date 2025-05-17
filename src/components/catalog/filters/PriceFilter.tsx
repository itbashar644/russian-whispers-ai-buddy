
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PriceFilterProps {
  priceRange: { min: number; max: number };
  handlePriceChange: (type: "min" | "max", value: string) => void;
  loading: boolean;
}

const PriceFilter: React.FC<PriceFilterProps> = ({
  priceRange,
  handlePriceChange,
  loading
}) => {
  return (
    <div className="border-t pt-6">
      <h3 className="font-semibold mb-4">Цена</h3>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="min-price">От</Label>
          <Input
            id="min-price"
            type="number"
            value={priceRange.min}
            onChange={(e) => handlePriceChange("min", e.target.value)}
            min={0}
            disabled={loading}
          />
        </div>
        <div>
          <Label htmlFor="max-price">До</Label>
          <Input
            id="max-price"
            type="number"
            value={priceRange.max}
            onChange={(e) => handlePriceChange("max", e.target.value)}
            min={0}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;
