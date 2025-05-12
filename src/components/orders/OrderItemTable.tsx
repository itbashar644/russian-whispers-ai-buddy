
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface OrderItemTableProps {
  items: any[];
}

const OrderItemTable: React.FC<OrderItemTableProps> = ({ items }) => {
  // Guard against invalid items data
  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div className="border rounded-lg p-4 text-center text-muted-foreground">
        Информация о товарах недоступна
      </div>
    );
  }

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
          {items.map((item, index) => {
            // Handle potential missing data in item structure
            const product = item?.product || {};
            const quantity = item?.quantity || 1;
            const price = product?.price || 0;
            
            return (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-16 w-16 flex-shrink-0 rounded overflow-hidden">
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.title || "Товар"}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                          }}
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs text-gray-500">Нет фото</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{product.title || "Товар"}</p>
                      {item.color && (
                        <p className="text-xs text-muted-foreground">Цвет: {item.color}</p>
                      )}
                      {item.size && (
                        <p className="text-xs text-muted-foreground">Размер: {item.size}</p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">{quantity}</TableCell>
                <TableCell className="text-right">
                  {(price * quantity).toLocaleString()} ₽
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderItemTable;
