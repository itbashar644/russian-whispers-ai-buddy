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
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCart();
  
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("ID товара не найден");
        setLoading(false);
        return;
      }
      
      console.log("Загружаю товар с ID:", id);
      setLoading(true);
      setError(null);
      setProduct(null); // Очищаем предыдущий товар
      
      try {
        const productData = await getProductById(id);
        console.log("Товар загружен:", productData);
        
        if (!productData) {
          setError("Товар не найден");
          setProduct(null);
        } else {
          setProduct(productData);
          
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
          try {
            const related = await getRelatedProducts(id, 4);
            setRelatedProducts(related);
          } catch (relatedError) {
            console.error("Ошибка загрузки связанных товаров:", relatedError);
            // Не прерываем загрузку основного товара из-за ошибки связанных товаров
          }
        }
      } catch (error) {
        console.error("Ошибка загрузки товара:", error);
        setError("Ошибка загрузки товара");
        setProduct(null);
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

  const selectedColorVariant = product?.colorVariants?.find(
    v => v.color === selectedColor
  );

  const hasStock = () => {
    if (!product) return false;
    
    if (selectedColor && product.colorVariants?.length) {
      const variant = product.colorVariants.find(v => v.color === selectedColor);
      return variant?.stockQuantity !== undefined && variant.stockQuantity > 0;
    }
    
    return product.inStock && (product.stockQuantity !== undefined ? product.stockQuantity > 0 : false);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
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

  const getVariantImage = () => {
    if (selectedColor && product?.colorVariants) {
      const variant = product.colorVariants.find(v => v.color === selectedColor);
      if (variant?.imageUrl) {
        return variant.imageUrl;
      }
    }
    return product?.imageUrl || "";
  };

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
  const displayPrice = product ? getProductPrice(product, selectedColor) : 0;

  if (loading) {
    return <ProductSkeleton />;
  }

  if (error || !product) {
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

  // Яндекс микроразметка (JSON-LD Schema.org)
  const yandexStructuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title,
    "description": product.description,
    "image": [product.imageUrl, ...(product.additionalImages || [])],
    "sku": displayArticleNumber || product.id,
    "brand": {
      "@type": "Brand",
      "name": "The X Shop"
    },
    "offers": {
      "@type": "Offer",
      "url": typeof window !== 'undefined' ? window.location.href : `https://the-x.shop/product/${product.id}`,
      "priceCurrency": "RUB",
      "price": displayPrice,
      "availability": hasStock() ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "The X Shop"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "bestRating": "5",
      "ratingCount": "47"
    }
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
        {/* Яндекс микроразметка */}
        <script type="application/ld+json">
          {JSON.stringify(yandexStructuredData)}
        </script>
        
        {/* Дополнительные мета-теги для Яндекса */}
        <meta name="yandex-verification" content="товар" />
        <meta property="product:price:amount" content={String(displayPrice)} />
        <meta property="product:price:currency" content="RUB" />
        <meta property="product:availability" content={hasStock() ? "in stock" : "out of stock"} />
        <meta property="product:condition" content="new" />
        <meta property="product:brand" content="The X Shop" />
        <meta property="product:retailer_item_id" content={displayArticleNumber || product.id} />
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
              <meta itemProp="sku" content={displayArticleNumber || product.id} />
              
              {/* Display article number if available */}
              {displayArticleNumber && (
                <div className="text-sm text-muted-foreground mb-2">
                  Артикул: <span>{displayArticleNumber}</span>
                </div>
              )}
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
