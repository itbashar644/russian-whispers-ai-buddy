
import React from "react";
import PriceRangeSlider from "./PriceRangeSlider";

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
      <h3 className="font-semibold mb-4">Цена, ₽</h3>
      <PriceRangeSlider 
        priceRange={priceRange}
        handlePriceChange={handlePriceChange}
        loading={loading}
        maxAllowedPrice={500000000}
      />
    </div>
  );
};

export default PriceFilter;
