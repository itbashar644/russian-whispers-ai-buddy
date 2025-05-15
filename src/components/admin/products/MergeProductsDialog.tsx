import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Product } from "@/types/product";

interface MergeProductsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProducts: Product[];
  onMerge: (modelName: string, groupBy: 'color' | 'variableCharacteristic') => void;
}

const MergeProductsDialog: React.FC<MergeProductsDialogProps> = ({
  isOpen,
  onClose,
  selectedProducts,
  onMerge
}) => {
  const [modelName, setModelName] = useState('');
  const [groupBy, setGroupBy] = useState<'color' | 'variableCharacteristic'>('color');
  
  // Initialize model name when products are selected
  useEffect(() => {
    if (selectedProducts.length > 0) {
      // Try to use the model name from the first product if available
      const firstProductModel = selectedProducts[0].modelName;
      
      if (firstProductModel) {
        setModelName(firstProductModel);
      } else {
        // Otherwise use the product title
        setModelName(selectedProducts[0].title);
      }
    }
  }, [selectedProducts]);
  
  const handleSubmit = () => {
    if (modelName.trim()) {
      onMerge(modelName.trim(), groupBy);
      onClose();
    }
  };
  
  const hasVariableCharacteristics = selectedProducts.some(
    p => p.variableCharacteristicName && p.variableCharacteristicValue
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Объединение товаров</DialogTitle>
          <DialogDescription>
            Объединение позволит группировать товары как варианты одной модели.
            Выберите, как именно группировать товары.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="modelName">Название модели</Label>
            <Input
              id="modelName"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="Введите общее название модели для объединяемых товаров"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Объединить по</Label>
            <RadioGroup value={groupBy} onValueChange={(value) => setGroupBy(value as 'color' | 'variableCharacteristic')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="color" id="groupByColor" />
                <Label htmlFor="groupByColor" className="cursor-pointer">Цвету</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value="variableCharacteristic" 
                  id="groupByVariable" 
                  disabled={!hasVariableCharacteristics}
                />
                <Label 
                  htmlFor="groupByVariable" 
                  className={`cursor-pointer ${!hasVariableCharacteristics ? 'text-muted-foreground' : ''}`}
                >
                  Переменной характеристике
                  {!hasVariableCharacteristics && (
                    <span className="text-xs block text-muted-foreground">
                      (недоступно: у товаров не заполнены переменные характеристики)
                    </span>
                  )}
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2 border-t pt-2">
            <p className="text-sm text-muted-foreground">
              Выбранные товары ({selectedProducts.length}):
            </p>
            <div className="max-h-[150px] overflow-y-auto space-y-1">
              {selectedProducts.map(product => (
                <div key={product.id} className="text-sm">
                  {product.title}
                  {product.variableCharacteristicName && (
                    <span className="text-xs text-muted-foreground ml-2">
                      ({product.variableCharacteristicName}: {product.variableCharacteristicValue})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Отмена</Button>
          <Button onClick={handleSubmit} disabled={!modelName.trim()}>Объединить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MergeProductsDialog;
