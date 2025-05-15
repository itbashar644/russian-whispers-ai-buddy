
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById, getRelatedProducts, getRelatedColorProducts } from "@/data/products";
import { Product as ProductType, ColorVariant } from "@/types/product";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ChevronRight, Color } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/context/CartContext";
import ProductGrid from "@/components/products/ProductGrid";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ColorVariantsGrid from "@/components/products/ColorVariantsGrid";

const Product = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductType[]>([]);
  const [relatedColorProducts, setRelatedColorProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<string>("description");
  const [selectedColorVariant, setSelectedColorVariant] = useState<ColorVariant | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        // Загрузка товара
        const productData = await getProductById(id);
        if (productData) {
          setProduct(productData);
          setSelectedImage(productData.imageUrl);
          
          // Если у товара есть цветовые варианты, устанавливаем первый по умолчанию
          if (productData.colorVariants && productData.colorVariants.length > 0) {
            setSelectedColorVariant(productData.colorVariants[0]);
          }
          
          // Загрузка связанных товаров
          const related = await getRelatedProducts(id);
          setRelatedProducts(related);
          
          // Загрузка связанных цветовых вариантов
          const colorVariants = await getRelatedColorProducts(id);
          setRelatedColorProducts(colorVariants);
        }
      } catch (error) {
        console.error("Ошибка при загрузке товара:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  // Обработчик добавления товара в корзину
  const handleAddToCart = () => {
    if (product) {
      addItem({
        product,
        quantity: 1,
        color: selectedColorVariant?.color,
        selectedColorVariant
      });
    }
  };

  // Обработчик выбора цветового варианта
  const handleColorVariantSelect = (variant: ColorVariant) => {
    setSelectedColorVariant(variant);
    
    // Обновляем выбранное изображение, если у варианта есть своё
    if (variant.imageUrl) {
      setSelectedImage(variant.imageUrl);
    }
  };

  // Получаем текущую цену с учетом выбранного варианта и скидки
  const getCurrentPrice = () => {
    if (selectedColorVariant) {
      return selectedColorVariant.discountPrice || selectedColorVariant.price;
    }
    return product?.discountPrice || product?.price || 0;
  };

  // Получаем исходную цену с учетом выбранного варианта
  const getOriginalPrice = () => {
    if (selectedColorVariant) {
      return selectedColorVariant.price;
    }
    return product?.price || 0;
  };

  // Проверяем наличие товара с учетом выбранного варианта
  const isInStock = () => {
    if (!product) return false;
    
    if (selectedColorVariant) {
      return selectedColorVariant.stockQuantity !== undefined && selectedColorVariant.stockQuantity > 0;
    }
    
    return product.inStock && (product.stockQuantity === undefined ? false : product.stockQuantity > 0);
  };

  // Формируем заголовок страницы
  const getTitle = () => {
    if (!product) return "Загрузка...";
    
    if (selectedColorVariant && selectedColorVariant.color) {
      return `${product.title} (${selectedColorVariant.color})`;
    }
    
    return product.title;
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="container px-4 py-8 md:px-6 flex-grow">
          <div className="animate-pulse space-y-8">
            <div className="flex gap-2 items-center">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-24" />
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <div className="grid grid-cols-5 gap-2">
                  {[...Array(5)].map((_, index) => (
                    <Skeleton key={index} className="aspect-square rounded-md" />
                  ))}
                </div>
              </div>
              
              <div className="space-y-6">
                <Skeleton className="h-8 w-3/4" />
                <div className="space-y-2">
                  <Skeleton className="h-10 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
                <Skeleton className="h-32 w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
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
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="container px-4 py-8 md:px-6 flex-grow">
          <div className="flex flex-col items-center justify-center py-12">
            <h1 className="text-2xl font-bold mb-4">Товар не найден</h1>
            <p className="text-muted-foreground mb-8">К сожалению, запрашиваемый товар не найден или был удален.</p>
            <Button asChild>
              <Link to="/catalog">Вернуться в каталог</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="container px-4 py-8 md:px-6 flex-grow">
        {/* Хлебные крошки */}
        <div className="flex items-center text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary">Главная</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <Link to="/catalog" className="hover:text-primary">Каталог</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <Link to={`/catalog?category=${product.category}`} className="hover:text-primary">
            {product.category}
          </Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="truncate max-w-[200px]">{product.title}</span>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Изображения товара */}
          <div className="space-y-4">
            <AspectRatio ratio={1/1} className="bg-muted overflow-hidden rounded-lg border">
              <img 
                src={selectedImage} 
                alt={product.title} 
                className="object-cover w-full h-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            </AspectRatio>
            
            {/* Миниатюры изображений */}
            <div className="grid grid-cols-5 gap-2">
              <button 
                className={`aspect-square rounded-md overflow-hidden border-2 ${selectedImage === product.imageUrl ? 'border-primary' : 'border-transparent'}`}
                onClick={() => setSelectedImage(product.imageUrl)}
              >
                <img 
                  src={product.imageUrl} 
                  alt={product.title} 
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </button>
              {product.additionalImages?.map((img, index) => (
                <button 
                  key={index}
                  className={`aspect-square rounded-md overflow-hidden border-2 ${selectedImage === img ? 'border-primary' : 'border-transparent'}`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img 
                    src={img} 
                    alt={`${product.title} - изображение ${index + 1}`} 
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                </button>
              ))}
              
              {/* Миниатюры изображений цветовых вариантов */}
              {product.colorVariants?.map((variant, index) => (
                variant.imageUrl && (
                  <button 
                    key={`variant-${index}`}
                    className={`aspect-square rounded-md overflow-hidden border-2 ${selectedImage === variant.imageUrl ? 'border-primary' : 'border-transparent'}`}
                    onClick={() => {
                      setSelectedImage(variant.imageUrl || product.imageUrl);
                      setSelectedColorVariant(variant);
                    }}
                  >
                    <img 
                      src={variant.imageUrl} 
                      alt={`${product.title} - ${variant.color}`} 
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  </button>
                )
              ))}
            </div>
          </div>
          
          {/* Информация о товаре */}
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">{getTitle()}</h1>
            
            {/* Цена */}
            <div className="flex items-center">
              <span className="text-2xl font-bold mr-3">{getCurrentPrice()} ₽</span>
              {getCurrentPrice() !== getOriginalPrice() && (
                <span className="text-muted-foreground line-through">{getOriginalPrice()} ₽</span>
              )}
            </div>
            
            {/* Артикул */}
            {(selectedColorVariant?.articleNumber || product.articleNumber) && (
              <p className="text-sm text-muted-foreground">
                Артикул: {selectedColorVariant?.articleNumber || product.articleNumber}
              </p>
            )}
            
            {/* Статус наличия */}
            <div className={`text-sm font-medium ${isInStock() ? "text-green-600" : "text-red-500"}`}>
              {isInStock() ? "В наличии" : "Нет в наличии"}
            </div>
            
            {/* Related color variants */}
            {relatedColorProducts.length > 0 && (
              <ColorVariantsGrid 
                currentProduct={product}
                relatedProducts={relatedColorProducts}
              />
            )}
            
            {/* Цветовые варианты */}
            {product.colorVariants && product.colorVariants.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Color className="h-5 w-5" />
                  <span className="font-medium">Цвет: {selectedColorVariant?.color || product.colorVariants[0].color}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.colorVariants.map((variant, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm ${
                        selectedColorVariant?.color === variant.color
                          ? "bg-primary text-primary-foreground font-medium"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                      onClick={() => handleColorVariantSelect(variant)}
                    >
                      <span className="w-3 h-3 rounded-full" style={{ 
                        backgroundColor: variant.color.toLowerCase() !== 'белый' ? variant.color.toLowerCase() : '#ffffff',
                        border: variant.color.toLowerCase() === 'белый' ? '1px solid #ccc' : 'none' 
                      }}></span>
                      {variant.color}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Кнопка добавления в корзину */}
            <Button 
              size="lg" 
              className="w-full mt-6" 
              onClick={handleAddToCart}
              disabled={!isInStock()}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Добавить в корзину
            </Button>
            
            {/* Кнопки маркетплейсов */}
            {((selectedColorVariant && (selectedColorVariant.ozonUrl || selectedColorVariant.wildberriesUrl || selectedColorVariant.avitoUrl)) || 
              (!selectedColorVariant && (product.ozonUrl || product.wildberriesUrl || product.avitoUrl))) && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Купить на маркетплейсах:</p>
                <div className="flex flex-wrap gap-2">
                  {(selectedColorVariant?.ozonUrl || product.ozonUrl) && (
                    <a 
                      href={selectedColorVariant?.ozonUrl || product.ozonUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-muted hover:bg-muted/80 px-3 py-2 rounded-md"
                    >
                      <img 
                        src="/lovable-uploads/df8ec6c9-6d3f-4ec5-b65f-72e13df2ea76.png" 
                        alt="Ozon" 
                        className="w-5 h-5 object-contain" 
                      />
                      <span className="text-sm font-medium">Ozon</span>
                    </a>
                  )}
                  
                  {(selectedColorVariant?.wildberriesUrl || product.wildberriesUrl) && (
                    <a 
                      href={selectedColorVariant?.wildberriesUrl || product.wildberriesUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-muted hover:bg-muted/80 px-3 py-2 rounded-md"
                    >
                      <img 
                        src="/lovable-uploads/0b04b72a-65f0-4115-9cea-5a0f215b83d4.png" 
                        alt="Wildberries" 
                        className="w-5 h-5 object-contain" 
                      />
                      <span className="text-sm font-medium">Wildberries</span>
                    </a>
                  )}
                  
                  {(selectedColorVariant?.avitoUrl || product.avitoUrl) && (
                    <a 
                      href={selectedColorVariant?.avitoUrl || product.avitoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-muted hover:bg-muted/80 px-3 py-2 rounded-md"
                    >
                      <img 
                        src="/lovable-uploads/b1cb4ce9-8bc4-48a9-83c3-f578212965a7.png" 
                        alt="Avito" 
                        className="w-5 h-5 object-contain" 
                      />
                      <span className="text-sm font-medium">Avito</span>
                    </a>
                  )}
                </div>
              </div>
            )}
            
            {/* Табы с дополнительной информацией */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mt-8">
              <TabsList className="w-full">
                <TabsTrigger value="description" className="flex-1">Описание</TabsTrigger>
                <TabsTrigger value="specifications" className="flex-1">Характеристики</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-4">
                <div className="prose max-w-none">
                  {product.description.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="specifications" className="mt-4">
                <div className="space-y-2">
                  {product.specifications && Object.keys(product.specifications).length > 0 ? (
                    <div className="divide-y">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="grid grid-cols-2 py-2 text-sm">
                          <span className="font-medium">{key}</span>
                          <span>{value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-4 text-center text-muted-foreground">
                      Характеристики отсутствуют
                    </div>
                  )}
                  
                  {/* Дополнительная информация */}
                  <div className="grid grid-cols-2 py-2 text-sm">
                    <span className="font-medium">Страна производства</span>
                    <span>{product.countryOfOrigin}</span>
                  </div>
                  
                  {product.material && (
                    <div className="grid grid-cols-2 py-2 text-sm">
                      <span className="font-medium">Материал</span>
                      <span>{product.material}</span>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Связанные товары */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <ProductGrid products={relatedProducts} title="Похожие товары" />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Product;
