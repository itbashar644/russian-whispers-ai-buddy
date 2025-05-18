
import { SpecificationField } from "@/types/product";
import { CategorySpecifications } from "@/types/product";

// Define specifications for each category
export const categorySpecifications: CategorySpecifications = {
  "Планшеты": [
    {
      id: "memory",
      label: "Память",
      type: "text",
      placeholder: "напр. 64 ГБ",
      unit: "ГБ"
    },
    {
      id: "ram",
      label: "Оперативная память",
      type: "text",
      placeholder: "напр. 4 ГБ",
      unit: "ГБ"
    },
    {
      id: "battery",
      label: "Емкость аккумулятора",
      type: "text",
      placeholder: "напр. 7000 мАч",
      unit: "мАч"
    },
    {
      id: "screen",
      label: "Разрешение экрана",
      type: "text",
      placeholder: "напр. 1920x1080"
    },
    {
      id: "cores",
      label: "Количество ядер",
      type: "number",
      placeholder: "напр. 8"
    },
    {
      id: "os",
      label: "Операционная система",
      type: "text",
      placeholder: "напр. Android 13"
    }
  ],
  "Смартфоны": [
    {
      id: "memory",
      label: "Память",
      type: "text",
      placeholder: "напр. 128 ГБ",
      unit: "ГБ"
    },
    {
      id: "ram",
      label: "Оперативная память",
      type: "text",
      placeholder: "напр. 6 ГБ",
      unit: "ГБ"
    },
    {
      id: "screen",
      label: "Диагональ экрана",
      type: "text",
      placeholder: "напр. 6,5 дюйма",
      unit: "дюйм"
    },
    {
      id: "camera",
      label: "Основная камера",
      type: "text",
      placeholder: "напр. 48 Мп",
      unit: "Мп"
    },
    {
      id: "selfie",
      label: "Фронтальная камера",
      type: "text",
      placeholder: "напр. 12 Мп",
      unit: "Мп"
    },
    {
      id: "os",
      label: "Операционная система",
      type: "text",
      placeholder: "напр. Android 14"
    }
  ],
  "Ноутбуки": [
    {
      id: "cpu",
      label: "Процессор",
      type: "text",
      placeholder: "напр. Intel Core i5"
    },
    {
      id: "memory",
      label: "Объем SSD",
      type: "text",
      placeholder: "напр. 512 ГБ",
      unit: "ГБ"
    },
    {
      id: "ram",
      label: "Оперативная память",
      type: "text",
      placeholder: "напр. 16 ГБ",
      unit: "ГБ"
    },
    {
      id: "screen",
      label: "Диагональ экрана",
      type: "text",
      placeholder: "напр. 15,6 дюйма",
      unit: "дюйм"
    },
    {
      id: "gpu",
      label: "Видеокарта",
      type: "text",
      placeholder: "напр. NVIDIA GeForce RTX 3060"
    },
    {
      id: "os",
      label: "Операционная система",
      type: "text",
      placeholder: "напр. Windows 11"
    }
  ]
};

// Helper function to get specifications for a category
export const getSpecificationsForCategory = (category: string): SpecificationField[] => {
  return categorySpecifications[category] || [];
};
