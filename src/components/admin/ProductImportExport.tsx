
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Download, FileUp } from "lucide-react";
import { exportProductsToExcel, createProductTemplate } from "@/utils/excelUtils";
import { excelToProducts } from "@/utils/excel/excelImport";
import { fetchProductsFromSupabase } from '@/data/products/supabase/productApi';
import { Progress } from "@/components/ui/progress";

interface ProductImportExportProps {
  onImportComplete: () => void;
}

const ProductImportExport = ({ onImportComplete }: ProductImportExportProps) => {
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  
  const handleExportProductsClick = async () => {
    try {
      setIsExporting(true);
      const products = await fetchProductsFromSupabase(true);
      
      if (!products || products.length === 0) {
        toast.error("Нет товаров для экспорта");
        return;
      }
      
      await exportProductsToExcel(products);
      toast.success("Экспорт успешно завершен");
    } catch (error) {
      console.error("Ошибка экспорта товаров:", error);
      toast.error("Ошибка экспорта товаров");
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleExportTemplateClick = async () => {
    try {
      await createProductTemplate();
      toast.success("Шаблон успешно создан");
    } catch (error) {
      console.error("Ошибка создания шаблона:", error);
      toast.error("Ошибка создания шаблона");
    }
  };
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      setIsImporting(true);
      setImportProgress(10);
      
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          setImportProgress(30);
          const data = e.target?.result as ArrayBuffer;
          
          setImportProgress(50);
          const products = await excelToProducts(data);
          
          setImportProgress(90);
          
          if (products && products.length > 0) {
            toast.success(`Импортировано ${products.length} товаров`);
            if (onImportComplete) {
              onImportComplete();
            }
          }
          
          setImportProgress(100);
          // Reset the input value so the same file can be uploaded again
          event.target.value = '';
          
        } catch (error: any) {
          console.error("Ошибка импорта товаров:", error);
          toast.error(`Ошибка импорта: ${error.message || 'Неизвестная ошибка'}`);
          // Reset the input value
          event.target.value = '';
        } finally {
          setIsImporting(false);
          setImportProgress(0);
        }
      };
      
      reader.readAsArrayBuffer(file);
      
    } catch (error: any) {
      console.error("Ошибка чтения файла:", error);
      toast.error(`Ошибка чтения файла: ${error.message || 'Неизвестная ошибка'}`);
      setIsImporting(false);
      setImportProgress(0);
      // Reset the input value
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-md">
      <h3 className="text-lg font-medium">Импорт и экспорт товаров</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Импорт товаров</h4>
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              onClick={handleExportTemplateClick}
              className="w-full justify-start"
            >
              <Download className="mr-2 h-4 w-4" />
              Скачать шаблон
            </Button>
            
            <div className="relative">
              <input 
                id="import-file" 
                type="file" 
                accept=".xlsx, .xls" 
                onChange={handleFileChange}
                disabled={isImporting}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <Button 
                variant="outline" 
                disabled={isImporting}
                className="w-full justify-start"
              >
                <FileUp className="mr-2 h-4 w-4" />
                {isImporting ? "Импорт..." : "Загрузить Excel файл"}
              </Button>
            </div>
            
            {isImporting && (
              <Progress value={importProgress} className="h-2" />
            )}
            
            <p className="text-xs text-muted-foreground">
              Поддерживаются файлы Excel (.xlsx, .xls)
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Экспорт товаров</h4>
          <Button 
            variant="outline"
            onClick={handleExportProductsClick}
            disabled={isExporting}
            className="w-full justify-start"
          >
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? "Экспорт..." : "Экспорт всех товаров в Excel"}
          </Button>
          <p className="text-xs text-muted-foreground">
            Экспортирует все товары, включая архивные
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductImportExport;
