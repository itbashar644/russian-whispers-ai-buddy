
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getBestsellers, getNewProducts } from "@/data/products";
import ProductGrid from "@/components/products/ProductGrid";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Index = () => {
  const bestsellers = getBestsellers();
  const newProducts = getNewProducts();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gray-100 py-16">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 items-center">
              <div className="space-y-4">
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
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/catalog?category=decor">Декор для дома</Link>
                  </Button>
                </div>
              </div>
              <div className="rounded-lg overflow-hidden">
                <img
                  alt="The X Shop"
                  className="aspect-[4/3] object-cover w-full"
                  src="/placeholder.svg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold mb-8">Категории</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: "Освещение", image: "/placeholder.svg", link: "/catalog?category=lighting" },
                { name: "Декор", image: "/placeholder.svg", link: "/catalog?category=decor" },
                { name: "Кухня", image: "/placeholder.svg", link: "/catalog?category=kitchen" },
                { name: "Текстиль", image: "/placeholder.svg", link: "/catalog?category=textiles" }
              ].map((category) => (
                <Link
                  key={category.name}
                  to={category.link}
                  className="group relative aspect-square overflow-hidden rounded-lg"
                >
                  <img
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    src={category.image}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40">
                    <h3 className="text-xl font-bold text-white">{category.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Bestsellers Section */}
        <section className="py-12 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Бестселлеры</h2>
              <Button variant="link" asChild>
                <Link to="/catalog">Смотреть все</Link>
              </Button>
            </div>
            <ProductGrid products={bestsellers} />
          </div>
        </section>

        {/* New Products Section */}
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Новинки</h2>
              <Button variant="link" asChild>
                <Link to="/catalog">Смотреть все</Link>
              </Button>
            </div>
            <ProductGrid products={newProducts} />
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
