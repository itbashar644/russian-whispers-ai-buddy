
import React, { useState } from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Product, ColorVariant } from "@/types/product";
import ImageLightbox from '@/components/ui/image-lightbox';

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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Collect all available images
  const allImages = [
    product.imageUrl,
    ...(product.additionalImages || []),
    ...(product.colorVariants?.filter(v => v.imageUrl)?.map(v => v.imageUrl as string) || [])
  ].filter(Boolean);

  const handleThumbnailClick = (image: string) => {
    setSelectedImage(image);
    const index = allImages.indexOf(image);
    if (index !== -1) {
      setLightboxIndex(index);
    }
  };

  const handleVariantThumbnailClick = (variant: ColorVariant) => {
    if (variant.imageUrl) {
      setSelectedImage(variant.imageUrl);
      const index = allImages.indexOf(variant.imageUrl);
      if (index !== -1) {
        setLightboxIndex(index);
      }
    }
    onColorVariantSelect(variant);
  };

  const handleMainImageClick = () => {
    const index = allImages.indexOf(selectedImage);
    if (index !== -1) {
      setLightboxIndex(index);
    }
    setLightboxOpen(true);
  };

  return (
    <div className="space-y-4">
      <AspectRatio ratio={3/4} className="bg-muted overflow-hidden rounded-lg border">
        <img
          src={selectedImage}
          alt={product.title}
          className="object-contain w-full h-auto cursor-pointer"
          onClick={handleMainImageClick}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
      </AspectRatio>
      
      {/* Миниатюры изображений */}
      <div className="grid grid-cols-5 gap-2">
         <button
          className={`aspect-[3/4] rounded-md overflow-hidden border-2 ${selectedImage === product.imageUrl ? 'border-primary' : 'border-transparent'}`}
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
            className={`aspect-[3/4] rounded-md overflow-hidden border-2 ${selectedImage === img ? 'border-primary' : 'border-transparent'}`}
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
              className={`aspect-[3/4] rounded-md overflow-hidden border-2 ${selectedImage === variant.imageUrl ? 'border-primary' : 'border-transparent'}`}
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

      {/* Image lightbox */}
      <ImageLightbox 
        images={allImages}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
      />
    </div>
  );
};

export default ProductImageGallery;
