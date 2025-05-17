
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Palette, Grid3X3, List } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface DisplayOptionsProps {
  showColorVariants: boolean;
  setShowColorVariants: (show: boolean) => void;
  loading: boolean;
}

const DisplayOptions: React.FC<DisplayOptionsProps> = ({
  showColorVariants,
  setShowColorVariants,
  loading
}) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="show-colors" 
          checked={showColorVariants} 
          onCheckedChange={() => setShowColorVariants(!showColorVariants)} 
          disabled={loading}
        />
        <label
          htmlFor="show-colors"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
        >
          <Palette className="h-4 w-4 mr-1.5" />
          Варианты цветов
        </label>
      </div>
    </div>
  );
};

export default DisplayOptions;
