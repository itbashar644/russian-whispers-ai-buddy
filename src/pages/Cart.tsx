
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
    total 
  } = useCart();
  
  const [orderForm, setOrderForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  
  const handleOrderFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrderForm((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectDelivery = (method: DeliveryMethod) => {
    setDeliveryMethod(method);
  };
  
  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast.error("Ваша корзина пуста. Добавьте товары перед оформлением заказа.");
      return;
    }
    
    if (!deliveryMethod) {
      toast.error("Пожалуйста, выберите способ доставки.");
      return;
    }
    
    // In a real app, this would send the order to a server
    toast.success("Заказ успешно оформлен! Спасибо за покупку.");
    
    // Simulate payment success and redirect to homepage
    setTimeout(() => {
      navigate("/");
    }, 2000);
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
                    {items.map((item) => (
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
                              {(item.flavor || item.size) && (
                                <p className="text-sm text-muted-foreground">
                                  {item.flavor && `Вкус: ${item.flavor}`}{" "}
                                  {item.size && `Размер: ${item.size}`}
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
                            >
                              +
                            </Button>
                          </div>
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
                    ))}
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
                  
                  <Button type="submit" className="w-full">
                    Оформить заказ
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
