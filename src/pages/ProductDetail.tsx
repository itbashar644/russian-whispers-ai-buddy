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

  // Force scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
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

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow container px-4 py-8 md:px-6">
        <ProductHeader title={product.title} category={product.category} />

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left side - images */}
          <div>
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
            {/* Product title and price */}
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            
            {/* Display article number if available */}
            {displayArticleNumber && (
              <div className="text-sm text-muted-foreground mb-2">
                Артикул: {displayArticleNumber}
              </div>
            )}
            
            {/* Add stock status indicator */}
            <StockStatus 
              product={product} 
              selectedColor={selectedColor} 
              hasStock={hasStock()} 
            />
            
            {/* Pricing */}
            <ProductPricing 
              product={product} 
              selectedColorVariant={selectedColorVariant} 
            />
            
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
        <ProductDetails product={product} />

        {/* Related products */}
        <RelatedProducts products={relatedProducts} />
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
