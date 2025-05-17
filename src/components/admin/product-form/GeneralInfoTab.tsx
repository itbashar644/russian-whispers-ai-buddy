
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import MultipleImageUploader from "@/components/admin/MultipleImageUploader";
import { Product } from "@/types/product";

export interface GeneralInfoTabProps {
  formData: Partial<Product>;
  categories: string[];
  showNewCategoryInput: boolean;
  newCategory: string;
  setNewCategory: (category: string) => void;
  setShowNewCategoryInput: (show: boolean) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleCheckboxChange: (checked: boolean, name: string) => void;
  handleMainImageUploaded: (url: string) => void;
  handleAdditionalImagesChange: (urls: string[]) => void;
}

const GeneralInfoTab: React.FC<GeneralInfoTabProps> = ({
  formData,
  categories,
  showNewCategoryInput,
  newCategory,
  setNewCategory,
  setShowNewCategoryInput,
  handleInputChange,
  handleSelectChange,
  handleCheckboxChange,
  handleMainImageUploaded,
  handleAdditionalImagesChange
}) => {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Название товара *</Label>
        <Input
          id="title"
          name="title"
          value={formData.title || ""}
          onChange={handleInputChange}
          placeholder="Введите название товара"
          required
        />
      </div>
      
      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Описание товара *</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description || ""}
          onChange={handleInputChange}
          placeholder="Введите описание товара"
          className="h-24"
          required
        />
      </div>
      
      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category">Категория *</Label>
        <div className="flex gap-2">
          {!showNewCategoryInput ? (
            <>
              <Select
                value={formData.category || ""}
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowNewCategoryInput(true)}
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">Add new category</span>
              </Button>
            </>
          ) : (
            <>
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Новая категория"
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  if (newCategory.trim()) {
                    handleSelectChange("category", newCategory.trim());
                  }
                  setShowNewCategoryInput(false);
                }}
              >
                Добавить
              </Button>
              <Button 
                type="button" 
                variant="ghost"
                onClick={() => setShowNewCategoryInput(false)}
              >
                Отмена
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* Model and Variant */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="modelName">Модель (для объединения)</Label>
          <Input
            id="modelName"
            name="modelName"
            value={formData.modelName || ""}
            onChange={handleInputChange}
            placeholder="Код модели для объединения товаров"
          />
          <p className="text-xs text-muted-foreground">
            Товары с одинаковым кодом модели будут объединены в группу
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="variantName">Вариант товара</Label>
          <Input
            id="variantName"
            name="variantName"
            value={formData.variantName || ""}
            onChange={handleInputChange}
            placeholder="Название варианта (размер, цвет и т.д.)"
          />
          <p className="text-xs text-muted-foreground">
            Отображается в списке вариантов товара
          </p>
        </div>
      </div>
      
      {/* Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Цена (₽) *</Label>
          <Input
            id="price"
            name="price"
            type="number"
            value={formData.price || ""}
            onChange={handleInputChange}
            min="0"
            step="0.01"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="discountPrice">Цена со скидкой (₽)</Label>
          <Input
            id="discountPrice"
            name="discountPrice"
            type="number"
            value={formData.discountPrice || ""}
            onChange={handleInputChange}
            min="0"
            step="0.01"
          />
        </div>
      </div>
      
      {/* Images */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Основное изображение *</Label>
          <ImageUploader
            currentImageUrl={formData.imageUrl}
            onImageUploaded={handleMainImageUploaded}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label>Дополнительные изображения</Label>
          <MultipleImageUploader
            imageUrls={formData.additionalImages || []}
            onChange={handleAdditionalImagesChange}
          />
        </div>
      </div>
      
      {/* Country of Origin */}
      <div className="space-y-2">
        <Label htmlFor="countryOfOrigin">Страна происхождения *</Label>
        <Input
          id="countryOfOrigin"
          name="countryOfOrigin"
          value={formData.countryOfOrigin || ""}
          onChange={handleInputChange}
          placeholder="Укажите страну происхождения"
          required
        />
      </div>
      
      {/* Stock options */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="inStock"
            checked={formData.inStock || false}
            onCheckedChange={(checked) => handleCheckboxChange(checked, "inStock")}
          />
          <Label htmlFor="inStock">В наличии</Label>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="stockQuantity">Количество на складе</Label>
        <Input
          id="stockQuantity"
          name="stockQuantity"
          type="number"
          value={formData.stockQuantity !== undefined ? formData.stockQuantity : ""}
          onChange={handleInputChange}
          min="0"
          placeholder="Количество единиц товара"
        />
      </div>
      
      {/* Product flags */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isNew"
            checked={formData.isNew || false}
            onCheckedChange={(checked) => 
              handleCheckboxChange(checked as boolean, "isNew")
            }
          />
          <Label htmlFor="isNew">Новинка</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isBestseller"
            checked={formData.isBestseller || false}
            onCheckedChange={(checked) => 
              handleCheckboxChange(checked as boolean, "isBestseller")
            }
          />
          <Label htmlFor="isBestseller">Хит продаж</Label>
        </div>
      </div>
    </div>
  );
};

export default GeneralInfoTab;
