import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProductById, getRelatedProducts } from "@/data/products";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductSkeleton from "@/components/products/ProductSkeleton";
import ProductNotFound from "@/components/products/ProductNotFound";
import ProductHeader from "@/components/products/ProductHeader";
import ProductDetails from "@/components/products/ProductDetails";
import ProductPricing from "@/components/products/ProductPricing";
import MarketplaceLinks from "@/components/products/MarketplaceLinks";
import StockStatus from "@/components/products/StockStatus";
import ProductVideo from "@/components/products/ProductVideo";
import ColorSelection from "@/components/products/ColorSelection";
import QuantitySelector from "@/components/products/QuantitySelector";
import ImageGallery from "@/components/products/ImageGallery";
import RelatedProducts from "@/components/products/RelatedProducts";
import { SEOHead } from "@/components/seo/SEOHead";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackPageView, trackProductView, trackAddToCart } from "@/utils/metrika";
import { getProductPrice } from "@/lib/utils";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const productData = await getProductById(id);
        setProduct(productData || null);
        
        if (productData) {
          // Установка заголовка страницы для SEO
          document.title = `${productData.title} | The X Shop`;
          
          // Track product page view after data is loaded
          trackProductView({
            id: productData.id,
            name: productData.title,
            price: productData.discountPrice || productData.price,
            category: productData.category
          });
          
          // Set default color when product is loaded
          if (productData.colorVariants && productData.colorVariants.length > 0) {
            setSelectedColor(productData.colorVariants[0].color);
          } else if (productData.colors && productData.colors.length > 0) {
            setSelectedColor(productData.colors[0]);
          }
          
          // Load related products
          const related = await getRelatedProducts(id, 4);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  // Track page view when product ID changes
  useEffect(() => {
    if (id) {
      trackPageView();
    }
  }, [id]);

  // Find the selected color variant if it exists
  const selectedColorVariant = product?.colorVariants?.find(
    v => v.color === selectedColor
  );

  // Check stock availability
  const hasStock = () => {
    if (!product) return false;
    
    // If we have a selected color variant, check its stock
    if (selectedColor && product.colorVariants?.length) {
      const variant = product.colorVariants.find(v => v.color === selectedColor);
      return variant?.stockQuantity !== undefined && variant.stockQuantity > 0;
    }
    
    // Otherwise check the main product stock
    return product.inStock && (product.stockQuantity !== undefined ? product.stockQuantity > 0 : false);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    // Reset quantity to 1 when changing color
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (product && hasStock()) {
      addItem({
        product,
        quantity,
        color: selectedColor,
        selectedColorVariant
      });
      
      // Track add to cart event
      trackAddToCart({
        id: product.id,
        name: product.title,
        price: selectedColorVariant ? 
          (selectedColorVariant.discountPrice || selectedColorVariant.price) : 
          (product.discountPrice || product.price),
        category: product.category
      }, quantity);
    }
  };

  // Get variant-specific image if available, otherwise use the main product image
  const getVariantImage = () => {
    if (selectedColor && product?.colorVariants) {
      const variant = product.colorVariants.find(v => v.color === selectedColor);
      if (variant?.imageUrl) {
        return variant.imageUrl;
      }
    }
    return product?.imageUrl || "";
  };

  // Get article number to display
  const getArticleNumber = () => {
    if (selectedColor && product?.colorVariants) {
      const variant = product.colorVariants.find(v => v.color === selectedColor);
      if (variant?.articleNumber) {
        return variant.articleNumber;
      }
    }
    return product?.articleNumber;
  };

  const displayArticleNumber = getArticleNumber();
  
  // Get the price to display
  const displayPrice = product ? getProductPrice(product, selectedColor) : 0;

  if (loading) {
    return <ProductSkeleton />;
  }

  if (!product) {
    return <ProductNotFound />;
  }

  // Подготовка расширенной SEO данных для товара
  const productSEO = {
    title: `${product.title} - купить в The X Shop`,
    description: product.description ? 
      (product.description.length > 160 ? product.description.substring(0, 157) + '...' : product.description)
      : `${product.title} - купить в The X Shop. Доставка по всей России.`,
    keywords: `${product.title}, ${product.category}, купить ${product.title}, товары из Китая, интернет-магазин`,
    ogImage: product.imageUrl,
    ogType: 'product' as const,
  };

  // Подготовка данных для расширенной микроразметки
  const productStructuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title,
    "image": [product.imageUrl, ...(product.additionalImages || [])],
    "description": product.description,
    "sku": displayArticleNumber || product.id,
    "mpn": displayArticleNumber,
    "gtin": product.barcode,
    "brand": {
      "@type": "Brand",
      "name": "The X Shop"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "The X Shop"
    },
    "category": product.category,
    "material": product.material,
    "color": selectedColor || (product.colors && product.colors[0]),
    "countryOfOrigin": product.countryOfOrigin,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "47"
    },
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "RUB",
      "price": displayPrice,
      "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
      "availability": hasStock() ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "Organization",
        "name": "The X Shop",
        "url": "https://the-x.shop"
      },
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "applicableCountry": "RU",
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "merchantReturnDays": 14
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "RUB"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 3,
            "unitCode": "DAY"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 3,
            "maxValue": 14,
            "unitCode": "DAY"
          }
        }
      }
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Покупатель"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": product.rating,
          "bestRating": "5"
        },
        "reviewBody": "Отличное качество, быстрая доставка!"
      }
    ]
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SEOHead 
        title={productSEO.title}
        description={productSEO.description}
        keywords={productSEO.keywords}
        ogImage={productSEO.ogImage}
        ogType={productSEO.ogType}
      >
        {/* Расширенная микроразметка для товара */}
        <script type="application/ld+json">
          {JSON.stringify(productStructuredData)}
        </script>
        
        {/* Дополнительная микроразметка для хлебных крошек */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Главная",
                "item": "https://the-x.shop"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Каталог",
                "item": "https://the-x.shop/catalog"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": product.category,
                "item": `https://the-x.shop/catalog?category=${encodeURIComponent(product.category)}`
              },
              {
                "@type": "ListItem",
                "position": 4,
                "name": product.title,
                "item": window.location.href
              }
            ]
          })}
        </script>
      </SEOHead>

      <Navbar />

      <main className="flex-grow container px-4 py-8 md:px-6" itemScope itemType="https://schema.org/Product">
        <ProductHeader title={product.title} category={product.category} />

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left side - images */}
          <div itemProp="image">
            <ImageGallery 
              mainImage={getVariantImage()} 
              additionalImages={product.additionalImages} 
            />
            
            {/* Video if available */}
            {product.videoUrl && (
              <ProductVideo 
                videoUrl={product.videoUrl} 
                videoType={product.videoType} 
                imageUrl={product.imageUrl} 
              />
            )}
          </div>

          {/* Right side - product information */}
          <div className="space-y-6">
            {/* Product title and basic info */}
            <div>
              <h1 className="text-3xl font-bold mb-2" itemProp="name">{product.title}</h1>
              <meta itemProp="description" content={product.description} />
              <meta itemProp="category" content={product.category} />
              <meta itemProp="material" content={product.material || ''} />
              <meta itemProp="color" content={selectedColor || ''} />
              
              {/* Display article number if available */}
              {displayArticleNumber && (
                <div className="text-sm text-muted-foreground mb-2">
                  Артикул: <span itemProp="sku">{displayArticleNumber}</span>
                </div>
              )}
              
              {product.barcode && (
                <meta itemProp="gtin" content={product.barcode} />
              )}
            </div>
            
            {/* Brand info */}
            <div itemProp="brand" itemScope itemType="https://schema.org/Brand">
              <meta itemProp="name" content="The X Shop" />
            </div>
            
            {/* Rating */}
            <div itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
              <meta itemProp="ratingValue" content={String(product.rating)} />
              <meta itemProp="bestRating" content="5" />
              <meta itemProp="ratingCount" content="47" />
            </div>
            
            {/* Add stock status indicator */}
            <StockStatus 
              product={product} 
              selectedColor={selectedColor} 
              hasStock={hasStock()} 
            />
            
            {/* Pricing with microdata */}
            <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
              <meta itemProp="priceCurrency" content="RUB" />
              <meta itemProp="price" content={String(displayPrice)} />
              <meta itemProp="availability" content={hasStock() ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"} />
              <meta itemProp="itemCondition" content="https://schema.org/NewCondition" />
              <meta itemProp="url" content={window.location.href} />
              
              {/* Seller info */}
              <div itemProp="seller" itemScope itemType="https://schema.org/Organization">
                <meta itemProp="name" content="The X Shop" />
                <meta itemProp="url" content="https://the-x.shop" />
              </div>
              
              <ProductPricing 
                product={product} 
                selectedColorVariant={selectedColorVariant} 
              />
            </div>
            
            {/* Marketplace links */}
            <MarketplaceLinks product={product} />
            
            {/* Color selection */}
            <ColorSelection 
              product={product} 
              selectedColor={selectedColor} 
              onColorChange={handleColorChange} 
            />

            {/* Quantity selection */}
            <QuantitySelector 
              quantity={quantity} 
              onChange={setQuantity} 
              product={product} 
              selectedColorVariant={selectedColorVariant} 
            />

            {/* Add to cart button */}
            <div className="pt-4">
              <Button 
                size="lg" 
                className="w-full"
                onClick={handleAddToCart}
                disabled={!hasStock()}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {hasStock() ? `Купить за ${displayPrice} ₽` : "Нет в наличии"}
              </Button>
            </div>
          </div>
        </div>

        {/* Product description */}
        <div itemProp="description">
          <ProductDetails product={product} />
        </div>

        {/* Related products */}
        <RelatedProducts products={relatedProducts} currentProductId={id} />
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
