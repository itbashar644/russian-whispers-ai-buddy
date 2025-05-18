
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Product } from "@/types/product";
import { productMergeApi } from "@/data/products/supabase/productMergeApi";
import { ChevronDown } from "lucide-react";

interface ProductVariantsButtonProps {
  product: Product;
}

const ProductVariantsButton = ({ product }: ProductVariantsButtonProps) => {
  const [variants, setVariants] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only fetch variants if the product has a modelName
    if (product.modelName) {
      setLoading(true);
      productMergeApi
        .getProductsByModelName(product.modelName)
        .then((modelProducts) => {
          // Filter out the current product and any archived products
          const otherVariants = modelProducts.filter(
            (p) => p.id !== product.id && !p.archived
          );
          setVariants(otherVariants);
        })
        .catch((error) => {
          console.error("Error fetching product variants:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [product.modelName, product.id]);

  // If there are no variants or only one product in the model, don't show the button
  if (!product.modelName || variants.length === 0) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center"
          disabled={loading}
        >
          {loading ? "Загрузка вариантов..." : "Варианты товара"} 
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <div className="p-2">
          <div className="font-medium mb-2 p-2">Доступные варианты:</div>
          <div className="space-y-1">
            {variants.map((variant) => (
              <Link
                key={variant.id}
                to={`/product/${variant.id}`}
                className="block p-2 hover:bg-muted rounded-md"
              >
                <div className="font-medium">{variant.title}</div>
                {variant.variant && (
                  <div className="text-sm text-muted-foreground">
                    {variant.variant}
                  </div>
                )}
                <div className="text-sm font-medium mt-1">
                  {variant.discountPrice ? (
                    <>
                      <span className="text-primary">
                        {variant.discountPrice} ₽
                      </span>
                      <span className="ml-2 line-through text-muted-foreground">
                        {variant.price} ₽
                      </span>
                    </>
                  ) : (
                    <span>{variant.price} ₽</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ProductVariantsButton;
