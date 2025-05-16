
import React from 'react';
import { Search } from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';

export const SearchIcon: React.FC = () => {
  const { navigateToSearch } = useSearch();
  
  return (
    <button 
      onClick={navigateToSearch}
      className="flex items-center justify-center text-primary hover:text-primary/80 transition-colors"
      aria-label="Поиск товаров"
    >
      <Search className="h-5 w-5" />
    </button>
  );
};
