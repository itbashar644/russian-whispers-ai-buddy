
import * as XLSX from 'xlsx';
import { Product } from '@/types/product';
import { addCategory, getAllCategories } from '@/data/products';
import { addOrUpdateProductInSupabase } from '@/data/products/supabaseApi';

// Convert Excel data to products array and save to Supabase
export const excelToProducts = async (data: ArrayBuffer): Promise<Product[]> => {
  try {
    // Read the Excel file
    const workbook = XLSX.read(data, { type: 'array' });
    
    // Get the first worksheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);
    
    console.log("Imported Excel data:", jsonData);
    
    if (!jsonData || jsonData.length === 0) {
      console.error("No data found in Excel file");
      return [];
    }
    
    // Map to Product objects
    const products: Product[] = [];
    
    for (const row of jsonData) {
      // Skip rows that don't have required fields
      if (!row.title || !row.category) {
        console.warn("Skipping row due to missing required fields:", row);
        continue;
      }
      
      // Create a base product object with a new UUID-like ID if not provided
      const product: Product = {
        id: row.id || `temp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        title: row.title || 'Новый товар',
        description: row.description || 'Описание товара',
        price: Number(row.price) || 0,
        category: row.category || 'Другое',
        imageUrl: row.imageUrl || '/placeholder.svg',
        rating: Number(row.rating) || 5,
        inStock: row.inStock === 'Да' || row.inStock === true,
        countryOfOrigin: row.countryOfOrigin || 'Россия'
      };
      
      // Add optional fields if they exist
      if (row.discountPrice) product.discountPrice = Number(row.discountPrice);
      if (row.colors) product.colors = String(row.colors).split(',').map((c: string) => c.trim()).filter((c: string) => c.length > 0);
      if (row.sizes) product.sizes = String(row.sizes).split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
      if (row.isNew === 'Да' || row.isNew === true) product.isNew = true;
      if (row.isBestseller === 'Да' || row.isBestseller === true) product.isBestseller = true;
      if (row.articleNumber) product.articleNumber = String(row.articleNumber);
      if (row.barcode) product.barcode = String(row.barcode);
      if (row.wildberriesUrl) product.wildberriesUrl = row.wildberriesUrl;
      if (row.ozonUrl) product.ozonUrl = row.ozonUrl;
      if (row.avitoUrl) product.avitoUrl = row.avitoUrl;
      if (row.stockQuantity !== undefined) product.stockQuantity = Number(row.stockQuantity);
      
      // Save to database immediately
      try {
        await addOrUpdateProductInSupabase(product);
        console.log(`Product saved to Supabase: ${product.title}`);
        
        // Add to local array for return value
        products.push(product);
        
        // Добавляем категорию в общий список категорий, если она новая
        if (product.category && typeof product.category === 'string') {
          await addCategory(product.category);
        }
      } catch (err) {
        console.error(`Error saving product to Supabase: ${product.title}`, err);
      }
    }

    console.log(`Successfully processed ${products.length} products`);
    return products;
  } catch (err) {
    console.error("Error processing Excel data:", err);
    return [];
  }
};
