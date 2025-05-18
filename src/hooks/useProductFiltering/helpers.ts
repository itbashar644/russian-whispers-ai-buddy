
import { Product } from "@/types/product";

// Transform products for color display
export const transformProductsForColorDisplay = (products: Product[]): Product[] => {
  console.log(`Starting transformation of ${products.length} products for color display`);
  const expandedProducts: Product[] = [];
  
  // First pass: add all base products without modifications
  products.forEach(product => {
    // Always add the base product first
    expandedProducts.push({ ...product });
    console.log(`Added base product: ${product.id} - ${product.title} (Category: ${product.category})`);
  });
  
  // Second pass: add color variants as separate products
  products.forEach(product => {
    if (product.colorVariants && product.colorVariants.length > 0) {
      product.colorVariants.forEach(variant => {
        // Create a new product for each color variant
        const variantProduct: Product = {
          ...product,
          id: `${product.id}-${variant.color}`.replace(/\s+/g, '-').toLowerCase(),
          price: variant.price !== undefined ? variant.price : product.price,
          discountPrice: variant.discountPrice !== undefined ? variant.discountPrice : product.discountPrice,
          imageUrl: variant.imageUrl || product.imageUrl,
          articleNumber: variant.articleNumber || product.articleNumber,
          barcode: variant.barcode || product.barcode,
          stockQuantity: variant.stockQuantity !== undefined ? variant.stockQuantity : product.stockQuantity,
          inStock: variant.stockQuantity !== undefined ? variant.stockQuantity > 0 : product.inStock,
          ozonUrl: variant.ozonUrl || product.ozonUrl,
          wildberriesUrl: variant.wildberriesUrl || product.wildberriesUrl,
          avitoUrl: variant.avitoUrl || product.avitoUrl,
          colorVariants: [variant], // Keep only the current variant
          isColorVariant: true
        };
        
        expandedProducts.push(variantProduct);
        console.log(`Added variant product: ${variantProduct.id} - ${variant.color}`);
      });
    }
  });
  
  console.log(`Transformation complete. Total products after transformation: ${expandedProducts.length}`);
  
  // Debug info: log product count by category
  const categoryCountAfter = {};
  expandedProducts.forEach(product => {
    if (!categoryCountAfter[product.category]) {
      categoryCountAfter[product.category] = 0;
    }
    categoryCountAfter[product.category]++;
  });
  
  console.log("Products per category after transformation:", categoryCountAfter);
  
  return expandedProducts;
};

// Sort products based on selected sortBy option
export const sortProducts = (products: Product[], sortByOption: string): Product[] => {
  // Create a copy to avoid mutating the original array
  const sortedProducts = [...products];
  
  // Always sort by in-stock first, regardless of other sortings
  sortedProducts.sort((a, b) => {
    if (a.inStock !== b.inStock) {
      return a.inStock ? -1 : 1;
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

// Filter products by color
export const filterByColor = (products: Product[], colorParam: string | null): Product[] => {
  if (!colorParam) return products;
  
  console.log(`Filtering by color: ${colorParam}`);
  const filtered = products.filter(product => {
    // Base products with matching color variants
    if (product.colorVariants && product.colorVariants.length > 0) {
      const hasMatchingColor = product.colorVariants.some(
        variant => variant.color.toLowerCase() === colorParam.toLowerCase()
      );
      return hasMatchingColor;
    }
    return false;
  });
  
  console.log(`Products after color filtering: ${filtered.length}`);
  return filtered;
};

// Filter products by search term
export const filterBySearchTerm = (products: Product[], searchTerm: string): Product[] => {
  if (!searchTerm) return products;
  
  console.log(`Filtering by search term: ${searchTerm}`);
  const filtered = products.filter(
    (p) => 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  console.log(`Products after search filtering: ${filtered.length}`);
  return filtered;
};

// Filter products by price range
export const filterByPriceRange = (products: Product[], priceRange: { min: number; max: number }): Product[] => {
  console.log(`Filtering by price range: ${priceRange.min} to ${priceRange.max}`);
  const filtered = products.filter(
    (p) => {
      const price = p.discountPrice !== undefined ? p.discountPrice : p.price;
      return price >= priceRange.min && price <= priceRange.max;
    }
  );
  
  console.log(`Products after price filtering: ${filtered.length}`);
  return filtered;
};

// Filter products by stock status
export const filterByStockStatus = (products: Product[], inStockOnly: boolean): Product[] => {
  if (!inStockOnly) return products;
  
  console.log(`Filtering by stock status: in-stock only`);
  const filtered = products.filter((p) => p.inStock);
  
  console.log(`Products after in-stock filtering: ${filtered.length}`);
  return filtered;
};
