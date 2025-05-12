
import React from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import OrderStatus from "./OrderStatus";
import OrderItemTable from "./OrderItemTable";
import OrderTracking from "./OrderTracking";
import { CartItem } from "@/types/product";

interface OrderAccordionItemProps {
  id: string;
  order_number: number;
  date: string;
  status: "new" | "processing" | "shipped" | "delivered" | "cancelled" | "archived";
  items: any[];
  total: number;
  deliveryMethod: string;
  deliveryAddress: string;
  trackingNumber?: string;
  trackingUrl?: string;
}

const OrderAccordionItem: React.FC<OrderAccordionItemProps> = ({
  id,
  order_number,
  date,
  status,
  items,
  total,
  deliveryMethod,
  deliveryAddress,
  trackingNumber,
  trackingUrl,
}) => {
  // Ensure items are properly typed or provide fallback
  const safeItems = Array.isArray(items) ? items : [];
  
  return (
    <AccordionItem key={id} value={id}>
      <AccordionTrigger className="hover:no-underline">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full">
          <div>
            <span className="font-medium">Заказ №{order_number}</span>
            <span className="text-muted-foreground ml-4">{new Date(date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-3 mt-2 sm:mt-0">
            <Badge variant="secondary">
              {total.toLocaleString()} ₽
            </Badge>
            <OrderStatus status={status} />
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4 pt-2">
          <OrderItemTable items={safeItems} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Способ доставки</h4>
              <p className="text-muted-foreground">{deliveryMethod}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Адрес доставки</h4>
              <p className="text-muted-foreground">{deliveryAddress}</p>
            </div>
          </div>
          
          <OrderTracking trackingNumber={trackingNumber} trackingUrl={trackingUrl} />
          
          <div className="flex justify-between items-center pt-2">
            <span className="font-semibold">Итого</span>
            <span className="font-bold text-lg">{total.toLocaleString()} ₽</span>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default OrderAccordionItem;
