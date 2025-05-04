
import { Link } from "react-router-dom";
import { Product } from "@/types/product";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  
  const handleAddToCart = () => {
    addItem({
      product,
      quantity: 1,
      color: product.colors ? product.colors[0] : undefined,
      size: product.sizes ? product.sizes[0] : undefined,
    });
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden transition-all hover:shadow-md">
      <Link to={`/product/${product.id}`} className="aspect-square overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.title} 
          className="h-full w-full object-cover transition-transform hover:scale-105" 
        />
      </Link>
      <CardContent className="flex-grow p-4">
        <div className="space-y-1">
          <Link to={`/product/${product.id}`} className="block">
            <h3 className="font-semibold line-clamp-2 hover:underline">
              {product.title}
            </h3>
          </Link>
          <div className="flex items-center gap-2">
            {product.discountPrice ? (
              <>
                <p className="font-semibold">{product.discountPrice} ₽</p>
                <p className="text-sm text-muted-foreground line-through">{product.price} ₽</p>
              </>
            ) : (
              <p className="font-semibold">{product.price} ₽</p>
            )}
          </div>
          <div className="flex items-center">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  fill={i < Math.round(product.rating) ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`w-4 h-4 ${
                    i < Math.round(product.rating) ? "text-yellow-500" : "text-gray-300"
                  }`}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
              ))}
            </div>
            <span className="text-xs text-muted-foreground ml-1">
              {product.rating}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Страна: {product.countryOfOrigin}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={handleAddToCart} 
          className="w-full"
          disabled={!product.inStock}
        >
          <ShoppingCart className="mr-2 h-4 w-4" /> В корзину
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
