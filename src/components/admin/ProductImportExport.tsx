
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Download, Upload, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
  const [importError, setImportError] = useState<string | null>(null);

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
      setImportError(null);
      const file = e.target.files[0];
      
      toast({
        title: "Импорт начат",
        description: "Пожалуйста, подождите пока файл обрабатывается...",
      });
      
      console.log("Starting import of file:", file.name);
      
      // Read the file
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          if (event.target?.result) {
            console.log("File read successful, processing data...");
            const data = event.target.result;
            const importedProducts = await excelToProducts(data as ArrayBuffer);
            
            console.log("Import process completed, products count:", importedProducts.length);
            
            if (importedProducts && importedProducts.length > 0) {
              toast({
                title: "Импорт выполнен",
                description: `Успешно импортировано ${importedProducts.length} товаров`,
              });
              onImportComplete();
            } else {
              setImportError("Не удалось импортировать товары из файла. Проверьте формат и наличие обязательных полей: title, price, category, description, countryOfOrigin.");
              toast({
                title: "Импорт отменен",
                description: "Не удалось импортировать товары из файла. Проверьте формат и обязательные поля.",
                variant: "destructive",
              });
            }
          }
        } catch (error: any) {
          console.error("Ошибка импорта:", error);
          setImportError(error.message || "Произошла ошибка при обработке файла");
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
      
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        setImportError("Ошибка чтения файла. Попробуйте другой файл.");
        setImporting(false);
        e.target.value = '';
      };
      
      reader.readAsArrayBuffer(file);
    } catch (error: any) {
      setImportError(error.message || "Произошла ошибка при импорте товаров");
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
    <div className="space-y-4">
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
          {importing && (
            <p className="mt-2 text-xs text-muted-foreground">
              Импортируем товары, пожалуйста, подождите...
            </p>
          )}
        </div>
      </div>
      
      {importError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Ошибка импорта</AlertTitle>
          <AlertDescription>{importError}</AlertDescription>
        </Alert>
      )}
      
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Обязательные поля для импорта</AlertTitle>
        <AlertDescription>
          <p className="text-sm">При импорте товаров обязательны к заполнению следующие поля:</p>
          <ul className="text-sm list-disc pl-5 mt-2">
            <li><strong>title</strong> - название товара</li>
            <li><strong>price</strong> - цена товара (число)</li>
            <li><strong>category</strong> - категория товара</li>
            <li><strong>description</strong> - описание товара</li>
            <li><strong>countryOfOrigin</strong> - страна происхождения</li>
          </ul>
          <p className="text-sm mt-2">Остальные поля являются необязательными.</p>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ProductImportExport;
