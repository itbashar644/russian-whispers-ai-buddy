
import React, { useState } from 'react';
import ImageLightbox from '@/components/ui/image-lightbox';

interface ImageGalleryProps {
  mainImage: string;
  additionalImages?: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ mainImage, additionalImages = [] }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  
  const allImages = [mainImage, ...additionalImages].filter(Boolean);
  const currentImage = allImages[currentImageIndex] || "/placeholder.svg";

  return (
    <>
      {/* Main image display */}
      <div className="border rounded-lg overflow-hidden">
        <div className="relative" style={{ paddingTop: '133.33%', maxHeight: '400px' }}>  {/* 3:4 aspect ratio with max height */}
          <img
            src={imageError ? "/placeholder.svg" : currentImage}
            alt="Product"
            className="absolute top-0 left-0 w-full h-full object-cover cursor-pointer"
            onError={() => setImageError(true)}
            onClick={() => setLightboxOpen(true)}
          />
        </div>
      </div>
      
      {/* Thumbnails gallery */}
      {allImages.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-2">
          {allImages.map((img, index) => (
            <button 
              key={index}
              className={`border rounded overflow-hidden ${
                index === currentImageIndex ? 'border-primary border-2' : 'border-gray-200'
              }`}
              style={{ aspectRatio: '3/4', maxHeight: '100px' }}
              onClick={() => setCurrentImageIndex(index)}
            >
              <div className="relative h-full">
                <img 
                  src={img} 
                  alt={`Product thumbnail ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover" 
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Image lightbox for full-screen gallery */}
      <ImageLightbox 
        images={allImages}
        initialIndex={currentImageIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
      />
    </>
  );
};

export default ImageGallery;
