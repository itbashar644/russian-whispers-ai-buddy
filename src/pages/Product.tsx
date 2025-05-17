
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById, getRelatedProducts, getRelatedColorProducts } from "@/data/products";
import { productMergeApi } from "@/data/products/supabase/productMergeApi";
import { Product as ProductType, ColorVariant } from "@/types/product";
import { ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ProductGrid from "@/components/products/ProductGrid";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductImageGallery from "@/components/products/ProductImageGallery";
import ProductInfo from "@/components/products/ProductInfo";
import ProductDetails from "@/components/products/ProductDetails";
import ProductVariantSelector from "@/components/products/ProductVariantSelector";

const Product = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductType[]>([]);
  const [relatedColorProducts, setRelatedColorProducts] = useState<ProductType[]>([]);
  const [modelVariants, setModelVariants] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<string>("description");
  const [selectedColorVariant, setSelectedColorVariant] = useState<ColorVariant | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        // Load product
        const productData = await getProductById(id);
        if (productData) {
          setProduct(productData);
          
          // Set first color variant as default if available
          if (productData.colorVariants && productData.colorVariants.length > 0) {
            setSelectedColorVariant(productData.colorVariants[0]);
          }
          
          // Load related products
          const related = await getRelatedProducts(id);
          setRelatedProducts(related);
          
          // Load color variants
          const colorVariants = await getRelatedColorProducts(id);
          setRelatedColorProducts(colorVariants);
          
          // Load model variants if this product has a model name
          if (productData.modelName) {
            try {
              const variants = await productMergeApi.getProductsByModelName(productData.modelName);
              if (variants && variants.length > 0) {
                setModelVariants(variants);
              }
            } catch (error) {
              console.error("Error fetching model variants:", error);
            }
          }
        }
      } catch (error) {
        console.error("Ошибка при загрузке товара:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  // Handler for color variant selection
  const handleColorVariantSelect = (variant: ColorVariant) => {
    setSelectedColorVariant(variant);
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
            <Link to="/catalog" className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-10 px-4 py-2 shadow-md hover:bg-primary/90 transition-colors">
              Вернуться в каталог
            </Link>
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
        {/* Breadcrumbs */}
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
          {/* Product images */}
          <ProductImageGallery 
            product={product}
            selectedColorVariant={selectedColorVariant}
            onColorVariantSelect={handleColorVariantSelect}
          />
          
          {/* Product info */}
          <div>
            <ProductInfo 
              product={product}
              relatedColorProducts={relatedColorProducts}
              selectedColorVariant={selectedColorVariant}
              onColorVariantSelect={handleColorVariantSelect}
            />
            
            {/* Show variant selector if model variants exist */}
            {modelVariants.length > 1 && (
              <ProductVariantSelector 
                product={product}
                variants={modelVariants}
              />
            )}
          </div>
        </div>
        
        {/* Product details (tabs with information) */}
        <ProductDetails
          product={product}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
        
        {/* Related products */}
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
