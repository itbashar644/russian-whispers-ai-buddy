
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface ColorFilterProps {
  availableColors: string[];
  colorParam: string | null;
  handleColorFilter: (color: string | null) => void;
  loading?: boolean;
}

const ColorFilter: React.FC<ColorFilterProps> = ({
  availableColors,
  colorParam,
  handleColorFilter,
  loading = false
}) => {
  if (availableColors.length === 0) return null;

  return (
    <div className="border-t pt-6">
      <h3 className="font-semibold mb-4">Цвет</h3>
      <div className="flex flex-wrap gap-2">
        {availableColors.map((color) => (
          <Badge
            key={color}
            variant={colorParam === color ? "default" : "outline"}
            className="cursor-pointer flex items-center px-3 py-1.5"
            onClick={() => handleColorFilter(colorParam === color ? null : color)}
          >
            {colorParam === color && <Check className="mr-1 h-3 w-3" />}
            {color}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default ColorFilter;
