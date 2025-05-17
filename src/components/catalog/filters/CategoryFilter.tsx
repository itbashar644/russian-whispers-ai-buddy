
import React from "react";
import { Button } from "@/components/ui/button";
import { Category } from "@/types/categories";
import { Check } from "lucide-react";

interface CategoryFilterProps {
  categories: Category[];
  categoryParam: string | null;
  loading: boolean;
  handleCategoryClick: (categoryId: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  categoryParam,
  loading,
  handleCategoryClick
}) => {
  return (
    <div>
      <h3 className="font-semibold mb-4">Категории</h3>
      <div className="space-y-1">
        {categories.map((category) => (
          <Button
            key={category.name}
            variant="ghost"
            className={`w-full justify-start px-2 h-auto py-2 whitespace-normal text-left ${
              categoryParam === category.name ? "bg-muted" : ""
            }`}
            onClick={() => handleCategoryClick(category.name)}
            disabled={loading}
          >
            <div className="flex items-start">
              {categoryParam === category.name && (
                <Check className="mr-1 h-4 w-4 mt-0.5 flex-shrink-0" />
              )}
              <span className="line-clamp-2">{category.name}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
