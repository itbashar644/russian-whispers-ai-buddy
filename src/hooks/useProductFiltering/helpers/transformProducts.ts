
import { Product } from "@/types/product";

/**
 * Transforms products for color display by expanding color variants into separate products
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
