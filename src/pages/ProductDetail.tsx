import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById, getRelatedProducts, getProductPrice } from "@/data/products";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import ProductGrid from "@/components/products/ProductGrid";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { formatVideoUrl } from "@/lib/utils";
import { Product } from "@/types/product";
import { Skeleton } from "@/components/ui/skeleton";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const productData = await getProductById(id);
        setProduct(productData || null);
        
        if (productData) {
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

  // Find the selected color variant if it exists
  const selectedColorVariant = product?.colorVariants?.find(
    v => v.color === selectedColor
  );

  // Check stock availability - now needs to check the specific variant
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

  // Get stock status text
  const getStockStatusText = () => {
    if (!product) return "";
    
    if (!hasStock()) {
      return "Нет в наличии";
    }
    
    // If there's a selected color variant, show its stock
    if (selectedColor && product.colorVariants?.length) {
      const variant = product.colorVariants.find(v => v.color === selectedColor);
      if (variant?.stockQuantity !== undefined) {
        if (variant.stockQuantity <= 3) {
          return `Осталось всего ${variant.stockQuantity} шт.`;
        } else {
          return `В наличии: ${variant.stockQuantity} шт.`;
        }
      }
    }
    
    // Otherwise show the main product stock
    if (product.stockQuantity !== undefined) {
      if (product.stockQuantity <= 3) {
        return `Осталось всего ${product.stockQuantity} шт.`;
      } else {
        return `В наличии: ${product.stockQuantity} шт.`;
      }
    }
    
    return "В наличии";
  };
  
  // Get stock status class
  const getStockStatusClass = () => {
    if (!product) return "";
    
    if (!hasStock()) {
      return "text-red-500";
    }
    
    // If there's a selected color variant, check its stock
    if (selectedColor && product.colorVariants?.length) {
      const variant = product.colorVariants.find(v => v.color === selectedColor);
      if (variant?.stockQuantity !== undefined && variant.stockQuantity <= 3) {
        return "text-orange-500";
      }
    } else if (product.stockQuantity !== undefined && product.stockQuantity <= 3) {
      return "text-orange-500";
    }
    
    return "text-green-600";
  };

  // Effect to update image when color changes
  useEffect(() => {
    if (selectedColor && product?.colorVariants) {
      const variant = product.colorVariants.find(v => v.color === selectedColor);
      if (variant?.imageUrl) {
        // If the variant has an image, set it as the current image
        setCurrentImageIndex(0);
        setImageError(false);
      }
    }
  }, [selectedColor, product]);

  // Force scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container px-4 py-8 md:px-6">
          <div className="mb-6">
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="border rounded-lg overflow-hidden">
                <div className="w-full aspect-square bg-gray-200 animate-pulse"></div>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <div className="h-10 w-3/4 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="h-6 w-1/4 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Товар не найден</h1>
          <p className="text-muted-foreground mb-4">
            Запрашиваемый товар не существует или был удален
          </p>
          <Button asChild>
            <Link to="/catalog">Вернуться в каталог</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (value: number) => {
    if (value >= 1) {
      // Check against the selected color variant's stock if applicable
      if (selectedColor && product.colorVariants?.length) {
        const variant = product.colorVariants.find(v => v.color === selectedColor);
        if (variant?.stockQuantity !== undefined && value > variant.stockQuantity) {
          setQuantity(variant.stockQuantity);
          return;
        }
      }
      
      // Otherwise check against the main product stock
      if (product.stockQuantity !== undefined && value > product.stockQuantity) {
        setQuantity(product.stockQuantity);
      } else {
        setQuantity(value);
      }
    }
  };

  const handleAddToCart = () => {
    if (hasStock()) {
      addItem({
        product,
        quantity,
        color: selectedColor,
        selectedColorVariant
      });
    }
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    // Reset quantity to 1 when changing color
    setQuantity(1);
  };

  // Get variant-specific image if available, otherwise use the main product image
  const getVariantImage = () => {
    if (selectedColor && product.colorVariants) {
      const variant = product.colorVariants.find(v => v.color === selectedColor);
      if (variant?.imageUrl) {
        return variant.imageUrl;
      }
    }
    return product.imageUrl;
  };

  // Get all available images (main image + additional images)
  const allImages = [
    getVariantImage(),
    ...(product.additionalImages || [])
  ].filter(Boolean);

  // Current image to display
  const currentImage = allImages[currentImageIndex] || "/placeholder.svg";

  // Функция для обработки ошибок загрузки изображения
  const handleImageError = () => {
    console.error("Ошибка загрузки изображения:", currentImage);
    setImageError(true);
  };

  // Функция для обработки ошибок загрузки видео
  const handleVideoError = () => {
    console.error("Ошибка загрузки видео:", product.videoUrl);
    setVideoError(true);
  };

  // Функция для определения типа рендера видео в зависимости от типа
  const renderVideo = () => {
    if (!product.videoUrl) return null;
    
    // Если произошла ошибка загрузки видео, не показываем блок
    if (videoError) return null;

    // Определяем тип видео (по умолчанию mp4 для обратной совместимости)
    const videoType = product.videoType || 'mp4';
    
    switch (videoType) {
      case 'vk':
      case 'youtube':
        const formattedUrl = formatVideoUrl(product.videoUrl, videoType);
        return (
          <div className="mt-4 border rounded-lg overflow-hidden aspect-video">
            <iframe 
              src={formattedUrl}
              className="w-full h-full"
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
              title={product.title}
              onError={handleVideoError}
            />
          </div>
        );
      case 'mp4':
      default:
        return (
          <div className="mt-4 border rounded-lg overflow-hidden">
            <video 
              controls 
              className="w-full h-auto"
              poster={imageError ? "/placeholder.svg" : product.imageUrl}
              onError={handleVideoError}
            >
              <source src={product.videoUrl} type="video/mp4" />
              Ваш браузер не поддерживает видео.
            </video>
          </div>
        );
    }
  };

  // Get article number to display - use variant-specific article number if available
  const getArticleNumber = () => {
    if (selectedColor && product.colorVariants) {
      const variant = product.colorVariants.find(v => v.color === selectedColor);
      if (variant?.articleNumber) {
        return variant.articleNumber;
      }
    }
    return product.articleNumber;
  };

  const displayArticleNumber = getArticleNumber();
  
  // Get the price to display
  const displayPrice = getProductPrice(product, selectedColor);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow container px-4 py-8 md:px-6">
        <div className="mb-6">
          <Link 
            to="/catalog" 
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Назад к каталогу
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            {/* Main image display */}
            <div className="border rounded-lg overflow-hidden">
              <img 
                src={imageError ? "/placeholder.svg" : currentImage} 
                alt={product.title} 
                className="w-full h-auto object-cover aspect-square" 
                onError={handleImageError}
              />
            </div>
            
            {/* Thumbnails gallery */}
            {allImages.length > 1 && (
              <div className="mt-4 grid grid-cols-5 gap-2">
                {allImages.map((img, index) => (
                  <button 
                    key={index}
                    className={`border rounded overflow-hidden aspect-square ${
                      index === currentImageIndex ? 'border-primary border-2' : 'border-gray-200'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img 
                      src={img} 
                      alt={`${product.title} - изображение ${index + 1}`}
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
            
            {/* Видео, если есть */}
            {product.videoUrl && renderVideo()}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
              
              {/* Display article number if available */}
              {displayArticleNumber && (
                <div className="text-sm text-muted-foreground mb-2">
                  Артикул: {displayArticleNumber}
                </div>
              )}
              
              {/* Add stock status indicator */}
              <div className={`${getStockStatusClass()} font-medium text-sm mb-4`}>
                {getStockStatusText()}
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      fill={i < Math.round(product.rating) ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="2"
                      className={`w-5 h-5 ${
                        i < Math.round(product.rating) ? "text-yellow-500" : "text-gray-300"
                      }`}
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  Рейтинг: {product.rating}/5
                </span>
              </div>

              <div className="mb-6">
                {/* Show variant-specific pricing */}
                {selectedColorVariant?.discountPrice ? (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{selectedColorVariant.discountPrice} ₽</span>
                    <span className="text-lg text-muted-foreground line-through">
                      {selectedColorVariant.price} ₽
                    </span>
                    <span className="bg-red-500 text-white px-2 py-0.5 text-xs rounded">
                      Скидка {Math.round(((selectedColorVariant.price - selectedColorVariant.discountPrice) / selectedColorVariant.price) * 100)}%
                    </span>
                  </div>
                ) : selectedColorVariant ? (
                  <span className="text-2xl font-bold">{selectedColorVariant.price} ₽</span>
                ) : product.discountPrice ? (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{product.discountPrice} ₽</span>
                    <span className="text-lg text-muted-foreground line-through">
                      {product.price} ₽
                    </span>
                    <span className="bg-red-500 text-white px-2 py-0.5 text-xs rounded">
                      Скидка {Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl font-bold">{product.price} ₽</span>
                )}
              </div>

              {/* Marketplace links */}
              {(product.ozonUrl || product.wildberriesUrl || product.avitoUrl) && (
                <div className="flex items-center gap-3 my-4">
                  <span className="text-sm text-muted-foreground">Доступен на:</span>
                  <div className="flex gap-3">
                    {product.wildberriesUrl && (
                      <a 
                        href={product.wildberriesUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-purple-700 hover:text-purple-800"
                        title="Открыть на Wildberries"
                      >
                        <div className="flex items-center justify-center w-8 h-8 overflow-hidden">
                          <img 
                            src="/lovable-uploads/0b04b72a-65f0-4115-9cea-5a0f215b83d4.png"
                            alt="Wildberries" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="hidden sm:inline">Wildberries</span>
                      </a>
                    )}
                    
                    {product.ozonUrl && (
                      <a 
                        href={product.ozonUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                        title="Открыть на Ozon"
                      >
                        <div className="flex items-center justify-center w-8 h-8 overflow-hidden">
                          <img 
                            src="/lovable-uploads/df8ec6c9-6d3f-4ec5-b65f-72e13df2ea76.png"
                            alt="Ozon" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="hidden sm:inline">Ozon</span>
                      </a>
                    )}
                    
                    {product.avitoUrl && (
                      <a 
                        href={product.avitoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700"
                        title="Открыть на Авито"
                      >
                        <div className="flex items-center justify-center w-8 h-8 overflow-hidden">
                          <img 
                            src="/lovable-uploads/b1cb4ce9-8bc4-48a9-83c3-f578212965a7.png"
                            alt="Avito" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="hidden sm:inline">Авито</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {/* Color selection */}
              {product.colorVariants && product.colorVariants.length > 0 ? (
                <div>
                  <h3 className="font-medium mb-2">Цвет</h3>
                  <RadioGroup 
                    value={selectedColor || ''} 
                    onValueChange={handleColorChange}
                    className="flex flex-wrap gap-2"
                  >
                    {product.colorVariants.map((variant) => (
                      <div key={variant.color} className="flex items-center">
                        <RadioGroupItem 
                          value={variant.color} 
                          id={`color-${variant.color}`} 
                          className="peer sr-only"
                          disabled={variant.stockQuantity === 0}
                        />
                        <Label 
                          htmlFor={`color-${variant.color}`}
                          className={`px-3 py-1.5 border rounded-md text-sm cursor-pointer 
                            peer-data-[state=checked]:bg-primary 
                            peer-data-[state=checked]:text-primary-foreground 
                            peer-data-[state=checked]:border-primary
                            ${variant.stockQuantity === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                          `}
                        >
                          {variant.color}
                          {variant.price !== product.price && (
                            <span className="ml-1 text-xs">
                              ({variant.price} ₽)
                            </span>
                          )}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ) : product.colors && product.colors.length > 0 ? (
                <div>
                  <h3 className="font-medium mb-2">Цвет</h3>
                  <RadioGroup 
                    value={selectedColor || ''} 
                    onValueChange={setSelectedColor}
                    className="flex flex-wrap gap-2"
                  >
                    {product.colors.map((color) => (
                      <div key={color} className="flex items-center">
                        <RadioGroupItem 
                          value={color} 
                          id={`color-${color}`} 
                          className="peer sr-only" 
                        />
                        <Label 
                          htmlFor={`color-${color}`}
                          className="px-3 py-1.5 border rounded-md text-sm cursor-pointer peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground peer-data-[state=checked]:border-primary"
                        >
                          {color}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ) : null}

              <div>
                <h3 className="font-medium mb-2">Количество</h3>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    // Check against variant stock if applicable
                    disabled={
                      (selectedColorVariant?.stockQuantity !== undefined && 
                       quantity >= selectedColorVariant.stockQuantity) ||
                      (product.stockQuantity !== undefined && 
                       quantity >= product.stockQuantity)
                    }
                  >
                    +
                  </Button>
                </div>
              </div>

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

            <div className="border-t pt-6">
              <h3 className="font-semibold mb-3">Описание</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Похожие товары</h2>
            <ProductGrid products={relatedProducts} />
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
