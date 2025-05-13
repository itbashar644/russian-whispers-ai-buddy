
import * as XLSX from 'xlsx';
import { Product } from '@/types/product';
import { addCategory, getAllCategories } from '@/data/products';
import { addOrUpdateProductInSupabase } from '@/data/products/supabaseApi';
import { v4 as uuidv4 } from 'uuid';

// Convert Excel data to products array and save to Supabase
export const excelToProducts = async (data: ArrayBuffer): Promise<Product[]> => {
  try {
    console.log("Starting Excel import process...");
    
    // Read the Excel file
    const workbook = XLSX.read(data, { type: 'array' });
    
    // Get the first worksheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);
    
    console.log("Parsed Excel data:", JSON.stringify(jsonData).substring(0, 500) + "...");
    
    if (!jsonData || jsonData.length === 0) {
      console.error("No data found in Excel file");
      throw new Error("Файл не содержит данных. Проверьте формат файла и наличие информации.");
    }
    
    // Map to Product objects
    const products: Product[] = [];
    
    // Получаем существующие категории для проверки
    const existingCategories = await getAllCategories();
    
    console.log("Existing categories:", existingCategories);
    console.log("Number of rows to process:", jsonData.length);
    
    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      
      // Отладочная информация для каждой строки
      console.log(`Processing row ${i+1}:`, row);
      
      // Validate required fields
      if (!row.title || row.price === undefined || !row.category || !row.description || !row.countryOfOrigin) {
        console.warn(`Skipping row ${i+1} due to missing required fields:`, 
          `title: ${row.title}, price: ${row.price}, category: ${row.category}, ` +
          `description: ${row.description}, countryOfOrigin: ${row.countryOfOrigin}`);
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
          rating: parseFloat(String(row.rating)) || 5,
          inStock: row.inStock === 'Да' || row.inStock === true || row.inStock === 'true',
          countryOfOrigin: String(row.countryOfOrigin || '') || 'Россия'
        };
        
        console.log(`Created base product ${i+1}:`, product.title, product.price, product.category);
        
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
          if (product.category && 
              typeof product.category === 'string' && 
              !existingCategories.includes(product.category)) {
            console.log("Adding new category:", product.category);
            await addCategory(product.category);
          }
          
          console.log("Saving product to Supabase:", product.title);
          const success = await addOrUpdateProductInSupabase(product);
          
          if (success) {
            console.log(`Product saved successfully: ${product.title}`);
            // Add to local array for return value
            products.push(product);
          } else {
            console.error(`Failed to save product: ${product.title}`);
            throw new Error(`Не удалось сохранить товар: ${product.title}`);
          }
        } catch (err) {
          console.error(`Error saving product to Supabase: ${product.title}`, err);
          throw new Error(`Ошибка при сохранении товара ${product.title}: ${err}`);
        }
      } catch (err) {
        console.error(`Error processing row ${i+1}:`, row, err);
      }
    }

    console.log(`Successfully processed ${products.length} products`);
    
    if (products.length === 0) {
      throw new Error("Ни один товар не был успешно импортирован. Проверьте наличие обязательных полей: title, price, category, description, countryOfOrigin.");
    }
    
    return products;
  } catch (err) {
    console.error("Error processing Excel data:", err);
    throw err;
  }
};
