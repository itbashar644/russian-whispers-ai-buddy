
import * as XLSX from 'xlsx';
import { workbookToBlob, downloadExcelFile } from './excelCore';

// Create and download a template for product import
export const downloadImportTemplate = async (): Promise<void> => {
  // Create a template with sample data and headers
  const template = [
    {
      title: 'Пример товара', // ОБЯЗАТЕЛЬНОЕ ПОЛЕ
      description: 'Подробное описание товара', // ОБЯЗАТЕЛЬНОЕ ПОЛЕ
      price: 1000, // ОБЯЗАТЕЛЬНОЕ ПОЛЕ (число)
      discountPrice: 800, // необязательное поле (число)
      category: 'Сумки и рюкзаки', // ОБЯЗАТЕЛЬНОЕ ПОЛЕ
      imageUrl: '/placeholder.svg', // необязательное поле (URL изображения)
      rating: 4.8, // необязательное поле (число от 0 до 5)
      inStock: 'Да', // необязательное поле ('Да' или 'Нет')
      colors: 'Красный, Синий, Зеленый', // необязательное поле (через запятую)
      sizes: 'S, M, L, XL', // необязательное поле (через запятую)
      countryOfOrigin: 'Россия', // ОБЯЗАТЕЛЬНОЕ ПОЛЕ
      isNew: 'Да', // необязательное поле ('Да' или 'Нет')
      isBestseller: 'Да', // необязательное поле ('Да' или 'Нет')
      articleNumber: 'AP-12345', // необязательное поле
      barcode: '4607001234567', // необязательное поле
      wildberriesUrl: 'https://www.wildberries.ru/catalog/12345', // необязательное поле
      ozonUrl: 'https://www.ozon.ru/context/detail/id/12345/', // необязательное поле
      avitoUrl: 'https://www.avito.ru/item/12345', // необязательное поле
      stockQuantity: 10, // необязательное поле (число)
      material: 'Натуральная кожа' // необязательное поле
    },
    {
      title: 'Второй пример товара', 
      description: 'Еще одно описание', 
      price: 2500,
      category: 'Аксессуары',
      countryOfOrigin: 'Италия'
    }
  ];

  // Create a new workbook and add the template data
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(template);
  
  // Add comments to cells with instructions
  const requiredHeaders = ['title', 'description', 'price', 'category', 'countryOfOrigin'];
  const headerRow = XLSX.utils.decode_range(worksheet['!ref'] as string).s.r;
  
  // Set column widths
  worksheet['!cols'] = [
    { wch: 25 }, // title
    { wch: 35 }, // description
    { wch: 10 }, // price
    { wch: 15 }, // discountPrice
    { wch: 20 }, // category
    { wch: 30 }, // imageUrl
    { wch: 8 },  // rating
    { wch: 8 },  // inStock
    { wch: 20 }, // colors
    { wch: 15 }, // sizes
    { wch: 15 }, // countryOfOrigin
    { wch: 8 },  // isNew
    { wch: 8 },  // isBestseller
    { wch: 15 }, // articleNumber
    { wch: 15 }, // barcode
    { wch: 30 }, // wildberriesUrl
    { wch: 30 }, // ozonUrl
    { wch: 30 }, // avitoUrl
    { wch: 10 }, // stockQuantity
    { wch: 20 }  // material
  ];

  // Add notes to the worksheet
  const notes = {
    A1: "ОБЯЗАТЕЛЬНОЕ ПОЛЕ: Название товара",
    B1: "ОБЯЗАТЕЛЬНОЕ ПОЛЕ: Описание товара",
    C1: "ОБЯЗАТЕЛЬНОЕ ПОЛЕ: Цена товара (число)",
    D1: "Цена со скидкой (число, необязательно)",
    E1: "ОБЯЗАТЕЛЬНОЕ ПОЛЕ: Категория товара",
    F1: "URL изображения (необязательно)",
    G1: "Рейтинг от 0 до 5 (необязательно)",
    H1: "В наличии, укажите 'Да' или 'Нет' (необязательно)",
    I1: "Цвета через запятую (необязательно)",
    J1: "Размеры через запятую (необязательно)",
    K1: "ОБЯЗАТЕЛЬНОЕ ПОЛЕ: Страна происхождения",
    L1: "Новинка, укажите 'Да' или 'Нет' (необязательно)",
    M1: "Бестселлер, укажите 'Да' или 'Нет' (необязательно)",
    N1: "Артикул (необязательно)",
    O1: "Штрихкод (необязательно)",
    P1: "Ссылка на Wildberries (необязательно)",
    Q1: "Ссылка на Ozon (необязательно)",
    R1: "Ссылка на Avito (необязательно)",
    S1: "Количество на складе (необязательно)",
    T1: "Материал (необязательно)"
  };
  
  if (!worksheet['!comments']) {
    worksheet['!comments'] = {};
  }
  
  for (const [cell, comment] of Object.entries(notes)) {
    worksheet['!comments'][cell] = { t: comment };
  }
  
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Шаблон товаров');
  
  // Create a blob and download the file
  const blob = workbookToBlob(workbook);
  downloadExcelFile(blob, 'шаблон_импорта_товаров.xlsx');
};
