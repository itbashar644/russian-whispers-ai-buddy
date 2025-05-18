
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormRow } from './FormRow';
import { FormSection } from './FormSection';
import { getSpecificationsForCategory } from '@/data/products/categorySpecifications';
import { SpecificationField } from '@/types/product';

interface SpecificationsSectionProps {
  category: string;
  specifications: Record<string, string>;
  onSpecificationChange: (id: string, value: string) => void;
}

export const SpecificationsSection = ({ 
  category, 
  specifications, 
  onSpecificationChange 
}: SpecificationsSectionProps) => {
  const categorySpecs = getSpecificationsForCategory(category);
  
  if (categorySpecs.length === 0) {
    return (
      <FormSection>
        <div className="text-sm text-muted-foreground text-center py-4">
          Для выбранной категории не определены характеристики. Выберите другую категорию или добавьте общие характеристики вручную.
        </div>
      </FormSection>
    );
  }

  return (
    <FormSection>
      <div className="grid gap-4">
        <div className="text-sm">
          Заполните характеристики товара для категории <strong>{category}</strong>. Все поля необязательны.
        </div>
        
        {categorySpecs.map((spec: SpecificationField) => (
          <FormRow key={spec.id} label={spec.label} htmlFor={`spec-${spec.id}`}>
            <div className="flex gap-2 items-center">
              <Input
                id={`spec-${spec.id}`}
                type={spec.type}
                placeholder={spec.placeholder}
                value={specifications?.[spec.id] || ''}
                onChange={(e) => onSpecificationChange(spec.id, e.target.value)}
              />
              {spec.unit && (
                <div className="text-sm text-muted-foreground min-w-8">{spec.unit}</div>
              )}
            </div>
          </FormRow>
        ))}
      </div>
    </FormSection>
  );
};

export default SpecificationsSection;
