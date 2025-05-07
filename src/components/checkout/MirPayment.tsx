
import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createMirPaymentForm, MirPaymentForm } from "@/utils/mirPayment";
import { toast } from "sonner";

interface MirPaymentProps {
  amount: number;
  orderId: string;
  description?: string;
  email?: string;
  onSuccess?: (paymentData: { orderId: string; status: string }) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
}

const MirPayment = ({
  amount,
  orderId,
  description = "Оплата заказа",
  email = "",
  onSuccess,
  onError,
  onCancel
}: MirPaymentProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [paymentInitialized, setPaymentInitialized] = useState(false);
  const formContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializePayment = async () => {
      try {
        setIsLoading(true);
        
        if (formContainerRef.current) {
          const success = await createMirPaymentForm(formContainerRef.current, {
            amount,
            orderId,
            description,
            onSuccess: (result) => {
              toast("Успешный платеж", {
                description: `Платеж на сумму ${amount.toLocaleString()} ₽ выполнен успешно`,
              });
              if (onSuccess) onSuccess(result);
            },
            onError: (error) => {
              toast("Ошибка платежа", {
                description: "Произошла ошибка при выполнении платежа. Пожалуйста, попробуйте снова.",
              });
              if (onError) onError(error);
            }
          });
          
          setPaymentInitialized(success);
        }
      } catch (error) {
        console.error("Ошибка при инициализации платежа:", error);
        toast("Ошибка платежа", {
          description: "Не удалось инициализировать платежную форму. Пожалуйста, попробуйте позже.",
        });
        if (onError) onError("Ошибка инициализации");
      } finally {
        setIsLoading(false);
      }
    };

    initializePayment();
    
    // Очистка при размонтировании
    return () => {
      // Здесь можно добавить логику для очистки ресурсов, если необходимо
    };
  }, [amount, orderId, description, onSuccess, onError]);

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Оплата через систему МИР</CardTitle>
        <CardDescription>
          Сумма к оплате: {amount.toLocaleString()} ₽
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Инициализация платежной формы...</p>
          </div>
        ) : !paymentInitialized ? (
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Не удалось загрузить форму</h3>
            <p className="text-sm text-gray-600">Пожалуйста, попробуйте позже или выберите другой способ оплаты.</p>
          </div>
        ) : (
          <div ref={formContainerRef} className="min-h-[200px]"></div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleCancel}>
          Отменить
        </Button>
        <div className="flex items-center text-xs text-muted-foreground">
          <img src="https://via.placeholder.com/60x20?text=МИР" alt="МИР" className="mr-2" />
          Безопасный платеж
        </div>
      </CardFooter>
    </Card>
  );
};

export default MirPayment;
