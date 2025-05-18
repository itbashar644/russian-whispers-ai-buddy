
import { Product } from "@/types/product";

/**
 * Transform products for color display
 */
export const transformProductsForColorDisplay = (products: Product[]): Product[] => {
  const expandedProducts: Product[] = [];
  
  products.forEach(product => {
    // If product has color variants, create virtual products for each variant
    if (product.colorVariants && product.colorVariants.length > 0) {
      product.colorVariants.forEach(variant => {
        const variantProduct: Product = {
          ...product,
          id: `${product.id}-${variant.color}`.replace(/\s+/g, '-').toLowerCase(),
          price: variant.price,
          discountPrice: variant.discountPrice,
          imageUrl: variant.imageUrl || product.imageUrl,
          articleNumber: variant.articleNumber || product.articleNumber,
          barcode: variant.barcode || product.barcode,
          stockQuantity: variant.stockQuantity,
          inStock: variant.stockQuantity !== undefined ? variant.stockQuantity > 0 : product.inStock,
          ozonUrl: variant.ozonUrl || product.ozonUrl,
          wildberriesUrl: variant.wildberriesUrl || product.wildberriesUrl,
          avitoUrl: variant.avitoUrl || product.avitoUrl,
          colorVariants: [variant],
          isColorVariant: true
        };
        expandedProducts.push(variantProduct);
      });
    } else {
      // Product has no color variants, add as is
      expandedProducts.push(product);
    }
  });
  
  return expandedProducts;
};

/**
 * Sort products based on selected sortBy option
 */
export const sortProducts = (products: Product[], sortByOption: string): Product[] => {
  // Create a copy to avoid mutating the original array
  const sortedProducts = [...products];
  
  // Always sort by in-stock first - this is the key change!
  sortedProducts.sort((a, b) => {
    // Important: Reverse the order to put in-stock products first
    if (a.inStock !== b.inStock) {
      // This was incorrect! We need to make sure in-stock items are first
      return a.inStock ? -1 : 1; // -1 puts a before b when a is in stock
    }
    return 0;
  });
  
  // Then apply additional sorting on top of the in-stock priority
  switch (sortByOption) {
    case "price-asc":
      sortedProducts.sort((a, b) => {
        // First by stock
        if (a.inStock !== b.inStock) {
          return a.inStock ? -1 : 1;
        }
        // Then by price
        const priceA = a.discountPrice !== undefined ? a.discountPrice : a.price;
        const priceB = b.discountPrice !== undefined ? b.discountPrice : b.price;
        return priceA - priceB;
      });
      break;
    case "price-desc":
      sortedProducts.sort((a, b) => {
        // First by stock
        if (a.inStock !== b.inStock) {
          return a.inStock ? -1 : 1;
        }
        // Then by price descending
        const priceA = a.discountPrice !== undefined ? a.discountPrice : a.price;
        const priceB = b.discountPrice !== undefined ? b.discountPrice : b.price;
        return priceB - priceA;
      });
      break;
    case "name-asc":
      sortedProducts.sort((a, b) => {
        // First by stock
        if (a.inStock !== b.inStock) {
          return a.inStock ? -1 : 1;
        }
        // Then by name ascending
        return a.title.localeCompare(b.title);
      });
      break;
    case "name-desc":
      sortedProducts.sort((a, b) => {
        // First by stock
        if (a.inStock !== b.inStock) {
          return a.inStock ? -1 : 1;
        }
        // Then by name descending
        return b.title.localeCompare(a.title);
      });
      break;
    case "rating":
      sortedProducts.sort((a, b) => {
        // First by stock
        if (a.inStock !== b.inStock) {
          return a.inStock ? -1 : 1;
        }
        // Then by rating
        return b.rating - a.rating;
      });
      break;
    case "in-stock":
    default:
      // Just maintain the stock sort that was already applied
      break;
  }
  
  return sortedProducts;
};
