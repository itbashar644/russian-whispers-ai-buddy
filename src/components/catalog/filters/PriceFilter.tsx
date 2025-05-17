
import React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

interface PriceFilterProps {
  priceRange: { min: number; max: number };
  handlePriceChange: (value: { min: number; max: number }) => void;
  loading?: boolean;
  maxPrice?: number;
}

const PriceFilter: React.FC<PriceFilterProps> = ({
  priceRange,
  handlePriceChange,
  loading = false,
  maxPrice = 50000
}) => {
  // Handle slider value change
  const handleSliderChange = (value: number[]) => {
    if (value.length === 2) {
      handlePriceChange({ min: value[0], max: value[1] });
    }
  };

  // Handle input changes
  const handleInputChange = (type: "min" | "max", value: string) => {
    const numValue = parseInt(value) || 0;
    if (type === "min") {
      handlePriceChange({ min: numValue, max: priceRange.max });
    } else {
      handlePriceChange({ min: priceRange.min, max: numValue });
    }
  };

  return (
    <div className="border-t pt-6">
      <h3 className="font-semibold mb-4">Цена</h3>
      <div className="space-y-4">
        <Slider
          disabled={loading}
          defaultValue={[priceRange.min, priceRange.max]}
          value={[priceRange.min, priceRange.max]}
          max={maxPrice}
          step={100}
          onValueChange={handleSliderChange}
        />
        <div className="flex items-center gap-2">
          <div className="flex-1 space-y-1">
            <Label htmlFor="minPrice">От</Label>
            <Input
              disabled={loading}
              type="number"
              id="minPrice"
              value={priceRange.min}
              onChange={(e) => handleInputChange("min", e.target.value)}
              min={0}
              max={priceRange.max}
            />
          </div>
          <div className="flex-1 space-y-1">
            <Label htmlFor="maxPrice">До</Label>
            <Input
              disabled={loading}
              type="number"
              id="maxPrice"
              value={priceRange.max}
              onChange={(e) => handleInputChange("max", e.target.value)}
              min={priceRange.min}
              max={maxPrice}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;
