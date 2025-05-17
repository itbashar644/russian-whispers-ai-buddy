
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
  // Используем изображение из варианта, если оно есть
  const initialImage = selectedColorVariant?.imageUrl || product.imageUrl;
  const [selectedImage, setSelectedImage] = useState<string>(initialImage);

  // При изменении продукта или выбранного варианта, обновляем изображение
  React.useEffect(() => {
    setSelectedImage(selectedColorVariant?.imageUrl || product.imageUrl);
  }, [product.id, selectedColorVariant]);

  const handleThumbnailClick = (image: string) => {
    setSelectedImage(image);
  };

  const handleVariantThumbnailClick = (variant: ColorVariant) => {
    if (variant.imageUrl) {
      setSelectedImage(variant.imageUrl);
    }
    onColorVariantSelect(variant);
  };

  // Собираем все доступные изображения
  const allImages = [
    product.imageUrl,
    ...(product.additionalImages || []),
    ...(product.colorVariants?.map(v => v.imageUrl).filter(Boolean) || [])
  ].filter((img, index, self) => img && self.indexOf(img) === index); // Убираем дубликаты

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
      {allImages.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {allImages.map((img, index) => (
            img && (
              <button 
                key={`img-${index}`}
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
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
