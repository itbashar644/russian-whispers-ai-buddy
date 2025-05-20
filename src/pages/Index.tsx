
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getBestsellers, getNewProducts, getAllCategories, getCategoryObjects } from "@/data/products";
import ProductGrid from "@/components/products/ProductGrid";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SEOHead } from "@/components/seo/SEOHead";
import { Box } from "lucide-react";
import { Product } from "@/types/product";
import { Category } from "@/data/products/categoryData";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const Index = () => {
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryObjects, setCategoryObjects] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    document.title = "The X Shop | Товары из Китая для вашего дома";
    
    async function loadData() {
      try {
        setLoading(true);
        
        // Загружаем все необходимые данные
        const [bestSellersData, newProductsData, categoriesData, categoryObjectsData] = await Promise.all([
          getBestsellers(),
          getNewProducts(),
          getAllCategories(),
          getCategoryObjects()
        ]);
        
        setBestsellers(bestSellersData);
        setNewProducts(newProductsData);
        setCategories(categoriesData);
        setCategoryObjects(categoryObjectsData);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <SEOHead
        title="Главная"
        description="The X Shop: Товары из Китая для вашего дома. Минималистичный дизайн, высокое качество, доступные цены."
        keywords="товары из китая, дизайнерские товары, товары для дома, минимализм"
      />
      
      <Navbar />

      <main className="flex-grow" itemScope itemType="https://schema.org/WebPage">
        {/* Hero Section */}
        <section className="bg-gray-100 py-16">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 items-center">
              <div className="space-y-4" itemProp="mainContentOfPage">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
                  The X Shop:<br />Товары из Китая для вашего дома
                </h1>
                <p className="text-lg text-muted-foreground md:text-xl">
                  Минималистичный дизайн, высокое качество, доступные цены.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild>
                    <Link to="/catalog">Смотреть каталог</Link>
                  </Button>
                  {categories.length > 0 && (
                    <Button variant="outline" size="lg" asChild>
                      <Link to={`/catalog?category=${categories[0]}`}>
                        {categories[0]}
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
              <div className="rounded-lg overflow-hidden">
                <img
                  alt="Современные технологические товары"
                  className="aspect-[4/3] object-cover w-full"
                  src="/lovable-uploads/20f4bfd6-6f1c-40b7-9d9c-9b1be8939979.png"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold mb-8">Категории</h2>
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-200 animate-pulse rounded-lg">
                    <div style={{ paddingTop: "133.33%" }} className="relative"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" itemScope itemType="https://schema.org/ItemList">
                {categoryObjects.map((category, index) => (
                  <Link
                    key={category.name}
                    to={`/catalog?category=${category.name}`}
                    className="group relative overflow-hidden rounded-lg"
                    itemProp="itemListElement" 
                    itemScope 
                    itemType="https://schema.org/ListItem"
                  >
                    <meta itemProp="position" content={String(index + 1)} />
                    <div className="relative" style={{ paddingTop: "133.33%" }}>
                      <img
                        itemProp="image"
                        alt={category.name}
                        className="absolute top-0 left-0 h-full w-full object-cover transition-transform group-hover:scale-105"
                        src={category.imageUrl}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-black/50 py-1 px-2">
                        <h3 className="text-center text-base font-medium text-white" itemProp="name">{category.name}</h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Bestsellers Section */}
        <section className="py-12 bg-gray-50" itemScope itemType="https://schema.org/CollectionPage">
          <meta itemProp="name" content="Бестселлеры The X Shop" />
          <div className="container px-4 md:px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Бестселлеры</h2>
              <Button variant="link" asChild>
                <Link to="/catalog">Смотреть все</Link>
              </Button>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-[300px] bg-gray-200 animate-pulse rounded-lg"></div>
                ))}
              </div>
            ) : (
              <div itemProp="mainEntity" itemScope itemType="https://schema.org/ItemList">
                <meta itemProp="itemListOrder" content="https://schema.org/ItemListOrderDescending" />
                <meta itemProp="numberOfItems" content={String(bestsellers.length)} />
                <ProductGrid products={bestsellers} />
              </div>
            )}
          </div>
        </section>

        {/* New Products Section */}
        <section className="py-12" itemScope itemType="https://schema.org/CollectionPage">
          <meta itemProp="name" content="Новинки The X Shop" />
          <div className="container px-4 md:px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Новинки</h2>
              <Button variant="link" asChild>
                <Link to="/catalog">Смотреть все</Link>
              </Button>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-[300px] bg-gray-200 animate-pulse rounded-lg"></div>
                ))}
              </div>
            ) : (
              <div itemProp="mainEntity" itemScope itemType="https://schema.org/ItemList">
                <meta itemProp="itemListOrder" content="https://schema.org/ItemListOrderDescending" />
                <meta itemProp="numberOfItems" content={String(newProducts.length)} />
                <ProductGrid products={newProducts} />
              </div>
            )}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 bg-gray-900 text-white">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold text-center mb-12">Почему выбирают нас</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Прямые поставки",
                  description: "Мы работаем напрямую с производителями из Китая, минуя посредников"
                },
                {
                  title: "Контроль качества",
                  description: "Каждый товар проходит проверку перед отправкой клиенту"
                },
                {
                  title: "Гарантия",
                  description: "Мы предоставляем гарантию на все товары и возможность возврата"
                }
              ].map((benefit) => (
                <div key={benefit.title} className="text-center">
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-400">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
