
import React from 'react';
import { Link } from 'react-router-dom';

interface ProductHeaderProps {
  title: string;
  category: string;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({ title, category }) => {
  return (
    <div className="mb-6">
      <Link 
        to="/catalog" 
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        Назад к каталогу
      </Link>
    </div>
  );
};

export default ProductHeader;
