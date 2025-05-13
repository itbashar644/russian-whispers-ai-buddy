
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { deliveryMethods } from "@/data/deliveryMethods";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { toast } from "@/components/ui/sonner";
import { placeOrder } from "@/services/orderService";
import CartTable from "@/components/cart/CartTable";
import DeliveryMethodSelector from "@/components/cart/DeliveryMethodSelector";
import OrderSummary from "@/components/cart/OrderSummary";
import { useAuth } from "@/context/AuthContext"; // Добавляем импорт для получения данных о пользователе

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Получаем доступ к данным о пользователе
  
  const { 
    items, 
    deliveryMethod, 
    updateQuantity, 
    removeItem, 
    setDeliveryMethod,
    subtotal, 
    total,
    clearCart
  } = useCart();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Check if any items have stock issues
  const hasStockIssues = items.some(item => 
    item.product.stockQuantity !== undefined && 
    item.quantity > item.product.stockQuantity
  );

  // Try to load saved delivery method on mount
  useEffect(() => {
    const savedDeliveryMethodId = localStorage.getItem("savedDeliveryMethodId");
    
    if (savedDeliveryMethodId) {
      const method = deliveryMethods.find(m => m.id === savedDeliveryMethodId);
      if (method) {
        setDeliveryMethod(method);
      }
    }
  }, [setDeliveryMethod]);
  
  const handleDeliveryMethodSelect = (method) => {
    setDeliveryMethod(method);
    try {
      // Save the selected delivery method ID
      localStorage.setItem("savedDeliveryMethodId", method.id);
    } catch (error) {
      console.error("Failed to save delivery method", error);
    }
  };
  
  const handleCheckout = async (formData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    contactMethod: string;
    telegramNickname?: string;
  }) => {
    if (items.length === 0) {
      toast.error("Ваша корзина пуста. Добавьте товары перед оформлением заказа.");
      return;
    }
    
    if (!deliveryMethod) {
      toast.error("Пожалуйста, выберите способ доставки.");
      return;
    }
    
    setIsSubmitting(true);
    
    // Create order data object
    const orderData = {
      user_id: user?.id, // Добавляем ID пользователя, если он авторизован
      items,
      total,
      delivery_method: deliveryMethod.id,
      customer_name: formData.name,
      customer_email: formData.email,
      customer_phone: formData.phone,
      delivery_address: formData.address,
    };
    
    try {
      // Process the order
      const result = await placeOrder(orderData);
      
      if (result.success) {
        toast.success("Заказ успешно оформлен! Спасибо за покупку.");
        // Clear the cart after successful order
        clearCart();
        
        // Если пользователь авторизован, перенаправляем в личный кабинет на страницу заказов
        if (user) {
          toast.info("Вы можете отслеживать статус заказа в личном кабинете", {
            duration: 5000
          });
          // Перенаправляем после небольшой задержки для чтения сообщения
          setTimeout(() => {
            navigate("/account");
          }, 2000);
        } else {
          // Иначе перенаправляем на главную страницу
          setTimeout(() => {
            navigate("/");
          }, 2000);
        }
      } else {
        toast.error("Ошибка при оформлении заказа", {
          description: result.error?.message || "Пожалуйста, попробуйте снова позже."
        });
      }
    } catch (error) {
      toast.error("Произошла неожиданная ошибка", {
        description: "Пожалуйста, попробуйте снова позже."
      });
      console.error("Order placement error:", error);
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
              <CartTable 
                items={items} 
                updateQuantity={updateQuantity} 
                removeItem={removeItem} 
              />
              
              <DeliveryMethodSelector
                deliveryMethod={deliveryMethod}
                deliveryMethods={deliveryMethods}
                onSelectDelivery={handleDeliveryMethodSelect}
              />
            </div>

            <div>
              <OrderSummary
                subtotal={subtotal}
                total={total}
                deliveryMethod={deliveryMethod}
                onSubmit={handleCheckout}
                isSubmitting={isSubmitting}
                hasStockIssues={hasStockIssues}
              />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
