
import React, { useState } from 'react';
import { formatVideoUrl } from "@/lib/utils";

interface ProductVideoProps {
  videoUrl?: string;
  videoType?: string;
  imageUrl?: string;
}

const ProductVideo: React.FC<ProductVideoProps> = ({ videoUrl, videoType, imageUrl }) => {
  const [videoError, setVideoError] = useState(false);

  if (!videoUrl || videoError) return null;

  // Функция для определения типа рендера видео в зависимости от типа
  const renderVideo = () => {
    // Определяем тип видео (по умолчанию mp4 для обратной совместимости)
    const type = videoType || 'mp4';
    
    switch (type) {
      case 'vk':
      case 'youtube':
        const formattedUrl = formatVideoUrl(videoUrl, type);
        return (
          <iframe 
            src={formattedUrl}
            className="w-full h-full"
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            title="Product video"
            onError={() => setVideoError(true)}
          />
        );
      case 'mp4':
      default:
        return (
          <video 
            controls 
            className="w-full h-auto"
            poster={imageUrl}
            onError={() => setVideoError(true)}
          >
            <source src={videoUrl} type="video/mp4" />
            Ваш браузер не поддерживает видео.
          </video>
        );
    }
  };

  return (
    <div className="mt-4 border rounded-lg overflow-hidden aspect-video">
      {renderVideo()}
    </div>
  );
};

export default ProductVideo;
