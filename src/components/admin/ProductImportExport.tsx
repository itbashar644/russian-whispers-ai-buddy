
import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Progress } from '@/components/ui/progress';
import { 
  ArrowDownToLine, 
  ArrowUpFromLine,
  FileSpreadsheet, 
  FileUp, 
  HelpCircle, 
  X 
} from "lucide-react";
import { toast } from "sonner";
import { excelToProducts, downloadProductsExcel, downloadImportTemplate } from "@/utils/excelUtils";
import { Product } from "@/types/product";
import { addOrUpdateProduct } from "@/data/products";

interface ProductImportExportProps {
  products: Product[];
  onImportComplete: () => void;
}

const ProductImportExport: React.FC<ProductImportExportProps> = ({ products, onImportComplete }) => {
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  const [previewData, setPreviewData] = useState<Product[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportProducts = () => {
    try {
      downloadProductsExcel(products);
      toast("Экспорт успешно завершен", {
        description: `Экспортировано ${products.length} товаров.`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast("Ошибка при экспорте", {
        description: "Не удалось экспортировать товары. Попробуйте еще раз.",
      });
    }
  };

  const handleDownloadTemplate = () => {
    try {
      downloadImportTemplate();
      toast("Шаблон загружен", {
        description: "Заполните шаблон данными для импорта.",
      });
    } catch (error) {
      console.error('Template download error:', error);
      toast("Ошибка при загрузке шаблона", {
        description: "Не удалось загрузить шаблон. Попробуйте еще раз.",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        if (!evt.target?.result) return;
        
        const parsedProducts = excelToProducts(evt.target.result as ArrayBuffer);
        setPreviewData(parsedProducts);
        toast("Файл обработан", {
          description: `Найдено ${parsedProducts.length} товаров для импорта.`,
        });
      } catch (error) {
        console.error('Import parse error:', error);
        toast("Ошибка при обработке файла", {
          description: "Формат файла не соответствует ожидаемому шаблону.",
        });
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleImportProducts = () => {
    if (previewData.length === 0) {
      toast("Нет данных для импорта", {
        description: "Пожалуйста, загрузите файл с товарами.",
      });
      return;
    }

    setIsImporting(true);
    let processed = 0;

    // Process products one by one to avoid UI freezing
    const processNextBatch = (startIndex: number, batchSize: number) => {
      const endIndex = Math.min(startIndex + batchSize, previewData.length);
      
      for (let i = startIndex; i < endIndex; i++) {
        addOrUpdateProduct(previewData[i]);
        processed++;
      }

      const progress = Math.round((processed / previewData.length) * 100);
      setImportProgress(progress);

      if (processed < previewData.length) {
        // Process next batch
        setTimeout(() => processNextBatch(endIndex, batchSize), 0);
      } else {
        // All done
        setIsImporting(false);
        toast("Импорт завершен", {
          description: `Импортировано ${processed} товаров.`,
        });
        setPreviewData([]);
        setShowImportDialog(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
        onImportComplete();
      }
    };

    // Start processing in batches of 20
    processNextBatch(0, 20);
  };

  const cancelImport = () => {
    setPreviewData([]);
    setImportProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={handleExportProducts} variant="outline" className="flex gap-2">
        <ArrowDownToLine className="h-4 w-4" />
        Экспортировать товары
      </Button>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="flex gap-2">
            <ArrowUpFromLine className="h-4 w-4" />
            Импортировать товары
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Импорт товаров из файла Excel</AlertDialogTitle>
            <AlertDialogDescription>
              Для импорта товаров необходимо использовать специальный формат Excel-файла.
              Вы можете скачать шаблон и заполнить его своими данными.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col gap-4 my-4">
            <Button onClick={handleDownloadTemplate} variant="outline" className="flex gap-2 w-full">
              <FileSpreadsheet className="h-4 w-4" />
              Скачать шаблон для импорта
            </Button>
            <div className="text-sm text-muted-foreground">
              <p className="flex items-center gap-1">
                <HelpCircle className="h-4 w-4" />
                <span>Заполните шаблон и загрузите его для импорта товаров.</span>
              </p>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={() => setShowImportDialog(true)}>
              Продолжить импорт
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileUp className="h-5 w-5" />
              Загрузка файла с товарами
            </DialogTitle>
            <DialogDescription>
              Выберите Excel-файл с товарами для импорта
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {isImporting ? (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="mb-2">Импорт товаров...</p>
                  <Progress value={importProgress} className="h-2" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Обработано {importProgress}% товаров
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".xlsx, .xls"
                    className="hidden"
                    id="file-upload"
                  />
                  <label 
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center justify-center gap-3"
                  >
                    <FileUp className="h-10 w-10 text-gray-400" />
                    <span className="text-sm text-muted-foreground">
                      Нажмите для выбора файла или перетащите его сюда
                    </span>
                    <Button size="sm" variant="secondary">
                      Выбрать файл
                    </Button>
                  </label>
                </div>
                
                {previewData.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Найдено товаров: {previewData.length}</p>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={cancelImport}
                        className="h-6 w-6"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="max-h-32 overflow-y-auto border rounded-md p-2">
                      <ul className="text-sm space-y-1">
                        {previewData.slice(0, 5).map((product, index) => (
                          <li key={index} className="truncate">
                            {product.title} - {product.price} ₽
                          </li>
                        ))}
                        {previewData.length > 5 && (
                          <li className="text-muted-foreground italic">
                            и еще {previewData.length - 5} товаров...
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="secondary" 
              onClick={() => setShowImportDialog(false)}
              disabled={isImporting}
            >
              Отмена
            </Button>
            <Button 
              onClick={handleImportProducts}
              disabled={isImporting || previewData.length === 0}
            >
              Импортировать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductImportExport;
