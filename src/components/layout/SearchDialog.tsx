import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem
} from "@/components/ui/command";
import { getActiveProducts } from "@/data/products";
import { Product } from "@/types/product";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SearchDialog: React.FC<SearchDialogProps> = ({ open, onOpenChange }) => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      getActiveProducts()
        .then(setProducts)
        .catch(err => {
          console.error("Failed to load products", err);
          setProducts([]);
        });
    }
  }, [open]);

  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 10);

  const handleSelect = (id: string) => {
    navigate(`/product/${id}`);
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        value={search}
        onValueChange={setSearch}
        placeholder="Поиск товаров..."
      />
      <CommandList>
        <CommandEmpty>Товаров не найдено.</CommandEmpty>
        {filtered.map(product => (
          <CommandItem key={product.id} value={product.title} onSelect={() => handleSelect(product.id)}>
            {product.title}
          </CommandItem>
        ))}
      </CommandList>
    </CommandDialog>
  );
};
