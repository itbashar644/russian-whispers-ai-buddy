
import * as XLSX from 'xlsx';
import { Product } from '@/types/product';
import { productsToExcel, workbookToBlob, downloadExcelFile } from './excelCore';

// Download Excel file with products data
export const downloadProductsExcel = (products: Product[]) => {
  console.log("Starting Excel export process with products:", products.length);
  
  // Create the Excel workbook from products
  const workbook = productsToExcel(products);
  
  // Convert to blob
  const blob = workbookToBlob(workbook);
  
  // Download the file
  const fileName = `товары_${new Date().toLocaleDateString('ru')}.xlsx`;
  downloadExcelFile(blob, fileName);
  
  console.log("Excel export completed");
};
