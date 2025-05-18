
import React from 'react';
import { Product } from "@/types/product";

interface MarketplaceLinksProps {
  product: Product;
}

const MarketplaceLinks: React.FC<MarketplaceLinksProps> = ({ product }) => {
  if (!product.ozonUrl && !product.wildberriesUrl && !product.avitoUrl) {
    return null;
  }
  
  return (
    <div className="flex items-center gap-3 my-4">
      <span className="text-sm text-muted-foreground">Доступен на:</span>
      <div className="flex gap-3">
        {product.wildberriesUrl && (
          <a 
            href={product.wildberriesUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-purple-700 hover:text-purple-800"
            title="Открыть на Wildberries"
          >
            <div className="flex items-center justify-center w-8 h-8 overflow-hidden">
              <img 
                src="/lovable-uploads/0b04b72a-65f0-4115-9cea-5a0f215b83d4.png"
                alt="Wildberries" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="hidden sm:inline">Wildberries</span>
          </a>
        )}
        
        {product.ozonUrl && (
          <a 
            href={product.ozonUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
            title="Открыть на Ozon"
          >
            <div className="flex items-center justify-center w-8 h-8 overflow-hidden">
              <img 
                src="/lovable-uploads/df8ec6c9-6d3f-4ec5-b65f-72e13df2ea76.png"
                alt="Ozon" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="hidden sm:inline">Ozon</span>
          </a>
        )}
        
        {product.avitoUrl && (
          <a 
            href={product.avitoUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700"
            title="Открыть на Авито"
          >
            <div className="flex items-center justify-center w-8 h-8 overflow-hidden">
              <img 
                src="/lovable-uploads/b1cb4ce9-8bc4-48a9-83c3-f578212965a7.png"
                alt="Avito" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="hidden sm:inline">Авито</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default MarketplaceLinks;
