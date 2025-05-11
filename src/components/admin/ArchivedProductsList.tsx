
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArchiveRestore, Box } from "lucide-react";
import { Product } from "@/types/product";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ArchivedProductsListProps {
  products: Product[];
  onRestore: (productId: string) => void;
}

const ArchivedProductsList: React.FC<ArchivedProductsListProps> = ({ 
  products, 
  onRestore 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Box className="mr-2 h-5 w-5" />
          <span>Архивированные товары</span>
        </CardTitle>
        <CardDescription>
          Товары, скрытые из каталога ({products.length})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Артикул</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead>Цена (₽)</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    В архиве нет товаров
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.id}</TableCell>
                    <TableCell>{product.articleNumber || "-"}</TableCell>
                    <TableCell>
                      <div className="font-medium">{product.title}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[250px]">
                        {product.description}
                      </div>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      {product.discountPrice ? (
                        <div>
                          <span className="font-medium">{product.discountPrice.toLocaleString()}</span>{" "}
                          <span className="text-muted-foreground line-through text-sm">
                            {product.price.toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        product.price.toLocaleString()
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRestore(product.id)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <ArchiveRestore className="mr-2 h-4 w-4" />
                        Восстановить
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArchivedProductsList;
