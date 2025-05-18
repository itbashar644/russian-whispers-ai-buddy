
/**
 * Utility functions for Yandex Metrika tracking
 */

// The counter ID from the Metrika initialization
const COUNTER_ID = 101964387;

/**
 * Track a page view
 * @param url - Optional URL to report (defaults to current URL)
 * @param options - Optional configuration
 */
export function trackPageView(url?: string, options?: {
  title?: string;
  referer?: string;
  params?: Record<string, any>;
}) {
  if (typeof window !== 'undefined' && (window as any).ym) {
    (window as any).ym(COUNTER_ID, 'hit', url || window.location.href, options);
  }
}

/**
 * Track a goal conversion
 * @param target - Goal name in Yandex Metrika
 * @param params - Optional parameters for the goal
 */
export function trackGoal(target: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && (window as any).ym) {
    if (params) {
      (window as any).ym(COUNTER_ID, 'reachGoal', target, params);
    } else {
      (window as any).ym(COUNTER_ID, 'reachGoal', target);
    }
  }
}

/**
 * Set visit parameters
 * @param params - Parameters for the current visit
 */
export function setVisitParams(params: Record<string, any>) {
  if (typeof window !== 'undefined' && (window as any).ym) {
    (window as any).ym(COUNTER_ID, 'params', params);
  }
}

/**
 * Set user parameters
 * @param params - Parameters for the current user
 */
export function setUserParams(params: Record<string, any>) {
  if (typeof window !== 'undefined' && (window as any).ym) {
    (window as any).ym(COUNTER_ID, 'userParams', params);
  }
}

/**
 * Track an ecommerce product view
 * @param product - Product data
 */
export function trackProductView(product: {
  id: string;
  name: string;
  price?: number;
  category?: string;
}) {
  if (typeof window !== 'undefined' && (window as any).ym) {
    trackPageView(undefined, {
      title: `Просмотр товара: ${product.name}`,
      params: {
        product_id: product.id,
        product_name: product.name,
        product_price: product.price,
        product_category: product.category
      }
    });
  }
}

/**
 * Track an ecommerce product added to cart
 * @param product - Product data
 * @param quantity - Quantity added
 */
export function trackAddToCart(product: {
  id: string;
  name: string;
  price?: number;
  category?: string;
}, quantity: number = 1) {
  if (typeof window !== 'undefined' && (window as any).ym) {
    trackGoal('add_to_cart', {
      product_id: product.id,
      product_name: product.name,
      product_price: product.price,
      product_quantity: quantity,
      product_category: product.category,
      order_price: product.price ? product.price * quantity : undefined
    });
  }
}
