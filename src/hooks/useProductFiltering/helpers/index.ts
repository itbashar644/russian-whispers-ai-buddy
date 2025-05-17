
export * from './filterProducts';
export * from './sortProducts';
export * from './transformProducts';

/**
 * Get maximum price from products
 */
export function getMaxPrice(products: any[]): number {
  if (!products || products.length === 0) {
    return 50000; // Default maximum price
  }
  
  const maxPrice = Math.max(...products.map(product => {
    const price = product.discountPrice || product.price;
    return isNaN(price) ? 0 : price;
  }));
  
  return Math.ceil(maxPrice / 1000) * 1000; // Round up to nearest thousand
}
