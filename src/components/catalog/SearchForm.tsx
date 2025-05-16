
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useSearch } from "@/hooks/useSearch";

interface SearchFormProps {
  searchTerm: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  searchTerm,
  handleSearchChange,
  handleSearchSubmit,
  loading
}) => {
  const { searchInputRef } = useSearch();

  return (
    <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-auto">
      <div className="relative w-full md:min-w-[250px]">
        <Input
          ref={searchInputRef}
          type="search"
          placeholder="Поиск товаров..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pr-10 border-primary/30 focus-visible:border-primary focus-visible:ring-primary/40 bg-primary/5 placeholder:text-muted-foreground/70"
          disabled={loading}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary/50 pointer-events-none">
          <Search className="h-4 w-4" />
        </div>
      </div>
      <Button type="submit" disabled={loading}>Найти</Button>
    </form>
  );
};
