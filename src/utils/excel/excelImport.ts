
import * as XLSX from 'xlsx';
import { Product } from '@/types/product';
import { addCategory, getAllCategories } from '@/data/products';
import { addOrUpdateProductInSupabase } from '@/data/products/supabaseApi';
import { v4 as uuidv4 } from 'uuid';

interface ExcelProductData {
  [key: string]: any;
}

// Convert Excel data to products array and save to Supabase
export const excelToProducts = async (data: ArrayBuffer): Promise<Product[]> => {
  try {
    console.log("Starting Excel import process...");
    
    // Read the Excel file
    const workbook = XLSX.read(data, { type: 'array' });
    
    if (!workbook.SheetNames.length) {
      throw new Error("Файл Excel не содержит листов");
    }
    
    // Get the first worksheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    if (!worksheet) {
      throw new Error("Не удалось прочитать лист из файла Excel");
    }
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json<ExcelProductData>(worksheet);
    
    console.log(`Прочитано ${jsonData.length} строк из Excel файла`, jsonData);
    
    if (!jsonData || jsonData.length === 0) {
      throw new Error("Файл не содержит данных. Проверьте формат файла и наличие информации.");
    }
    
    // Get existing categories
    const existingCategories = await getAllCategories();
    console.log("Existing categories:", existingCategories);
    
    // Required fields for products
    const requiredFields = ['title', 'price', 'category', 'description', 'countryOfOrigin'];
    
    // Process rows and convert to Product objects
    const products: Product[] = [];
    const errors: string[] = [];
    
    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      const rowNum = i + 2; // +2 because Excel is 1-indexed and we have headers
      
      // Check for required fields
      const missingFields = requiredFields.filter(field => 
        row[field] === undefined || row[field] === null || row[field] === '');
      
      if (missingFields.length > 0) {
        errors.push(`Строка ${rowNum}: отсутствуют обязательные поля: ${missingFields.join(', ')}`);
        continue;
      }
      
      try {
        // Validate numeric fields
        if (isNaN(Number(row.price))) {
          errors.push(`Строка ${rowNum}: цена должна быть числом`);
          continue;
        }
        
        // Create product object
        const product: Product = {
          id: uuidv4(),
          title: String(row.title).trim(),
          description: String(row.description || '').trim(),
          price: Number(row.price),
          category: String(row.category).trim(),
          imageUrl: String(row.imageUrl || '').trim() || '/placeholder.svg',
          rating: parseFloat(String(row.rating || 5)),
          inStock: row.inStock === 'Да' || row.inStock === true || row.inStock === 'true',
          countryOfOrigin: String(row.countryOfOrigin).trim()
        };
        
        // Add optional fields
        if (row.discountPrice !== undefined && row.discountPrice !== '' && !isNaN(Number(row.discountPrice))) {
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
        if (row.stockQuantity !== undefined && !isNaN(Number(row.stockQuantity))) {
          product.stockQuantity = Number(row.stockQuantity);
        }
        if (row.material) product.material = String(row.material);
        
        products.push(product);
        
        // Add new category if needed
        if (product.category && !existingCategories.includes(product.category)) {
          console.log(`Adding new category: ${product.category}`);
          await addCategory(product.category);
          existingCategories.push(product.category); // Update our local cache
        }
      } catch (err) {
        console.error(`Error processing row ${rowNum}:`, err);
        errors.push(`Строка ${rowNum}: ошибка обработки данных`);
      }
    }
    
    console.log(`Successfully processed ${products.length} products`);
    
    if (products.length === 0) {
      throw new Error(errors.length > 0 
        ? `Ни один товар не был успешно импортирован. Ошибки: ${errors.join('; ')}`
        : "Ни один товар не был успешно импортирован. Проверьте наличие обязательных полей."
      );
    }
    
    // Save products to database
    console.log("Saving products to database...");
    
    const savedProducts: Product[] = [];
    
    // Save in batches to avoid overloading the database
    const batchSize = 10;
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      
      // Process each product in the batch
      for (const product of batch) {
        try {
          console.log(`Saving product: ${product.title}`);
          const success = await addOrUpdateProductInSupabase(product);
          
          if (success) {
            console.log(`Successfully saved product: ${product.title}`);
            savedProducts.push(product);
          } else {
            console.error(`Failed to save product: ${product.title}`);
          }
        } catch (err) {
          console.error(`Error saving product ${product.title}:`, err);
        }
      }
    }
    
    console.log(`${savedProducts.length} of ${products.length} products saved to database`);
    
    if (savedProducts.length === 0) {
      throw new Error("Не удалось сохранить товары в базу данных");
    }
    
    // Return the saved products
    return savedProducts;
  } catch (err) {
    console.error("Error processing Excel data:", err);
    throw err;
  }
};
