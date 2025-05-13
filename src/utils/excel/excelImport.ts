
import * as XLSX from 'xlsx';
import { Product } from '@/types/product';
import { addCategory, getAllCategories } from '@/data/products';
import { addOrUpdateProductInSupabase } from '@/data/products/supabaseApi';
import { v4 as uuidv4 } from 'uuid';

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
    
    // Получаем существующие категории для проверки
    const existingCategories = await getAllCategories();
    
    // Отладочная информация для понимания проблемы
    console.log("Existing categories:", existingCategories);
    
    for (const row of jsonData) {
      // Отладочная информация для каждой строки
      console.log("Processing row:", row);
      
      // Skip rows that don't have required fields
      if (!row.title || !row.category || row.price === undefined) {
        console.warn("Skipping row due to missing required fields:", row);
        continue;
      }
      
      try {
        // Create a base product object with a valid UUID
        const product: Product = {
          id: uuidv4(), // Always generate a fresh UUID for imports
          title: String(row.title || '') || 'Новый товар',
          description: String(row.description || '') || 'Описание товара',
          price: Number(row.price) || 0,
          category: String(row.category || '') || 'Другое',
          imageUrl: String(row.imageUrl || '') || '/placeholder.svg',
          rating: parseFloat(row.rating) || 5,
          inStock: row.inStock === 'Да' || row.inStock === true || row.inStock === 'true',
          countryOfOrigin: String(row.countryOfOrigin || '') || 'Россия'
        };
        
        console.log("Created product base:", product);
        
        // Add optional fields if they exist
        if (row.discountPrice !== undefined && row.discountPrice !== '') {
          product.discountPrice = Number(row.discountPrice);
        }
        
        if (row.colors) {
          product.colors = String(row.colors).split(',').map((c: string) => c.trim()).filter((c: string) => c.length > 0);
        }
        
        if (row.sizes) {
          product.sizes = String(row.sizes).split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
        }
        
        if (row.isNew === 'Да' || row.isNew === true || row.isNew === 'true') product.isNew = true;
        if (row.isBestseller === 'Да' || row.isBestseller === true || row.isBestseller === 'true') product.isBestseller = true;
        if (row.articleNumber) product.articleNumber = String(row.articleNumber);
        if (row.barcode) product.barcode = String(row.barcode);
        if (row.wildberriesUrl) product.wildberriesUrl = String(row.wildberriesUrl);
        if (row.ozonUrl) product.ozonUrl = String(row.ozonUrl);
        if (row.avitoUrl) product.avitoUrl = String(row.avitoUrl);
        if (row.stockQuantity !== undefined) product.stockQuantity = Number(row.stockQuantity);
        if (row.material) product.material = String(row.material);
        
        // Save to database immediately
        try {
          // Сначала проверяем, нужно ли добавить категорию
          // Добавляем категорию в общий список категорий, если она новая и не пустая
          if (product.category && typeof product.category === 'string' && 
              !existingCategories.includes(product.category)) {
            console.log("Adding new category:", product.category);
            await addCategory(product.category);
          }
          
          console.log("Saving product to Supabase:", product);
          const success = await addOrUpdateProductInSupabase(product);
          
          if (success) {
            console.log(`Product saved to Supabase: ${product.title}`);
            // Add to local array for return value
            products.push(product);
          } else {
            console.error(`Failed to save product to Supabase: ${product.title}`);
          }
        } catch (err) {
          console.error(`Error saving product to Supabase: ${product.title}`, err);
        }
      } catch (err) {
        console.error("Error processing row:", row, err);
      }
    }

    console.log(`Successfully processed ${products.length} products`);
    return products;
  } catch (err) {
    console.error("Error processing Excel data:", err);
    return [];
  }
};
