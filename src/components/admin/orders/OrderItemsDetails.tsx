
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
  product?: {
    title?: string;
    imageUrl?: string;
    price?: number;
  };
}

interface OrderItemsDetailsProps {
  items: OrderItem[];
}

const OrderItemsDetails: React.FC<OrderItemsDetailsProps> = ({ items }) => {
  // Если items не определены или пусты, показываем сообщение
  if (!items || !Array.isArray(items) || items.length === 0) {
    return <p className="text-sm text-muted-foreground">Информация о товарах недоступна</p>;
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="p-2 bg-gray-100">
        <h3 className="text-sm font-medium">Товары в заказе</h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Товар</TableHead>
            <TableHead>Цена</TableHead>
            <TableHead className="text-center">Количество</TableHead>
            <TableHead className="text-right">Сумма</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => {
            // Безопасно извлекаем данные, обрабатывая различные форматы
            const productName = item.product?.title || item.productName || 'Товар';
            const productImage = item.product?.imageUrl || '';
            
            // Get price from either direct property or from product object
            const itemPrice = typeof item.price === 'number' && item.price > 0
              ? item.price
              : (item.product?.price && typeof item.product.price === 'number' ? item.product.price : 0);
              
            const itemQuantity = typeof item.quantity === 'number' ? item.quantity : 1;
            
            return (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    {productImage && (
                      <div className="h-10 w-10 rounded overflow-hidden">
                        <img 
                          src={productImage} 
                          alt={productName}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                          }}
                        />
                      </div>
                    )}
                    
                    <div>
                      <div className="font-medium">{productName}</div>
                      <div className="text-xs space-x-2">
                        {item.color && <span>Цвет: {item.color}</span>}
                        {item.size && <span>Размер: {item.size}</span>}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{itemPrice.toLocaleString()} ₽</TableCell>
                <TableCell className="text-center">{itemQuantity}</TableCell>
                <TableCell className="text-right font-medium">
                  {(itemPrice * itemQuantity).toLocaleString()} ₽
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderItemsDetails;
