
import React from "react";
import { CartItem } from "@/types/product";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface OrderItemTableProps {
  items: CartItem[];
}

const OrderItemTable: React.FC<OrderItemTableProps> = ({ items }) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Товар</TableHead>
            <TableHead className="text-center">Количество</TableHead>
            <TableHead className="text-right">Цена</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-16 w-16 flex-shrink-0 rounded overflow-hidden">
                    <img 
                      src={item.product.imageUrl} 
                      alt={item.product.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{item.product.title}</p>
                    {item.color && (
                      <p className="text-xs text-muted-foreground">Цвет: {item.color}</p>
                    )}
                    {item.size && (
                      <p className="text-xs text-muted-foreground">Размер: {item.size}</p>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center">{item.quantity}</TableCell>
              <TableCell className="text-right">
                {(item.product.price * item.quantity).toLocaleString()} ₽
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderItemTable;
