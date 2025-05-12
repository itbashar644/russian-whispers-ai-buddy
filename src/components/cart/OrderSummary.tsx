
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DeliveryMethod } from "@/types/product";

interface OrderSummaryProps {
  subtotal: number;
  total: number;
  deliveryMethod: DeliveryMethod | null;
  onSubmit: (formData: {
    name: string;
    email: string;
    phone: string;
    address: string;
  }) => void;
  isSubmitting: boolean;
  hasStockIssues: boolean;
}

const OrderSummary = ({
  subtotal,
  total,
  deliveryMethod,
  onSubmit,
  isSubmitting,
  hasStockIssues
}: OrderSummaryProps) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(orderForm);
  };
  
  return (
    <div className="rounded-lg border p-6 sticky top-20">
      <h2 className="text-xl font-semibold mb-4">Информация о заказе</h2>
      
      <div className="space-y-2 mb-6">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Товары:</span>
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
      
      <form onSubmit={handleSubmit} className="space-y-4">
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
          disabled={isSubmitting || hasStockIssues}
        >
          {isSubmitting ? "Оформление..." : "Оформить заказ"}
        </Button>
        
        {hasStockIssues && (
          <p className="text-sm text-red-500 text-center">
            Некоторые товары недоступны в запрашиваемом количестве
          </p>
        )}
      </form>
    </div>
  );
}

export default OrderSummary;
