
import React from "react";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PriceFilterProps {
  priceRange: { min: number; max: number };
  maxPrice?: number;
  sortBy?: string;
  loading?: boolean;
  handlePriceChange: (value: { min: number; max: number }) => void;
  handleSortChange?: (value: string) => void;
}

const PriceFilter: React.FC<PriceFilterProps> = ({
  priceRange,
  maxPrice = 50000,
  sortBy = "default",
  loading = false,
  handlePriceChange,
  handleSortChange,
}) => {
  const handleSliderChange = (values: number[]) => {
    if (values.length === 2) {
      handlePriceChange({
        min: values[0],
        max: values[1],
      });
    }
  };

  return (
    <div className="space-y-6">
      {handleSortChange && (
        <div>
          <h3 className="font-semibold mb-4">Сортировка</h3>
          <Select value={sortBy} onValueChange={handleSortChange} disabled={loading}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Сортировать по" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="default">По умолчанию</SelectItem>
                <SelectItem value="price-asc">По цене (возр.)</SelectItem>
                <SelectItem value="price-desc">По цене (убыв.)</SelectItem>
                <SelectItem value="name-asc">По названию (А-Я)</SelectItem>
                <SelectItem value="name-desc">По названию (Я-А)</SelectItem>
                <SelectItem value="rating">По рейтингу</SelectItem>
                <SelectItem value="in-stock">В наличии</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className={handleSortChange ? "border-t pt-6" : ""}>
        <div className="flex justify-between mb-4">
          <h3 className="font-semibold">Цена</h3>
          <div className="text-sm">
            {priceRange.min} ₽ - {priceRange.max} ₽
          </div>
        </div>
        
        <Slider
          defaultValue={[priceRange.min, priceRange.max]}
          min={0}
          max={maxPrice}
          step={100}
          value={[priceRange.min, priceRange.max]}
          onValueChange={handleSliderChange}
          className="my-6"
          disabled={loading}
        />
        
        <div className="flex gap-4 items-center">
          <div className="grid w-full items-center gap-1.5">
            <input
              type="number"
              value={priceRange.min}
              onChange={(e) => 
                handlePriceChange({ 
                  min: Math.max(0, parseInt(e.target.value) || 0), 
                  max: priceRange.max 
                })
              }
              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
              disabled={loading}
            />
          </div>
          <span>-</span>
          <div className="grid w-full items-center gap-1.5">
            <input
              type="number"
              value={priceRange.max}
              onChange={(e) => 
                handlePriceChange({
                  min: priceRange.min, 
                  max: Math.min(maxPrice, parseInt(e.target.value) || maxPrice)
                })
              }
              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;
