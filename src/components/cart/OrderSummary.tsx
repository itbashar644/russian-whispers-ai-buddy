
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DeliveryMethod } from "@/types/product";
import { Checkbox } from "@/components/ui/checkbox";
import ContactMethodSelect from "./ContactMethodSelect";
import TelegramNicknameInput from "./TelegramNicknameInput";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface OrderSummaryProps {
  subtotal: number;
  total: number;
  deliveryMethod: DeliveryMethod | null;
  onSubmit: (formData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    contactMethod: string;
    telegramNickname?: string;
  }) => void;
  isSubmitting: boolean;
  hasStockIssues: boolean;
}

interface SavedCheckoutInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  contactMethod: string;
  telegramNickname?: string;
}

const OrderSummary = ({
  subtotal,
  total,
  deliveryMethod,
  onSubmit,
  isSubmitting,
  hasStockIssues
}: OrderSummaryProps) => {
  const { profile, updateProfile } = useAuth();
  const { toast } = useToast();
  
  const [orderForm, setOrderForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    contactMethod: "phone",
    telegramNickname: "",
  });
  
  const [saveInfo, setSaveInfo] = useState(false);
  const [hasSavedInfo, setHasSavedInfo] = useState(false);
  const [useSavedInfo, setUseSavedInfo] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  // Load saved checkout information from localStorage on initial render
  useEffect(() => {
    const savedInfoString = localStorage.getItem("savedCheckoutInfo");
    
    if (savedInfoString) {
      setHasSavedInfo(true);
    }
    
    // Auto-populate with profile data if available
    if (profile) {
      setOrderForm(prev => ({
        ...prev,
        name: profile.name || prev.name,
        email: profile.email || prev.email,
        phone: profile.phone || prev.phone,
        address: profile.address || prev.address,
        contactMethod: profile.preferredContactMethod || prev.contactMethod,
        telegramNickname: profile.telegramNickname || prev.telegramNickname
      }));
    }
  }, [profile]);

  // Handle loading saved checkout information
  const handleUseSavedInfo = () => {
    const savedInfoString = localStorage.getItem("savedCheckoutInfo");
    
    if (savedInfoString) {
      try {
        const savedInfo: SavedCheckoutInfo = JSON.parse(savedInfoString);
        
        // Fix: Make sure telegramNickname is provided even if it's not in the saved info
        setOrderForm({
          name: savedInfo.name,
          email: savedInfo.email,
          phone: savedInfo.phone,
          address: savedInfo.address,
          contactMethod: savedInfo.contactMethod,
          telegramNickname: savedInfo.telegramNickname || "",
        });
        
        setUseSavedInfo(true);
        toast({
          title: "Информация загружена",
          description: "Сохраненная информация о доставке загружена"
        });
      } catch (error) {
        console.error("Failed to parse saved checkout info", error);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить сохраненную информацию",
          variant: "destructive"
        });
      }
    }
  };

  const handleOrderFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrderForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactMethodChange = (value: string) => {
    setOrderForm((prev) => ({ ...prev, contactMethod: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if terms and privacy policy are agreed
    if (!termsAgreed || !privacyAgreed) {
      toast({
        title: "Ошибка",
        description: "Необходимо согласиться с Условиями использования и Политикой конфиденциальности",
        variant: "destructive"
      });
      return;
    }
    
    // Save checkout information if the user checked the option
    if (saveInfo) {
      try {
        localStorage.setItem("savedCheckoutInfo", JSON.stringify(orderForm));
        toast({
          title: "Информация сохранена",
          description: "Данные о доставке сохранены для будущих заказов"
        });
      } catch (error) {
        console.error("Failed to save checkout info", error);
      }
      
      // If the user is logged in, also update their profile with this information
      if (profile) {
        updateProfile({
          name: orderForm.name,
          phone: orderForm.phone,
          address: orderForm.address,
          preferredContactMethod: orderForm.contactMethod as any,
          telegramNickname: orderForm.telegramNickname
        }).catch(error => {
          console.error("Failed to update profile with checkout info", error);
        });
      }
    }
    
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
          <span>Бесплатно</span>
        </div>
        <div className="border-t my-2"></div>
        <div className="flex justify-between font-medium text-lg">
          <span>Итого:</span>
          <span>{total} ₽</span>
        </div>
      </div>
      
      {hasSavedInfo && !useSavedInfo && (
        <div className="mb-4">
          <Button 
            variant="outline"
            className="w-full"
            onClick={handleUseSavedInfo}
            type="button"
          >
            Использовать сохраненную информацию
          </Button>
        </div>
      )}
      
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

        <div>
          <Label htmlFor="contactMethod">Предпочтительный способ связи</Label>
          <ContactMethodSelect 
            value={orderForm.contactMethod} 
            onValueChange={handleContactMethodChange}
          />
        </div>
        
        {/* Показываем поле для ника в Telegram если выбран этот способ связи */}
        {orderForm.contactMethod === "telegram" && (
          <TelegramNicknameInput
            value={orderForm.telegramNickname}
            onChange={handleOrderFormChange}
            required
          />
        )}
        
        {/* Согласие с условиями использования */}
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="termsAgreement" 
            checked={termsAgreed}
            onCheckedChange={(checked) => setTermsAgreed(checked === true)} 
            className="mt-1"
          />
          <label
            htmlFor="termsAgreement"
            className="text-sm font-medium leading-tight cursor-pointer"
          >
            Я прочитал(а) и согласен(на) с <Link to="/terms" className="text-primary underline" target="_blank">Условиями использования</Link>
          </label>
        </div>
        
        {/* Согласие с политикой конфиденциальности */}
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="privacyAgreement" 
            checked={privacyAgreed}
            onCheckedChange={(checked) => setPrivacyAgreed(checked === true)} 
            className="mt-1"
          />
          <label
            htmlFor="privacyAgreement"
            className="text-sm font-medium leading-tight cursor-pointer"
          >
            Я прочитал(а) и согласен(на) с <Link to="/privacy" className="text-primary underline" target="_blank">Политикой конфиденциальности</Link>
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="saveInfo" 
            checked={saveInfo}
            onCheckedChange={(checked) => setSaveInfo(checked === true)} 
          />
          <label
            htmlFor="saveInfo"
            className="text-sm font-medium leading-none cursor-pointer"
          >
            Сохранить информацию для будущих заказов
          </label>
        </div>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting || hasStockIssues || !termsAgreed || !privacyAgreed}
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
