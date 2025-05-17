
import { Product } from "@/types/product";

export const filterProducts = (
  products: Product[],
  {
    searchQuery = "",
    category = null,
    minPrice = 0,
    maxPrice = Number.MAX_SAFE_INTEGER,
    inStockOnly = false,
    selectedColor = null,
  }
) => {
  return products.filter((product) => {
    // Filter by search query
    if (
      searchQuery &&
      !product.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !product.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Filter by category
    if (category && product.category !== category) {
      return false;
    }

    // Filter by price
    const price = product.discountPrice || product.price;
    if (price < minPrice || price > maxPrice) {
      return false;
    }

    // Filter by stock status
    if (inStockOnly && !product.inStock) {
      return false;
    }

    // Filter by color
    if (selectedColor) {
      // Check in product.colors array
      if (product.colors && product.colors.includes(selectedColor)) {
        return true;
      }

      // Check in colorVariants
      if (product.colorVariants && product.colorVariants.some(v => v.color === selectedColor)) {
        return true;
      }

      return false;
    }

    return true;
  });
};
