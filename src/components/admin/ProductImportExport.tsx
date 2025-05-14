
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Download, Upload, AlertCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Product } from "@/types/product";
import { downloadProductsExcel, excelToProducts, downloadImportTemplate } from "@/utils/excelUtils";
import { Progress } from "@/components/ui/progress";

interface ProductImportExportProps {
  products: Product[];
  onImportComplete: () => void;
}

const ProductImportExport = ({ products, onImportComplete }: ProductImportExportProps) => {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [downloadingTemplate, setDownloadingTemplate] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    try {
      setExporting(true);
      downloadProductsExcel(products);
      toast({
        title: "Экспорт выполнен",
        description: "Файл с товарами успешно экспортирован",
      });
    } catch (error: any) {
      console.error("Ошибка экспорта:", error);
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
      setImportProgress(10);
      
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
          setImportProgress(30);
          
          if (event.target?.result) {
            console.log("File read successful, processing data...");
            const data = event.target.result;
            
            setImportProgress(50);
            
            try {
              const importedProducts = await excelToProducts(data as ArrayBuffer);
              
              setImportProgress(90);
              
              console.log("Import process completed, products count:", importedProducts.length);
              
              if (importedProducts && importedProducts.length > 0) {
                toast({
                  title: "Импорт выполнен",
                  description: `Успешно импортировано ${importedProducts.length} товаров`,
                });
                
                setImportProgress(100);
                
                // Call the callback to refresh products list
                onImportComplete();
              } else {
                setImportError("Не удалось импортировать товары");
                toast({
                  title: "Импорт не удался",
                  description: "Не удалось импортировать товары",
                  variant: "destructive",
                });
              }
            } catch (error: any) {
              console.error("Ошибка в процессе импорта:", error);
              setImportError(error.message || "Произошла ошибка при импорте товаров");
              toast({
                title: "Ошибка импорта",
                description: error.message || "Произошла ошибка при импорте товаров",
                variant: "destructive",
              });
            }
          }
        } finally {
          setImporting(false);
          setImportProgress(0);
          // Clear the input value to allow re-importing the same file
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      };
      
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        setImportError("Ошибка чтения файла. Попробуйте другой файл.");
        setImporting(false);
        setImportProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = '';
      };
      
      reader.readAsArrayBuffer(file);
    } catch (error: any) {
      console.error("Общая ошибка импорта:", error);
      setImportError(error.message || "Произошла ошибка при импорте товаров");
      toast({
        title: "Ошибка импорта",
        description: error.message || "Произошла ошибка при импорте товаров",
        variant: "destructive",
      });
      setImporting(false);
      setImportProgress(0);
      // Clear the input value
      if (fileInputRef.current) fileInputRef.current.value = '';
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
      console.error("Ошибка скачивания шаблона:", error);
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
        <div className="flex-1 p-4 border rounded-md bg-card">
          <h3 className="text-sm font-semibold mb-3">Экспорт товаров</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Выгрузка всех товаров в Excel-файл для редактирования оффлайн
          </p>
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={exporting || products.length === 0}
              className="w-full md:w-auto"
            >
              {exporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Экспортируем...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Экспортировать товары
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={handleDownloadTemplate}
              disabled={downloadingTemplate}
              size="sm"
              className="w-full md:w-auto"
            >
              {downloadingTemplate ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Скачиваем...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Скачать шаблон импорта
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="flex-1 p-4 border rounded-md bg-card">
          <h3 className="text-sm font-semibold mb-3">Импорт товаров</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Загрузка товаров из Excel-файла в формате шаблона
          </p>
          
          <div className="flex flex-col gap-2">
            <Input
              ref={fileInputRef}
              id="import-file"
              type="file"
              accept=".xlsx"
              className="mb-2"
              onChange={handleImport}
              disabled={importing}
            />
            
            <Button
              variant="outline"
              onClick={() => document.getElementById("import-file")?.click()}
              disabled={importing}
              className="w-full"
            >
              {importing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Импортируем...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Выберите файл для импорта
                </>
              )}
            </Button>
          </div>
          
          {importing && (
            <div className="mt-4">
              <Progress value={importProgress} className="h-2" />
              <p className="mt-2 text-xs text-muted-foreground text-center">
                Импортируем товары ({importProgress}%)
              </p>
            </div>
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
