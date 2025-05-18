
import React, { useState } from 'react';

interface ImageGalleryProps {
  mainImage: string;
  additionalImages?: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ mainImage, additionalImages = [] }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  
  const allImages = [mainImage, ...additionalImages].filter(Boolean);
  const currentImage = allImages[currentImageIndex] || "/placeholder.svg";

  return (
    <>
      {/* Main image display */}
      <div className="border rounded-lg overflow-hidden">
        <img 
          src={imageError ? "/placeholder.svg" : currentImage} 
          alt="Product" 
          className="w-full h-auto object-cover aspect-square" 
          onError={() => setImageError(true)}
        />
      </div>
      
      {/* Thumbnails gallery */}
      {allImages.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-2">
          {allImages.map((img, index) => (
            <button 
              key={index}
              className={`border rounded overflow-hidden aspect-square ${
                index === currentImageIndex ? 'border-primary border-2' : 'border-gray-200'
              }`}
              onClick={() => setCurrentImageIndex(index)}
            >
              <img 
                src={img} 
                alt={`Product thumbnail ${index + 1}`}
                className="w-full h-full object-cover" 
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default ImageGallery;
