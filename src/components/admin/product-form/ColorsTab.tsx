
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Product, ColorVariant } from "@/types/product";
import ColorVariantManager from "@/components/admin/ColorVariantManager";

interface ColorsTabProps {
  formData: Partial<Product>;
  handleColorVariantsChange: (variants: ColorVariant[]) => void;
  handleRemoveColor: (colorToRemove: string) => void;
}

const ColorsTab = ({
  formData,
  handleColorVariantsChange,
  handleRemoveColor
}: ColorsTabProps) => {
  const [newColor, setNewColor] = useState("");

  const handleAddColor = () => {
    if (newColor.trim() && !formData.colors?.includes(newColor.trim())) {
      const updatedColors = [...(formData.colors || []), newColor.trim()];
      handleRemoveColor(newColor.trim());
      setNewColor("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-muted/30 p-4 rounded-lg">
        <h3 className="text-sm font-medium mb-2">Управление цветовыми вариантами</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Здесь вы можете добавить варианты товара с разными цветами. Для каждого цвета можно указать свою цену, артикул и количество на складе.
        </p>
        
        <ColorVariantManager
          colorVariants={formData.colorVariants || []}
          onChange={handleColorVariantsChange}
          basePrice={formData.price || 0}
        />
      </div>
      
      <div className="bg-muted/30 p-4 rounded-lg">
        <h3 className="text-sm font-medium mb-2">Список доступных цветов (устаревший)</h3>
        <p className="text-sm text-muted-foreground mb-2">
          Простой список доступных цветов для совместимости. Рекомендуем использовать цветовые варианты выше.
        </p>
        
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              placeholder="Название цвета"
              className="flex-1"
            />
            <Button 
              type="button" 
              onClick={handleAddColor}
              variant="secondary"
            >
              Добавить
            </Button>
          </div>
          
          {formData.colors && formData.colors.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.colors.map((color) => (
                <div 
                  key={color}
                  className="flex items-center bg-muted rounded-md px-3 py-1 text-sm"
                >
                  <span>{color}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-2 text-muted-foreground hover:text-foreground"
                    onClick={() => handleRemoveColor(color)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ColorsTab;
