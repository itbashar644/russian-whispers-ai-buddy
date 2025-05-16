
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PriceFilterProps {
  priceRange: { min: number; max: number };
  handlePriceChange: (value: { min: number; max: number }) => void;
  loading: boolean;
}

const PriceFilter: React.FC<PriceFilterProps> = ({
  priceRange,
  handlePriceChange,
  loading
}) => {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const minValue = parseInt(e.target.value) || 0;
    handlePriceChange({ min: minValue, max: priceRange.max });
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maxValue = parseInt(e.target.value) || 0;
    handlePriceChange({ min: priceRange.min, max: maxValue });
  };

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
            onChange={handleMinChange}
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
            onChange={handleMaxChange}
            min={0}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;
