
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColorVariant } from "@/types/product";
import { Plus, X, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUploader from "@/components/admin/ImageUploader";

interface ColorVariantManagerProps {
  colorVariants: ColorVariant[];
  onChange: (variants: ColorVariant[]) => void;
  basePrice: number;
}

const ColorVariantManager: React.FC<ColorVariantManagerProps> = ({
  colorVariants,
  onChange,
  basePrice
}) => {
  const [newColor, setNewColor] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<ColorVariant>({
    color: "",
    price: basePrice,
  });

  const handleAddColor = () => {
    if (newColor.trim()) {
      // Check if color already exists
      if (colorVariants.some(v => v.color.toLowerCase() === newColor.trim().toLowerCase())) {
        return; // Color already exists
      }
      
      const newVariant: ColorVariant = {
        color: newColor.trim(),
        price: basePrice,
        stockQuantity: 0
      };
      
      onChange([...colorVariants, newVariant]);
      setNewColor("");
    }
  };

  const handleRemoveColor = (index: number) => {
    const updatedVariants = [...colorVariants];
    updatedVariants.splice(index, 1);
    onChange(updatedVariants);
    
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  const handleEditStart = (index: number) => {
    setEditingIndex(index);
    setEditForm({...colorVariants[index]});
  };

  const handleEditSave = () => {
    if (editingIndex === null) return;
    
    const updatedVariants = [...colorVariants];
    updatedVariants[editingIndex] = editForm;
    onChange(updatedVariants);
    setEditingIndex(null);
  };

  const handleEditCancel = () => {
    setEditingIndex(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: name === "price" || name === "discountPrice" || name === "stockQuantity"
        ? parseFloat(value)
        : value,
    });
  };

  const handleImageChange = (url: string) => {
    setEditForm({
      ...editForm,
      imageUrl: url
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
          placeholder="Название цвета"
          className="flex-1"
        />
        <Button onClick={handleAddColor} type="button">
          <Plus className="mr-2 h-4 w-4" />
          Добавить цвет
        </Button>
      </div>

      {colorVariants.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {colorVariants.map((variant, index) => (
            <Card key={index} className={editingIndex === index ? "border-2 border-primary" : ""}>
              <CardHeader className="p-4 pb-2 flex flex-row justify-between items-center">
                <CardTitle className="text-base flex items-center">
                  <div 
                    className="h-4 w-4 rounded-full mr-2"
                    style={{
                      backgroundColor: variant.color.toLowerCase(),
                      border: "1px solid #ccc"
                    }}
                  />
                  {variant.color}
                </CardTitle>
                <div className="flex space-x-1">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleEditStart(index)}
                    className="h-8 w-8"
                    title="Редактировать вариант"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleRemoveColor(index)}
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                    title="Удалить вариант"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                {editingIndex === index ? (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor={`color-${index}`}>Название цвета</Label>
                      <Input
                        id={`color-${index}`}
                        name="color"
                        value={editForm.color}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`price-${index}`}>Цена</Label>
                      <Input
                        id={`price-${index}`}
                        name="price"
                        type="number"
                        value={editForm.price}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`discountPrice-${index}`}>Цена со скидкой</Label>
                      <Input
                        id={`discountPrice-${index}`}
                        name="discountPrice"
                        type="number"
                        value={editForm.discountPrice || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`articleNumber-${index}`}>Артикул</Label>
                      <Input
                        id={`articleNumber-${index}`}
                        name="articleNumber"
                        value={editForm.articleNumber || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`barcode-${index}`}>Штрих-код</Label>
                      <Input
                        id={`barcode-${index}`}
                        name="barcode"
                        value={editForm.barcode || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`stockQuantity-${index}`}>Количество на складе</Label>
                      <Input
                        id={`stockQuantity-${index}`}
                        name="stockQuantity"
                        type="number"
                        value={editForm.stockQuantity || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label>Изображение для этого цвета</Label>
                      <ImageUploader
                        initialImageUrl={editForm.imageUrl || ""}
                        onImageUploaded={handleImageChange}
                        onRemoveImage={() => handleImageChange("")}
                      />
                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                      <Button variant="outline" onClick={handleEditCancel}>Отмена</Button>
                      <Button onClick={handleEditSave}>Сохранить</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Цена:</span>
                      <span className="font-medium">{variant.price.toLocaleString()} ₽</span>
                    </div>
                    {variant.discountPrice && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Цена со скидкой:</span>
                        <span className="font-medium">{variant.discountPrice.toLocaleString()} ₽</span>
                      </div>
                    )}
                    {variant.articleNumber && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Артикул:</span>
                        <span>{variant.articleNumber}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Количество:</span>
                      <span>{variant.stockQuantity || 0} шт.</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorVariantManager;
