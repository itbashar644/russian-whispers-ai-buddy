
import React from "react";
import { Button } from "@/components/ui/button";
import { Category } from "@/data/products/categoryData";

interface CategoryFilterProps {
  availableCategories: string[];
  categoryParam: string | null;
  loading: boolean;
  handleCategoryClick: (categoryId: string | null) => void;
  findCategoryByName: (name: string) => Category;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  availableCategories,
  categoryParam,
  loading,
  handleCategoryClick,
  findCategoryByName,
}) => {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({length: 5}).map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 animate-pulse rounded-md"></div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      <Button
        variant={!categoryParam ? "default" : "outline"}
        className="w-full justify-start"
        onClick={() => handleCategoryClick(null)}
      >
        Все товары
      </Button>
      
      {availableCategories.map((category) => {
        const categoryObj = findCategoryByName(category);
        return (
          <Button
            key={category}
            variant={categoryParam === category ? "default" : "outline"}
            className="w-full justify-start flex items-center"
            onClick={() => handleCategoryClick(category)}
          >
            <span className="w-4 h-4 mr-2 overflow-hidden flex-shrink-0">
              <img 
                src={categoryObj.imageUrl} 
                className="w-full h-full object-cover" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
                alt=""
              />
            </span>
            <span>{category}</span>
          </Button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
