
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useCart } from "@/context/CartContext";
import { DeliveryMethod } from "@/types/product";
import { deliveryMethods } from "@/data/deliveryMethods";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { toast } from "@/components/ui/sonner";
import { Truck, Package, Home } from "lucide-react";
import { createOrder } from "@/services/orderService";
import { getProductById } from "@/data/products/productData";

const getDeliveryIcon = (iconName: string) => {
  switch (iconName) {
    case 'truck': return <Truck className="h-5 w-5" />;
    case 'package': return <Package className="h-5 w-5" />;
    case 'home': return <Home className="h-5 w-5" />;
    default: return null;
  }
};

const Cart = () => {
  const navigate = useNavigate();
  const { 
    items, 
    deliveryMethod, 
    updateQuantity, 
    removeItem, 
    setDeliveryMethod,
    subtotal, 
    total,
    clearCart,
    validateStock
  } = useCart();
  
  const [orderForm, setOrderForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Проверяем наличие товаров перед оформлением заказа
  const checkStock = () => {
    // Проверяем актуальность данных о наличии товаров
    for (const item of items) {
      const currentProduct = getProductById(item.product.id);
      if (!currentProduct) {
        // Товар не найден, удаляем из корзины
        toast.error(`Товар "${item.product.title}" больше не доступен и удален из корзины`);
        removeItem(item.product.id);
        return false;
      }
      
      if (!currentProduct.inStock) {
        // Товар не в наличии
        toast.error(`Товар "${item.product.title}" закончился и удален из корзины`);
        removeItem(item.product.id);
        return false;
      }
      
      if (currentProduct.stockQuantity !== undefined && currentProduct.stockQuantity < item.quantity) {
        // Недостаточно товара
        if (currentProduct.stockQuantity <= 0) {
          toast.error(`Товар "${item.product.title}" закончился и удален из корзины`);
          removeItem(item.product.id);
        } else {
          toast.error(`Доступно только ${currentProduct.stockQuantity} шт. товара "${item.product.title}"`);
          updateQuantity(item.product.id, currentProduct.stockQuantity);
        }
        return false;
      }
    }
    
    return true;
  };
  
  const handleOrderFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrderForm((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectDelivery = (method: DeliveryMethod) => {
    setDeliveryMethod(method);
  };
  
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast.error("Ваша корзина пуста. Добавьте товары перед оформлением заказа.");
      return;
    }
    
    if (!deliveryMethod) {
      toast.error("Пожалуйста, выберите способ доставки.");
      return;
    }

    // Проверяем наличие товаров
    const isStockValid = validateStock() && checkStock();
    if (!isStockValid) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Создаем заказ
      const result = await createOrder({
        items: items,
        total: total,
        delivery_method: deliveryMethod.id,
        customer_name: orderForm.name,
        customer_email: orderForm.email,
        customer_phone: orderForm.phone,
        delivery_address: orderForm.address
      });
      
      if (result.success) {
        toast.success("Заказ успешно оформлен! Спасибо за покупку.");
        clearCart();
        
        // Redirect to homepage
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        toast.error(`Ошибка при оформлении заказа: ${result.error?.message || 'Пожалуйста, попробуйте позже'}`);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте позже.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow container px-4 py-8 md:px-6">
        <h1 className="text-3xl font-bold mb-6">Корзина</h1>
        
        {items.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">Ваша корзина пуста</h2>
            <p className="text-muted-foreground mb-6">
              Добавьте товары в корзину, чтобы оформить заказ
            </p>
            <Button asChild>
              <Link to="/catalog">Перейти в каталог</Link>
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-[2fr_1fr] gap-8">
            <div>
              <div className="rounded-lg border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-4">Товар</th>
                      <th className="text-right p-4 hidden sm:table-cell">Цена</th>
                      <th className="text-right p-4">Кол-во</th>
                      <th className="text-right p-4">Сумма</th>
                      <th className="p-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => {
                      // Получаем актуальные данные о товаре для проверки наличия
                      const currentProduct = getProductById(item.product.id);
                      const stockQuantity = currentProduct?.stockQuantity;
                      const isAvailable = currentProduct?.inStock && 
                        (stockQuantity === undefined || stockQuantity >= item.quantity);
                      
                      return (
                        <tr key={item.product.id} className="border-t">
                          <td className="p-4">
                            <div className="flex items-center gap-4">
                              <img 
                                src={item.product.imageUrl} 
                                alt={item.product.title} 
                                className="w-16 h-16 object-cover rounded" 
                              />
                              <div>
                                <h3 className="font-medium">
                                  <Link 
                                    to={`/product/${item.product.id}`} 
                                    className="hover:underline"
                                  >
                                    {item.product.title}
                                  </Link>
                                </h3>
                                {(item.color || item.size) && (
                                  <p className="text-sm text-muted-foreground">
                                    {item.color && `Цвет: ${item.color}`}{" "}
                                    {item.size && `Размер: ${item.size}`}
                                  </p>
                                )}
                                {!isAvailable && (
                                  <p className="text-sm text-red-600 mt-1 font-medium">
                                    {!currentProduct?.inStock 
                                      ? "Нет в наличии" 
                                      : `Доступно только ${stockQuantity} шт.`}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-right hidden sm:table-cell">
                            {item.product.discountPrice || item.product.price} ₽
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              >
                                -
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                disabled={stockQuantity !== undefined && item.quantity >= stockQuantity}
                              >
                                +
                              </Button>
                            </div>
                            {stockQuantity !== undefined && (
                              <div className="text-xs text-muted-foreground mt-1">
                                Доступно: {stockQuantity}
                              </div>
                            )}
                          </td>
                          <td className="p-4 text-right font-medium">
                            {(item.product.discountPrice || item.product.price) * item.quantity} ₽
                          </td>
                          <td className="p-4 text-right">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => removeItem(item.product.id)}
                            >
                              ×
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Выберите способ доставки</h2>
                <RadioGroup 
                  value={deliveryMethod?.id || ""} 
                  className="space-y-3"
                >
                  {deliveryMethods.map((method) => (
                    <div 
                      key={method.id}
                      className={`flex items-center border rounded-lg p-4 cursor-pointer ${
                        deliveryMethod?.id === method.id 
                          ? "border-primary bg-primary/5" 
                          : "hover:bg-muted/50"
                      }`}
                      onClick={() => handleSelectDelivery(method)}
                    >
                      <RadioGroupItem 
                        value={method.id} 
                        id={`delivery-${method.id}`} 
                        className="sr-only" 
                      />
                      <div className="flex flex-1 items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                          {getDeliveryIcon(method.icon)}
                        </div>
                        <div className="flex-1">
                          <Label 
                            htmlFor={`delivery-${method.id}`}
                            className="font-medium cursor-pointer"
                          >
                            {method.name}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {method.description}
                          </p>
                        </div>
                        <div className="font-medium">
                          {method.price > 0 ? `${method.price} ₽` : "Бесплатно"}
                        </div>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>

            <div>
              <div className="rounded-lg border p-6 sticky top-20">
                <h2 className="text-xl font-semibold mb-4">Информация о заказе</h2>
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Товары ({items.length}):</span>
                    <span>{subtotal} ₽</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Доставка:</span>
                    <span>{deliveryMethod ? (deliveryMethod.price > 0 ? `${deliveryMethod.price} ₽` : "Бесплатно") : "-"}</span>
                  </div>
                  <div className="border-t my-2"></div>
                  <div className="flex justify-between font-medium text-lg">
                    <span>Итого:</span>
                    <span>{total} ₽</span>
                  </div>
                </div>
                
                <form onSubmit={handleCheckout} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Имя</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Ваше имя"
                      value={orderForm.name}
                      onChange={handleOrderFormChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="email@example.com"
                      value={orderForm.email}
                      onChange={handleOrderFormChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Телефон</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="+7 (XXX) XXX-XX-XX"
                      value={orderForm.phone}
                      onChange={handleOrderFormChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Адрес доставки</Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="Ваш адрес"
                      value={orderForm.address}
                      onChange={handleOrderFormChange}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting || items.length === 0 || !deliveryMethod}
                  >
                    {isSubmitting ? "Оформление..." : "Оформить заказ"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
