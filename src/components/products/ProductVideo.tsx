
import React, { useState } from 'react';
import { Play } from 'lucide-react';

interface ProductVideoProps {
  videoUrl: string;
  videoType: string;
  imageUrl: string;
}

const ProductVideo: React.FC<ProductVideoProps> = ({ 
  videoUrl, 
  videoType = 'mp4',
  imageUrl 
}) => {
  const [playing, setPlaying] = useState(false);

  if (!videoUrl) return null;

  const getEmbedUrl = () => {
    if (videoType === 'youtube') {
      // Convert regular YouTube URL to embed URL if needed
      if (videoUrl.includes('watch?v=')) {
        const videoId = videoUrl.split('watch?v=')[1].split('&')[0];
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      }
      if (videoUrl.includes('youtu.be/')) {
        const videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      }
      return videoUrl;
    }
    if (videoType === 'vk') {
      // Handle VK videos
      return videoUrl;
    }
    
    // Default to the original URL for mp4
    return videoUrl;
  };
  
  const handlePlay = () => {
    setPlaying(true);
  };

  return (
    <div className="mt-4 border rounded-lg overflow-hidden">
      <div className="relative aspect-video">
        {!playing ? (
          <>
            <img 
              src={imageUrl || "/placeholder.svg"} 
              alt="Video thumbnail"
              className="w-full h-full object-cover"
            />
            <button 
              className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors"
              onClick={handlePlay}
            >
              <div className="h-16 w-16 bg-primary/90 hover:bg-primary rounded-full flex items-center justify-center">
                <Play className="h-8 w-8 text-white ml-1" />
              </div>
            </button>
          </>
        ) : videoType === 'mp4' ? (
          <video 
            src={videoUrl} 
            controls 
            autoPlay 
            className="absolute inset-0 w-full h-full" 
          />
        ) : (
          <iframe 
            src={getEmbedUrl()} 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
            title="Product video"
          ></iframe>
        )}
      </div>
    </div>
  );
};

export default ProductVideo;
