
import React from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PriceRangeSliderProps {
  priceRange: { min: number; max: number };
  handlePriceChange: (type: "min" | "max", value: string) => void;
  loading: boolean;
  maxAllowedPrice?: number;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  priceRange,
  handlePriceChange,
  loading,
  maxAllowedPrice = 5000
}) => {
  const handleSliderChange = (value: number[]) => {
    if (value.length >= 2) {
      handlePriceChange("min", value[0].toString());
      handlePriceChange("max", value[1].toString());
    }
  };

  return (
    <div className="space-y-4">
      <div className="pt-4">
        <Slider
          disabled={loading}
          defaultValue={[priceRange.min, priceRange.max]}
          value={[priceRange.min, priceRange.max]}
          max={maxAllowedPrice}
          step={100}
          onValueChange={handleSliderChange}
          className="my-6"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="min-price">От</Label>
          <Input
            id="min-price"
            type="number"
            value={priceRange.min}
            onChange={(e) => handlePriceChange("min", e.target.value)}
            min={0}
            max={priceRange.max}
            disabled={loading}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="max-price">До</Label>
          <Input
            id="max-price"
            type="number"
            value={priceRange.max}
            onChange={(e) => handlePriceChange("max", e.target.value)}
            min={priceRange.min}
            max={maxAllowedPrice}
            disabled={loading}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
};

export default PriceRangeSlider;
