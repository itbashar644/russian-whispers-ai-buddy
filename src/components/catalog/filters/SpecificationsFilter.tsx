
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface SpecificationsFilterProps {
  availableSpecifications: Record<string, string[]>;
  specFilters: Record<string, string>;
  handleSpecFilter: (key: string, value: string) => void;
}

const SpecificationsFilter: React.FC<SpecificationsFilterProps> = ({
  availableSpecifications,
  specFilters,
  handleSpecFilter
}) => {
  // If no specifications available or availableSpecifications is undefined/null, don't render anything
  if (!availableSpecifications || Object.keys(availableSpecifications).length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Характеристики</h3>
      {Object.entries(availableSpecifications).map(([specKey, specValues]) => (
        <div key={specKey} className="space-y-2">
          <Label htmlFor={`spec-${specKey}`} className="text-sm">
            {specKey}
          </Label>
          <Select
            value={specFilters[specKey] || ""}
            onValueChange={(value) => handleSpecFilter(specKey, value)}
          >
            <SelectTrigger id={`spec-${specKey}`} className="w-full">
              <SelectValue placeholder="Все значения" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Все значения</SelectItem>
              {specValues.map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
};

export default SpecificationsFilter;
