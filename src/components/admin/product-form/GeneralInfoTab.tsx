import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import MultipleImageUploader from "../MultipleImageUploader";
import ImageUploader from "../ImageUploader";
import FormRow from "./FormRow";
import FormSection from "./FormSection";

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
  handleAdditionalImagesChange,
}: GeneralInfoTabProps) => {
  
  return (
    <div className="space-y-6">
      {/* Main Product Information */}
      <FormSection title="Основная информация">
        <FormRow label="Название товара*" htmlFor="title">
          <Input
            id="title"
            name="title"
            value={formData.title || ""}
            onChange={handleInputChange}
            required
            placeholder="Введите название товара"
            className="w-full"
          />
        </FormRow>

        <FormRow label="Описание товара*" htmlFor="description">
          <Textarea
            id="description"
            name="description"
            value={formData.description || ""}
            onChange={handleInputChange}
            required
            placeholder="Введите описание товара"
            className="w-full min-h-[100px]"
          />
        </FormRow>

        <FormRow label="Категория*" htmlFor="category">
          {showNewCategoryInput ? (
            <div className="flex gap-2">
              <Input
                id="newCategory"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Введите новую категорию"
                className="w-full"
              />
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowNewCategoryInput(false)}
              >
                Отмена
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Select
                value={formData.category || ""}
                onValueChange={(value) => handleSelectChange(value, "category")}
              >
                <SelectTrigger id="category" className="w-full">
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
                <Plus className="h-4 w-4 mr-2" />
                Новая
              </Button>
            </div>
          )}
        </FormRow>
      </FormSection>

      {/* Product Pricing and Inventory */}
      <FormSection title="Цена и наличие">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormRow label="Цена*" htmlFor="price">
            <div className="relative">
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price || ""}
                onChange={handleInputChange}
                required
                placeholder="0"
                min="0"
                className="w-full pr-8"
              />
              <span className="absolute right-3 top-2 text-gray-500">₽</span>
            </div>
          </FormRow>

          <FormRow label="Цена со скидкой" htmlFor="discountPrice">
            <div className="relative">
              <Input
                id="discountPrice"
                name="discountPrice"
                type="number"
                value={formData.discountPrice || ""}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                className="w-full pr-8"
              />
              <span className="absolute right-3 top-2 text-gray-500">₽</span>
            </div>
          </FormRow>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormRow label="Количество на складе" htmlFor="stockQuantity">
            <Input
              id="stockQuantity"
              name="stockQuantity"
              type="number"
              value={formData.stockQuantity !== undefined ? formData.stockQuantity : ""}
              onChange={handleInputChange}
              placeholder="0"
              min="0"
              className="w-full"
            />
          </FormRow>

          <FormRow label="Артикул" htmlFor="articleNumber">
            <Input
              id="articleNumber"
              name="articleNumber"
              value={formData.articleNumber || ""}
              onChange={handleInputChange}
              placeholder="Введите артикул"
              className="w-full"
            />
          </FormRow>

          <FormRow label="Штрих-код" htmlFor="barcode">
            <Input
              id="barcode"
              name="barcode"
              value={formData.barcode || ""}
              onChange={handleInputChange}
              placeholder="Введите штрих-код"
              className="w-full"
            />
          </FormRow>
        </div>

        <FormRow label="Наличие" htmlFor="inStock">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="inStock"
              checked={formData.inStock ?? true}
              onCheckedChange={(checked) => handleCheckboxChange(!!checked, "inStock")}
            />
            <label
              htmlFor="inStock"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Товар в наличии
            </label>
          </div>
        </FormRow>
      </FormSection>

      {/* Product Flags */}
      <FormSection title="Метки товара">
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isNew"
              checked={formData.isNew ?? false}
              onCheckedChange={(checked) => handleCheckboxChange(!!checked, "isNew")}
            />
            <label
              htmlFor="isNew"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Новинка
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isBestseller"
              checked={formData.isBestseller ?? false}
              onCheckedChange={(checked) => handleCheckboxChange(!!checked, "isBestseller")}
            />
            <label
              htmlFor="isBestseller"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Хит продаж
            </label>
          </div>
        </div>
      </FormSection>

      {/* Product Images */}
      <FormSection title="Изображения товара">
        <div className="flex flex-col space-y-4">
          <div>
            <Label htmlFor="mainImage">Главное изображение*</Label>
            <div className="mt-2">
              <ImageUploader
                initialImage={formData.imageUrl || "/placeholder.svg"}
                onImageUploaded={handleMainImageUploaded}
                className="h-[200px] w-[200px]"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="additionalImages">Дополнительные изображения</Label>
            <div className="mt-2">
              <MultipleImageUploader
                images={formData.additionalImages || []}
                onChange={handleAdditionalImagesChange}
              />
            </div>
          </div>
        </div>
      </FormSection>
    </div>
  );
};

export default GeneralInfoTab;
