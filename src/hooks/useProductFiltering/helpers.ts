
import { Product } from "@/types/product";

// Transform products for color display
export const transformProductsForColorDisplay = (products: Product[]): Product[] => {
  console.log(`Transforming ${products.length} products for color display`);
  const expandedProducts: Product[] = [];
  
  // First pass: add all base products without modifications
  products.forEach(product => {
    expandedProducts.push({ ...product });
    console.log(`Added base product: ${product.id} - ${product.title} (Category: ${product.category})`);
  });
  
  // Second pass: add color variants as separate products
  products.forEach(product => {
    if (product.colorVariants && product.colorVariants.length > 0) {
      product.colorVariants.forEach(variant => {
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
          colorVariants: [variant],
          isColorVariant: true
        };
        expandedProducts.push(variantProduct);
        console.log(`Added variant: ${variantProduct.id} (Color: ${variant.color})`);
      });
    }
  });
  
  console.log(`Total products after transformation: ${expandedProducts.length}`);
  const categoriesAfter = [...new Set(expandedProducts.map(p => p.category))];
  console.log(`Categories after transformation: ${categoriesAfter.join(', ')}`);
  
  // Count products by category
  const categoryCount: Record<string, number> = {};
  categoriesAfter.forEach(category => {
    categoryCount[category] = expandedProducts.filter(p => p.category === category).length;
  });
  console.log('Products per category after transformation:', categoryCount);
  
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
