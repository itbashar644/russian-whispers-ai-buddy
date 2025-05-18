
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
import { FormRow } from './FormRow';
import { FormSection } from './FormSection';

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
      <BasicInformationSection 
        formData={formData}
        handleInputChange={handleInputChange}
      />
      
      <CategorySection 
        formData={formData}
        categories={categories}
        showNewCategoryInput={showNewCategoryInput}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        setShowNewCategoryInput={setShowNewCategoryInput}
        handleSelectChange={handleSelectChange}
      />
      
      <PricingSection 
        formData={formData}
        handleInputChange={handleInputChange}
        handleStockQuantityChange={handleStockQuantityChange}
      />
      
      <DescriptionSection 
        formData={formData}
        handleInputChange={handleInputChange}
      />
      
      <ImagesSection 
        formData={formData}
        handleMainImageUploaded={handleMainImageUploaded}
        handleAdditionalImagesChange={handleAdditionalImagesChange}
      />
      
      <MaterialSection 
        formData={formData}
        handleInputChange={handleInputChange}
      />
      
      <ProductOptionsSection 
        formData={formData}
        handleCheckboxChange={handleCheckboxChange}
      />
    </div>
  );
};

// Separate components for each section
const BasicInformationSection = ({ 
  formData, 
  handleInputChange 
}: { 
  formData: Partial<Product>; 
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}) => (
  <FormSection>
    <FormRow label="Название *" htmlFor="title">
      <Input
        id="title"
        name="title"
        value={formData.title || ""}
        onChange={handleInputChange}
      />
    </FormRow>
    
    <FormRow label="Модель (для объединения)" htmlFor="modelName">
      <Input
        id="modelName"
        name="modelName"
        value={formData.modelName || ""}
        onChange={handleInputChange}
        placeholder="Введите название модели для объединения товаров"
      />
    </FormRow>
    
    <FormRow label="Артикул" htmlFor="articleNumber">
      <Input
        id="articleNumber"
        name="articleNumber"
        value={formData.articleNumber || ""}
        onChange={handleInputChange}
      />
    </FormRow>

    <FormRow label="Штрих-код" htmlFor="barcode">
      <Input
        id="barcode"
        name="barcode"
        value={formData.barcode || ""}
        onChange={handleInputChange}
      />
    </FormRow>
  </FormSection>
);

const CategorySection = ({ 
  formData, 
  categories,
  showNewCategoryInput,
  newCategory,
  setNewCategory,
  setShowNewCategoryInput,
  handleSelectChange 
}: { 
  formData: Partial<Product>;
  categories: string[];
  showNewCategoryInput: boolean;
  newCategory: string;
  setNewCategory: (value: string) => void;
  setShowNewCategoryInput: (value: boolean) => void;
  handleSelectChange: (value: string, name: string) => void;
}) => (
  <FormSection>
    <FormRow label="Категория *" htmlFor="category">
      {showNewCategoryInput ? (
        <div className="flex gap-2">
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
          <SelectTrigger>
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
    </FormRow>
  </FormSection>
);

const PricingSection = ({ 
  formData, 
  handleInputChange,
  handleStockQuantityChange 
}: { 
  formData: Partial<Product>; 
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleStockQuantityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <FormSection>
    <FormRow label="Базовая цена *" htmlFor="price">
      <Input
        id="price"
        name="price"
        type="number"
        value={formData.price || ""}
        onChange={handleInputChange}
      />
    </FormRow>
    
    <FormRow label="Количество на складе" htmlFor="stockQuantity">
      <Input
        id="stockQuantity"
        name="stockQuantity"
        type="number"
        value={formData.stockQuantity !== undefined ? formData.stockQuantity : ""}
        onChange={handleStockQuantityChange}
        min="0"
      />
    </FormRow>
    
    <FormRow label="Цена со скидкой" htmlFor="discountPrice">
      <Input
        id="discountPrice"
        name="discountPrice"
        type="number"
        value={formData.discountPrice || ""}
        onChange={handleInputChange}
      />
    </FormRow>
  </FormSection>
);

const DescriptionSection = ({ 
  formData, 
  handleInputChange 
}: { 
  formData: Partial<Product>; 
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}) => (
  <FormSection>
    <FormRow label="Описание *" htmlFor="description" isTextArea>
      <Textarea
        id="description"
        name="description"
        value={formData.description || ""}
        onChange={handleInputChange}
        rows={3}
      />
    </FormRow>
  </FormSection>
);

const ImagesSection = ({ 
  formData, 
  handleMainImageUploaded,
  handleAdditionalImagesChange 
}: { 
  formData: Partial<Product>; 
  handleMainImageUploaded: (url: string) => void;
  handleAdditionalImagesChange: (urls: string[]) => void;
}) => (
  <FormSection>
    <FormRow label="Основное изображение" isImage>
      <ImageUploader
        initialImageUrl={formData.imageUrl}
        onImageUploaded={handleMainImageUploaded}
        onRemoveImage={() => handleMainImageUploaded("/placeholder.svg")}
      />
    </FormRow>
    
    <FormRow label="Дополнительные изображения" isImage>
      <MultipleImageUploader
        initialImageUrls={formData.additionalImages}
        onImagesChange={handleAdditionalImagesChange}
      />
    </FormRow>
  </FormSection>
);

const MaterialSection = ({ 
  formData, 
  handleInputChange 
}: { 
  formData: Partial<Product>; 
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}) => (
  <FormSection>
    <FormRow label="Материал" htmlFor="material">
      <Input
        id="material"
        name="material"
        value={formData.material || ""}
        onChange={handleInputChange}
      />
    </FormRow>
    
    <FormRow label="Страна происхождения" htmlFor="countryOfOrigin">
      <Input
        id="countryOfOrigin"
        name="countryOfOrigin"
        value={formData.countryOfOrigin || ""}
        onChange={handleInputChange}
      />
    </FormRow>
  </FormSection>
);

const ProductOptionsSection = ({ 
  formData, 
  handleCheckboxChange 
}: { 
  formData: Partial<Product>; 
  handleCheckboxChange: (checked: boolean, name: string) => void;
}) => (
  <FormSection>
    <div className="grid grid-cols-4 items-center gap-4">
      <div className="text-right">Опции</div>
      <div className="col-span-3 space-y-2">
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
  </FormSection>
);

export default GeneralInfoTab;
