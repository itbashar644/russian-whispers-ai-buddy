
import * as XLSX from 'xlsx';
import { getAllCategories } from '@/data/products';
import { workbookToBlob, downloadExcelFile } from './excelCore';

// Create template Excel file for importing products
export const getImportTemplate = async (): Promise<XLSX.WorkBook> => {
  // Получаем все доступные категории
  const categories = await getAllCategories();
  const categoriesString = categories.join(', ');

  const templateData = [{
    id: '',
    title: 'Название товара*',
    description: 'Описание товара*',
    price: 1000,
    discountPrice: 900,
    category: categories.length > 0 ? categories[0] : 'Другое',
    imageUrl: '/placeholder.svg',
    rating: 5,
    inStock: 'Да',
    colors: 'Черный, Белый',
    sizes: 'S, M, L',
    isNew: 'Да',
    isBestseller: 'Нет',
    countryOfOrigin: 'Россия*',
    articleNumber: 'ART001',
    barcode: '4607777777777',
    wildberriesUrl: '',
    ozonUrl: '',
    avitoUrl: '',
    stockQuantity: 10,
    material: 'Хлопок',
  }];

  // Добавляем примечание по категориям
  const templateData2 = [{
    id: '',
    title: 'ПРИМЕЧАНИЕ: Поля со звездочкой (*) обязательны для заполнения',
    description: 'Обязательные поля: title (название), description (описание), price (цена), category (категория), countryOfOrigin (страна)',
    price: '',
    discountPrice: '',
    category: `Доступные категории: ${categoriesString}`,
    imageUrl: '',
    rating: '',
    inStock: 'Да или Нет',
    colors: 'Перечислите через запятую',
    sizes: 'Перечислите через запятую',
    isNew: 'Да или Нет',
    isBestseller: 'Да или Нет',
    countryOfOrigin: '',
    articleNumber: '',
    barcode: '',
    wildberriesUrl: '',
    ozonUrl: '',
    avitoUrl: '',
    stockQuantity: '',
    material: '',
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
    { wch: 20 }, // category
    { wch: 30 }, // imageUrl
    { wch: 8 }, // rating
    { wch: 8 }, // inStock
    { wch: 20 }, // colors
    { wch: 15 }, // sizes
    { wch: 8 }, // isNew
    { wch: 12 }, // isBestseller
    { wch: 15 }, // countryOfOrigin
    { wch: 15 }, // articleNumber
    { wch: 15 }, // barcode
    { wch: 30 }, // wildberriesUrl
    { wch: 30 }, // ozonUrl
    { wch: 30 }, // avitoUrl
    { wch: 10 }, // stockQuantity
    { wch: 15 }, // material
  ];
  
  // Create workbook and add the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Шаблон');
  
  return workbook;
};

// Download template Excel file
export const downloadImportTemplate = async () => {
  const workbook = await getImportTemplate();
  const blob = workbookToBlob(workbook);
  downloadExcelFile(blob, `шаблон_импорта_товаров.xlsx`);
};
