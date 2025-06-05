
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ColorVariant, Product } from "@/types/product";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a price in Russian rubles
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price) + "\u00A0₽";  // Using a non-breaking space
}

/**
 * Gets the price for a product, accounting for color variants
 */
export function getProductPrice(product: Product, selectedColor?: string): number {
  if (selectedColor && product.colorVariants) {
    const variant = product.colorVariants.find(v => v.color === selectedColor);
    if (variant) {
      return variant.discountPrice || variant.price;
    }
  }
  return product.discountPrice || product.price;
}

/**
 * Formats embedded video URLs based on their type
 */
export function formatVideoUrl(url: string, type: 'vk' | 'youtube' | 'mp4'): string {
  if (!url) return '';
  
  switch (type) {
    case 'vk':
      // Extract video parameters from different VK URL formats
      try {
        if (url.includes('video_ext.php')) {
          // Already an embed URL, return as is or extract params
          const params = new URL(url).searchParams;
          const oid = params.get('oid');
          const id = params.get('id');
          if (oid && id) {
            return `https://vk.com/video_ext.php?oid=${oid}&id=${id}&hd=2`;
          }
          return url;
        } else if (url.includes('vkvideo.ru/video')) {
          // Format: https://vkvideo.ru/video-229517468_456239193
          const match = url.match(/video([-\d]+)_(\d+)/);
          if (match && match[1] && match[2]) {
            return `https://vk.com/video_ext.php?oid=${match[1]}&id=${match[2]}&hd=2`;
          }
        } else if (url.includes('vk.com/video')) {
          // Format: https://vk.com/video-123456789_987654321
          const match = url.match(/video([-\d]+)_(\d+)/);
          if (match && match[1] && match[2]) {
            return `https://vk.com/video_ext.php?oid=${match[1]}&id=${match[2]}&hd=2`;
          }
        }
      } catch (e) {
        console.error("Ошибка при обработке URL видео ВКонтакте:", e);
      }
      return url;
      
    case 'youtube':
      // Extract YouTube video ID
      try {
        if (url.includes('youtube.com/embed/')) {
          // Already an embed URL
          return url;
        }
        
        let videoId = '';
        if (url.includes('youtube.com/watch')) {
          const urlObj = new URL(url);
          videoId = urlObj.searchParams.get('v') || '';
        } else if (url.includes('youtu.be/')) {
          videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
        }
        
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      } catch (e) {
        console.error("Ошибка при обработке URL видео YouTube:", e);
      }
      return url;
      
    case 'mp4':
    default:
      return url;
  }
}
