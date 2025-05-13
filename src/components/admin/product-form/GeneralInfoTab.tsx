
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@/types/product";
import ImageUploader from "@/components/admin/ImageUploader";
import MultipleImageUploader from "@/components/admin/MultipleImageUploader";

interface GeneralInfoTabProps {
  formData: Partial<Product>;
  categories: string[];
  showNewCategoryInput: boolean;
  newCategory: string;
  setNewCategory: (value: string) => void;
  setShowNewCategoryInput: (value: boolean) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (value: string, name: string) => void;
  handleCheckboxChange: (checked: boolean, name: string) => void;
  handleMainImageUploaded: (url: string) => void;
  handleAdditionalImagesChange: (urls: string[]) => void;
}

const GeneralInfoTab = ({
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
}: GeneralInfoTabProps) => {
  // Create a helper function to handle stock quantity changes properly
  const handleStockQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : undefined;
    
    // Create a synthetic event that matches the expected interface
    const syntheticEvent = {
      target: {
        name: "stockQuantity",
        value: value !== undefined ? value.toString() : ""
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleInputChange(syntheticEvent);
  };

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="title" className="text-right">
          Название *
        </Label>
        <Input
          id="title"
          name="title"
          value={formData.title || ""}
          onChange={handleInputChange}
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="articleNumber" className="text-right">
          Артикул
        </Label>
        <Input
          id="articleNumber"
          name="articleNumber"
          value={formData.articleNumber || ""}
          onChange={handleInputChange}
          className="col-span-3"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="barcode" className="text-right">
          Штрих-код
        </Label>
        <Input
          id="barcode"
          name="barcode"
          value={formData.barcode || ""}
          onChange={handleInputChange}
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="category" className="text-right">
          Категория *
        </Label>
        {showNewCategoryInput ? (
          <div className="col-span-3 flex gap-2">
            <Input
              id="newCategory"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Введите новую категорию"
              className="flex-1"
            />
            <button 
              className="px-3 py-2 border rounded-md text-sm"
              onClick={() => {
                setShowNewCategoryInput(false);
                setNewCategory("");
              }}
            >
              Отмена
            </button>
          </div>
        ) : (
          <Select
            value={formData.category || ""}
            onValueChange={(value) => handleSelectChange(value, "category")}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Выберите категорию" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
              <SelectItem value="new">Новая категория</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="price" className="text-right">
          Базовая цена *
        </Label>
        <Input
          id="price"
          name="price"
          type="number"
          value={formData.price || ""}
          onChange={handleInputChange}
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="stockQuantity" className="text-right">
          Количество на складе
        </Label>
        <Input
          id="stockQuantity"
          name="stockQuantity"
          type="number"
          value={formData.stockQuantity !== undefined ? formData.stockQuantity : ""}
          onChange={handleStockQuantityChange}
          min="0"
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="discountPrice" className="text-right">
          Цена со скидкой
        </Label>
        <Input
          id="discountPrice"
          name="discountPrice"
          type="number"
          value={formData.discountPrice || ""}
          onChange={handleInputChange}
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="description" className="text-right">
          Описание *
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description || ""}
          onChange={handleInputChange}
          className="col-span-3"
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-4 items-start gap-4">
        <Label className="text-right">
          Основное изображение
        </Label>
        <div className="col-span-3">
          <ImageUploader
            initialImageUrl={formData.imageUrl}
            onImageUploaded={handleMainImageUploaded}
            onRemoveImage={() => handleMainImageUploaded("/placeholder.svg")}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-4 items-start gap-4">
        <Label className="text-right">
          Дополнительные изображения
        </Label>
        <div className="col-span-3">
          <MultipleImageUploader
            initialImageUrls={formData.additionalImages}
            onImagesChange={handleAdditionalImagesChange}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="material" className="text-right">
          Материал
        </Label>
        <Input
          id="material"
          name="material"
          value={formData.material || ""}
          onChange={handleInputChange}
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="countryOfOrigin" className="text-right">
          Страна происхождения
        </Label>
        <Input
          id="countryOfOrigin"
          name="countryOfOrigin"
          value={formData.countryOfOrigin || ""}
          onChange={handleInputChange}
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <div className="text-right">Опции</div>
        <div className="col-span-3 space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="inStock"
              checked={formData.inStock || false}
              onCheckedChange={(checked) => 
                handleCheckboxChange(!!checked, "inStock")
              }
            />
            <Label htmlFor="inStock">В наличии</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isNew"
              checked={formData.isNew || false}
              onCheckedChange={(checked) => 
                handleCheckboxChange(!!checked, "isNew")
              }
            />
            <Label htmlFor="isNew">Новинка</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isBestseller"
              checked={formData.isBestseller || false}
              onCheckedChange={(checked) => 
                handleCheckboxChange(!!checked, "isBestseller")
              }
            />
            <Label htmlFor="isBestseller">Бестселлер</Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralInfoTab;
