
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { Product } from '@/types/product';
import { useNavigate } from 'react-router-dom';

interface ProductVariantSelectorProps {
  product: Product;
  variants: Product[];
}

const ProductVariantSelector: React.FC<ProductVariantSelectorProps> = ({ product, variants }) => {
  const navigate = useNavigate();
  const [selectedVariantId, setSelectedVariantId] = React.useState<string>(product.id);
  const [isOpen, setIsOpen] = React.useState(false);

  // If there are no variants, don't render anything
  if (!variants || variants.length <= 1) {
    return null;
  }

  const handleVariantSelect = (variantId: string) => {
    setSelectedVariantId(variantId);
  };

  const handleNavigateToVariant = () => {
    if (selectedVariantId && selectedVariantId !== product.id) {
      setIsOpen(false);
      navigate(`/product/${selectedVariantId}`);
    }
  };

  return (
    <div className="mt-6">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium">
                Вариант: {product.variantName || 'Стандарт'}
              </span>
              {variants.length > 1 && (
                <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                  {variants.length} вариантов
                </span>
              )}
            </div>
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Выберите вариант</SheetTitle>
          </SheetHeader>
          
          <div className="py-6">
            <RadioGroup 
              value={selectedVariantId} 
              onValueChange={handleVariantSelect}
              className="space-y-3"
            >
              {variants.map((variant) => (
                <div 
                  key={variant.id}
                  className={`relative flex items-start border rounded-lg p-4 ${
                    variant.id === selectedVariantId 
                      ? 'border-primary bg-primary/5' 
                      : 'border-input'
                  }`}
                >
                  <RadioGroupItem 
                    value={variant.id} 
                    id={`variant-${variant.id}`} 
                    className="absolute left-4 top-4"
                  />
                  <Label
                    htmlFor={`variant-${variant.id}`}
                    className="flex flex-col ml-7 cursor-pointer w-full"
                  >
                    <div className="grid grid-cols-[1fr,auto] gap-2 items-start">
                      <div>
                        <span className="font-medium block">
                          {variant.variantName || variant.title}
                        </span>
                        {variant.inStock ? (
                          <span className="text-sm text-green-600">В наличии</span>
                        ) : (
                          <span className="text-sm text-red-500">Нет в наличии</span>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {variant.discountPrice ? (
                            <>
                              <span>{variant.discountPrice} ₽</span>
                              <span className="text-muted-foreground line-through text-sm ml-2">
                                {variant.price} ₽
                              </span>
                            </>
                          ) : (
                            <span>{variant.price} ₽</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
            
            <Button 
              className="w-full mt-6"
              onClick={handleNavigateToVariant}
              disabled={selectedVariantId === product.id}
            >
              Выбрать вариант
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ProductVariantSelector;
