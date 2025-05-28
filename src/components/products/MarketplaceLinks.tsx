
import React from 'react';
import { Product } from "@/types/product";
import { trackGoal } from '@/utils/metrika';

interface MarketplaceLinksProps {
  product: Product;
  showLabels?: boolean;
  className?: string;
}

const MarketplaceLinks: React.FC<MarketplaceLinksProps> = ({ 
  product, 
  showLabels = false,
  className = "flex items-center gap-2 my-4 overflow-hidden" 
}) => {
  if (!product.ozonUrl && !product.wildberriesUrl && !product.avitoUrl) {
    return null;
  }
  
  const handleExternalLinkClick = (marketplaceName: string, url: string) => {
    trackGoal('marketplace_click', {
      product_id: product.id,
      product_name: product.title, 
      marketplace: marketplaceName,
      url: url
    });
  };
  
  return (
    <div className={className}>
      <span className="text-xs text-muted-foreground flex-shrink-0">Доступен на:</span>
      <div className="flex gap-1 min-w-0 flex-wrap">
        {product.wildberriesUrl && (
          <a 
            href={product.wildberriesUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-purple-700 hover:text-purple-800 flex-shrink-0"
            title="Открыть на Wildberries"
            onClick={() => handleExternalLinkClick('wildberries', product.wildberriesUrl || '')}
          >
            <div className="flex items-center justify-center w-5 h-5 flex-shrink-0 overflow-hidden">
              <img 
                src="/lovable-uploads/e338f2d1-bca5-46f1-b305-fdc8cff079f6.png"
                alt="Wildberries" 
                className="w-full h-full object-contain"
              />
            </div>
            {showLabels && <span className="truncate">WB</span>}
          </a>
        )}
        
        {product.ozonUrl && (
          <a 
            href={product.ozonUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 flex-shrink-0"
            title="Открыть на Ozon"
            onClick={() => handleExternalLinkClick('ozon', product.ozonUrl || '')}
          >
           <div className="flex items-center justify-center w-5 h-5 flex-shrink-0 overflow-hidden">
              <img 
                src="/lovable-uploads/cdd6cfcc-2939-4048-ad14-0718ccb5108b.png"
                alt="Ozon" 
                className="w-full h-full object-contain"
              />
            </div>
            {showLabels && <span className="truncate">Ozon</span>}
          </a>
        )}
        
        {product.avitoUrl && (
          <a 
            href={product.avitoUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 flex-shrink-0"
            title="Открыть на Авито"
            onClick={() => handleExternalLinkClick('avito', product.avitoUrl || '')}
          >
            <div className="flex items-center justify-center w-5 h-5 flex-shrink-0 overflow-hidden">
              <img 
                src="/lovable-uploads/c9a01e33-cfba-4882-bd76-bf5242276fda.png"
                alt="Avito" 
                className="w-full h-full object-contain"
              />
            </div>
            {showLabels && <span className="truncate">Авито</span>}
          </a>
        )}
      </div>
    </div>
  );
};

export default MarketplaceLinks;
