
import React from 'react';
import { Search } from 'lucide-react';

interface SearchIconProps {
  onClick: () => void;
}

export const SearchIcon: React.FC<SearchIconProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center text-primary hover:text-primary/80 transition-colors"
      aria-label="Поиск товаров"
    >
      <Search className="h-5 w-5" />
    </button>
  );
};
