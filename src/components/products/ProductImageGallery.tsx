
import React, { useState } from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Product, ColorVariant } from "@/types/product";

interface ProductImageGalleryProps {
  product: Product;
  selectedColorVariant: ColorVariant | null;
  onColorVariantSelect: (variant: ColorVariant) => void;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ 
  product, 
  selectedColorVariant, 
  onColorVariantSelect 
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(product.imageUrl);

  const handleThumbnailClick = (image: string) => {
    setSelectedImage(image);
  };

  const handleVariantThumbnailClick = (variant: ColorVariant) => {
    if (variant.imageUrl) {
      setSelectedImage(variant.imageUrl);
    }
    onColorVariantSelect(variant);
  };

  return (
    <div className="space-y-4">
      <AspectRatio ratio={1/1} className="bg-muted overflow-hidden rounded-lg border">
        <img 
          src={selectedImage} 
          alt={product.title} 
          className="object-cover w-full h-full"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
      </AspectRatio>
      
      {/* Миниатюры изображений */}
      <div className="grid grid-cols-5 gap-2">
        <button 
          className={`aspect-square rounded-md overflow-hidden border-2 ${selectedImage === product.imageUrl ? 'border-primary' : 'border-transparent'}`}
          onClick={() => handleThumbnailClick(product.imageUrl)}
        >
          <img 
            src={product.imageUrl} 
            alt={product.title} 
            className="object-cover w-full h-full"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        </button>
        {product.additionalImages?.map((img, index) => (
          <button 
            key={index}
            className={`aspect-square rounded-md overflow-hidden border-2 ${selectedImage === img ? 'border-primary' : 'border-transparent'}`}
            onClick={() => handleThumbnailClick(img)}
          >
            <img 
              src={img} 
              alt={`${product.title} - изображение ${index + 1}`} 
              className="object-cover w-full h-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          </button>
        ))}
        
        {/* Миниатюры изображений цветовых вариантов */}
        {product.colorVariants?.map((variant, index) => (
          variant.imageUrl && (
            <button 
              key={`variant-${index}`}
              className={`aspect-square rounded-md overflow-hidden border-2 ${selectedImage === variant.imageUrl ? 'border-primary' : 'border-transparent'}`}
              onClick={() => handleVariantThumbnailClick(variant)}
            >
              <img 
                src={variant.imageUrl} 
                alt={`${product.title} - ${variant.color}`} 
                className="object-cover w-full h-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            </button>
          )
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
