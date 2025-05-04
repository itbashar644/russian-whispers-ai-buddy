
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById, getRelatedProducts } from "@/data/products";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import ProductGrid from "@/components/products/ProductGrid";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = id ? getProductById(id) : undefined;
  const relatedProducts = id ? getRelatedProducts(id, 4) : [];
  const { addItem } = useCart();
  
  const [selectedFlavor, setSelectedFlavor] = useState<string | undefined>(
    product?.flavors ? product.flavors[0] : undefined
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product?.sizes ? product.sizes[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);

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
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    addItem({
      product,
      quantity,
      flavor: selectedFlavor,
      size: selectedSize,
    });
  };

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
            <div className="border rounded-lg overflow-hidden">
              <img 
                src={product.imageUrl} 
                alt={product.title} 
                className="w-full h-auto object-cover aspect-square" 
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
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
                {product.discountPrice ? (
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
            </div>

            <div className="space-y-4">
              {product.flavors && product.flavors.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Вкус</h3>
                  <RadioGroup 
                    value={selectedFlavor} 
                    onValueChange={setSelectedFlavor}
                    className="flex flex-wrap gap-2"
                  >
                    {product.flavors.map((flavor) => (
                      <div key={flavor} className="flex items-center">
                        <RadioGroupItem 
                          value={flavor} 
                          id={`flavor-${flavor}`} 
                          className="peer sr-only" 
                        />
                        <Label 
                          htmlFor={`flavor-${flavor}`}
                          className="px-3 py-1.5 border rounded-md text-sm cursor-pointer peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground peer-data-[state=checked]:border-primary"
                        >
                          {flavor}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Размер</h3>
                  <RadioGroup 
                    value={selectedSize} 
                    onValueChange={setSelectedSize}
                    className="flex flex-wrap gap-2"
                  >
                    {product.sizes.map((size) => (
                      <div key={size} className="flex items-center">
                        <RadioGroupItem 
                          value={size} 
                          id={`size-${size}`} 
                          className="peer sr-only" 
                        />
                        <Label 
                          htmlFor={`size-${size}`}
                          className="px-3 py-1.5 border rounded-md text-sm cursor-pointer peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground peer-data-[state=checked]:border-primary"
                        >
                          {size}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

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
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {product.inStock ? "Добавить в корзину" : "Нет в наличии"}
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
