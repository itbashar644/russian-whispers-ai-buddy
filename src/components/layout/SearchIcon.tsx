
import React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearch } from "@/hooks/useSearch";

export const SearchIcon: React.FC = () => {
  const { navigateToSearch } = useSearch();
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={navigateToSearch} 
      aria-label="Поиск"
    >
      <Search className="h-5 w-5" />
      <span className="sr-only">Поиск</span>
    </Button>
  );
};
