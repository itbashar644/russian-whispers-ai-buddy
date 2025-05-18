
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@/types/product";
import { FormRow } from './FormRow';
import { FormSection } from './FormSection';
import SpecificationsSection from './SpecificationsSection';

interface AdditionalInfoTabProps {
  formData: Partial<Product>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (value: string, name: string) => void;
  handleSpecificationChange?: (id: string, value: string) => void;
}

const AdditionalInfoTab = ({
  formData,
  handleInputChange,
  handleSelectChange,
  handleSpecificationChange
}: AdditionalInfoTabProps) => {
  // Handler for specification changes
  const onSpecificationChange = (id: string, value: string) => {
    if (handleSpecificationChange) {
      handleSpecificationChange(id, value);
    } else {
      // Fallback implementation if the parent doesn't provide a handler
      const updatedSpecs = {
        ...(formData.specifications || {}),
        [id]: value
      };
      
      // Создаем синтетическое событие для обработчика
      const syntheticEvent = {
        target: {
          name: "specifications",
          value: updatedSpecs
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      handleInputChange(syntheticEvent);
    }
  };

  return (
    <div className="grid gap-4">
      <FormSection>
        <FormRow label="URL видео" htmlFor="videoUrl">
          <Input
            id="videoUrl"
            name="videoUrl"
            value={formData.videoUrl || ""}
            onChange={handleInputChange}
            placeholder="Ссылка на видео"
          />
        </FormRow>
        
        <FormRow label="Тип видео" htmlFor="videoType">
          <Select
            value={formData.videoType || "mp4"}
            onValueChange={(value) => handleSelectChange(value, "videoType")}
          >
            <SelectTrigger id="videoType">
              <SelectValue placeholder="Выберите тип видео" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mp4">MP4</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="vk">ВКонтакте</SelectItem>
            </SelectContent>
          </Select>
        </FormRow>
      </FormSection>
      
      <FormSection>
        <FormRow label="ID товара на Ozon" htmlFor="ozonUrl">
          <Input
            id="ozonUrl"
            name="ozonUrl"
            value={formData.ozonUrl || ""}
            onChange={handleInputChange}
            placeholder="URL товара на Ozon"
          />
        </FormRow>
        
        <FormRow label="ID товара на Wildberries" htmlFor="wildberriesUrl">
          <Input
            id="wildberriesUrl"
            name="wildberriesUrl"
            value={formData.wildberriesUrl || ""}
            onChange={handleInputChange}
            placeholder="URL товара на Wildberries"
          />
        </FormRow>
        
        <FormRow label="ID товара на Avito" htmlFor="avitoUrl">
          <Input
            id="avitoUrl"
            name="avitoUrl"
            value={formData.avitoUrl || ""}
            onChange={handleInputChange}
            placeholder="URL товара на Avito"
          />
        </FormRow>
      </FormSection>
      
      {formData.category && (
        <SpecificationsSection 
          category={formData.category}
          specifications={formData.specifications || {}}
          onSpecificationChange={onSpecificationChange}
        />
      )}
    </div>
  );
};

export default AdditionalInfoTab;
