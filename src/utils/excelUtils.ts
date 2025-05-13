
import * as XLSX from 'xlsx';
import { Product } from '@/types/product';
import { addCategory, getAllCategories } from '@/data/products';

// Convert products array to Excel workbook
export const productsToExcel = (products: Product[]): XLSX.WorkBook => {
  // Create a simplified array for export (excluding complex nested properties)
  const exportData = products.map(product => ({
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    discountPrice: product.discountPrice || '',
    category: product.category,
    imageUrl: product.imageUrl,
    rating: product.rating,
    inStock: product.inStock ? 'Да' : 'Нет',
    colors: product.colors ? product.colors.join(', ') : '',
    sizes: product.sizes ? product.sizes.join(', ') : '',
    material: product.material || '',
    isNew: product.isNew ? 'Да' : 'Нет',
    isBestseller: product.isBestseller ? 'Да' : 'Нет',
    countryOfOrigin: product.countryOfOrigin,
    articleNumber: product.articleNumber || '',
    barcode: product.barcode || '',
    wildberriesUrl: product.wildberriesUrl || '',
    ozonUrl: product.ozonUrl || '',
    avitoUrl: product.avitoUrl || '',
  }));

  // Create worksheet from data
  const worksheet = XLSX.utils.json_to_sheet(exportData);
  
  // Generate column widths based on content
  const maxWidth = (data: any[], index: string) => 
    Math.max(10, ...data.map(row => row[index] ? String(row[index]).length : 0));
  
  // Set column widths
  worksheet['!cols'] = [
    { wch: 8 }, // id
    { wch: Math.max(20, maxWidth(exportData, 'title')) }, // title
    { wch: Math.max(30, maxWidth(exportData, 'description')) }, // description
    { wch: 10 }, // price
    { wch: 10 }, // discountPrice
    { wch: Math.max(15, maxWidth(exportData, 'category')) }, // category
    { wch: 20 }, // imageUrl
    { wch: 8 }, // rating
    { wch: 8 }, // inStock
    { wch: 15 }, // colors
    { wch: 15 }, // sizes
    { wch: 15 }, // material
    { wch: 8 }, // isNew
    { wch: 8 }, // isBestseller
    { wch: 15 }, // countryOfOrigin
    { wch: 12 }, // articleNumber
    { wch: 15 }, // barcode
    { wch: 30 }, // wildberriesUrl
    { wch: 30 }, // ozonUrl
    { wch: 30 }, // avitoUrl
  ];
  
  // Create workbook and add the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Товары');
  
  return workbook;
};

// Download Excel file with products data
export const downloadProductsExcel = (products: Product[]) => {
  const workbook = productsToExcel(products);
  
  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
  // Create a Blob from the buffer
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  // Create download link and trigger download
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `товары_${new Date().toLocaleDateString('ru')}.xlsx`;
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Convert Excel data to products array
export const excelToProducts = (data: ArrayBuffer): Product[] => {
  // Read the Excel file
  const workbook = XLSX.read(data, { type: 'array' });
  
  // Get the first worksheet
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Convert to JSON
  const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);
  
  // Map to Product objects
  const products = jsonData.map((row) => {
    // Create a base product object
    const product: Product = {
      id: row.id || `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
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
    if (row.material) product.material = row.material;
    if (row.isNew === 'Да' || row.isNew === true) product.isNew = true;
    if (row.isBestseller === 'Да' || row.isBestseller === true) product.isBestseller = true;
    if (row.articleNumber) product.articleNumber = String(row.articleNumber);
    if (row.barcode) product.barcode = String(row.barcode);
    if (row.wildberriesUrl) product.wildberriesUrl = row.wildberriesUrl;
    if (row.ozonUrl) product.ozonUrl = row.ozonUrl;
    if (row.avitoUrl) product.avitoUrl = row.avitoUrl;

    // Добавляем категорию в общий список категорий, если она новая
    if (row.category && typeof row.category === 'string') {
      addCategory(row.category);
    }
    
    return product;
  });

  return products;
};

// Create template Excel file for importing products
export const getImportTemplate = async (): Promise<XLSX.WorkBook> => {
  // Получаем все доступные категории
  const categories = await getAllCategories();
  const categoriesString = categories.join(', ');

  const templateData = [{
    id: '',
    title: 'Название товара',
    description: 'Описание товара',
    price: 0,
    discountPrice: '',
    category: categories.length > 0 ? categories[0] : 'Другое',
    imageUrl: '/placeholder.svg',
    rating: 5,
    inStock: 'Да',
    colors: 'Черный, Белый',
    sizes: 'S, M, L',
    material: 'Материал',
    isNew: 'Да',
    isBestseller: 'Нет',
    countryOfOrigin: 'Россия',
    articleNumber: '',
    barcode: '',
    wildberriesUrl: '',
    ozonUrl: '',
    avitoUrl: '',
  }];

  // Добавляем примечание по категориям
  const templateData2 = [{
    id: '',
    title: 'ПРИМЕЧАНИЕ: Доступные категории',
    description: categoriesString,
    price: '',
    discountPrice: '',
    category: 'Вы можете использовать существующие категории или добавить новую',
    imageUrl: '',
    rating: '',
    inStock: '',
    colors: '',
    sizes: '',
    material: '',
    isNew: '',
    isBestseller: '',
    countryOfOrigin: '',
    articleNumber: '',
    barcode: '',
    wildberriesUrl: '',
    ozonUrl: '',
    avitoUrl: '',
  }];
  
  // Create worksheet from template data
  const worksheet = XLSX.utils.json_to_sheet(templateData);
  
  // Add notes about categories on row 3
  XLSX.utils.sheet_add_json(worksheet, templateData2, { skipHeader: true, origin: "A3" });
  
  // Add notes about fields
  worksheet['!cols'] = [
    { wch: 10 }, // id
    { wch: 30 }, // title
    { wch: 40 }, // description
    { wch: 10 }, // price
    { wch: 15 }, // discountPrice
    { wch: 15 }, // category
    { wch: 30 }, // imageUrl
    { wch: 8 }, // rating
    { wch: 8 }, // inStock
    { wch: 20 }, // colors
    { wch: 15 }, // sizes
    { wch: 15 }, // material
    { wch: 8 }, // isNew
    { wch: 12 }, // isBestseller
    { wch: 15 }, // countryOfOrigin
    { wch: 15 }, // articleNumber
    { wch: 15 }, // barcode
    { wch: 30 }, // wildberriesUrl
    { wch: 30 }, // ozonUrl
    { wch: 30 }, // avitoUrl
  ];
  
  // Create workbook and add the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Шаблон');
  
  return workbook;
};

// Download template Excel file
export const downloadImportTemplate = async () => {
  const workbook = await getImportTemplate();
  
  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
  // Create a Blob from the buffer
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  // Create download link and trigger download
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `шаблон_импорта_товаров.xlsx`;
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
