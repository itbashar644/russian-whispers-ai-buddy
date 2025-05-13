
import * as XLSX from 'xlsx';
import { Product } from '@/types/product';
import { productsToExcel, workbookToBlob, downloadExcelFile } from './excelCore';

// Download Excel file with products data
export const downloadProductsExcel = (products: Product[]) => {
  const workbook = productsToExcel(products);
  const blob = workbookToBlob(workbook);
  downloadExcelFile(blob, `товары_${new Date().toLocaleDateString('ru')}.xlsx`);
};
