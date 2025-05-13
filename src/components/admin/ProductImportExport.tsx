
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Download, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import * as XLSX from "xlsx";
import { Product } from "@/types/product";
import { downloadProductsExcel, excelToProducts, downloadImportTemplate } from "@/utils/excelUtils";
import { addOrUpdateProduct } from "@/data/products";

interface ProductImportExportProps {
  products: Product[];
  onImportComplete: () => void;
}

const ProductImportExport = ({ products, onImportComplete }: ProductImportExportProps) => {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [downloadingTemplate, setDownloadingTemplate] = useState(false);

  const handleExport = async () => {
    try {
      setExporting(true);
      downloadProductsExcel(products);
      toast({
        title: "Экспорт выполнен",
        description: "Файл с товарами успешно экспортирован",
      });
    } catch (error: any) {
      toast({
        title: "Ошибка экспорта",
        description: error.message || "Произошла ошибка при экспорте товаров",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    try {
      setImporting(true);
      const file = e.target.files[0];
      
      // Read the file
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          if (event.target?.result) {
            const data = event.target.result;
            const importedProducts = await excelToProducts(data as ArrayBuffer);
            
            if (importedProducts.length > 0) {
              toast({
                title: "Импорт выполнен",
                description: `Успешно импортировано ${importedProducts.length} товаров`,
                variant: "success",
              });
              onImportComplete();
            } else {
              toast({
                title: "Импорт отменен",
                description: "Не удалось импортировать товары из файла",
                variant: "destructive",
              });
            }
          }
        } catch (error: any) {
          console.error("Ошибка импорта:", error);
          toast({
            title: "Ошибка импорта",
            description: error.message || "Произошла ошибка при обработке файла",
            variant: "destructive",
          });
        } finally {
          setImporting(false);
          // Clear the input value to allow re-importing the same file
          e.target.value = '';
        }
      };
      
      reader.readAsArrayBuffer(file);
    } catch (error: any) {
      toast({
        title: "Ошибка импорта",
        description: error.message || "Произошла ошибка при импорте товаров",
        variant: "destructive",
      });
      setImporting(false);
      // Clear the input value
      e.target.value = '';
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      setDownloadingTemplate(true);
      await downloadImportTemplate();
      toast({
        title: "Шаблон скачан",
        description: "Шаблон для импорта товаров успешно скачан",
      });
    } catch (error: any) {
      toast({
        title: "Ошибка скачивания",
        description: error.message || "Произошла ошибка при скачивании шаблона",
        variant: "destructive",
      });
    } finally {
      setDownloadingTemplate(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1 p-4 border rounded-md bg-muted/30">
        <h3 className="text-sm font-semibold mb-3">Экспорт товаров</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Выгрузка всех товаров в Excel-файл для редактирования оффлайн
        </p>
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={exporting || products.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            {exporting ? "Экспортируем..." : "Экспортировать товары"}
          </Button>
          <Button
            variant="ghost"
            onClick={handleDownloadTemplate}
            disabled={downloadingTemplate}
            size="sm"
          >
            <Download className="mr-2 h-4 w-4" />
            {downloadingTemplate ? "Скачиваем..." : "Скачать шаблон импорта"}
          </Button>
        </div>
      </div>

      <div className="flex-1 p-4 border rounded-md bg-muted/30">
        <h3 className="text-sm font-semibold mb-3">Импорт товаров</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Загрузка товаров из Excel-файла в формате экспорта
        </p>
        <div className="flex items-center gap-2">
          <Input
            id="import-file"
            type="file"
            accept=".xlsx"
            className="max-w-60"
            onChange={handleImport}
            disabled={importing}
          />
        </div>
        <div className="mt-2">
          <p className="text-xs text-muted-foreground">
            {importing ? "Импортируем..." : ""}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductImportExport;
