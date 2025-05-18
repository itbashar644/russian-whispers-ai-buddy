
import { CategorySpecifications } from '@/types/product';

// Определение характеристик для каждой категории
export const categorySpecifications: CategorySpecifications = {
  'Планшеты': [
    { 
      id: 'memory', 
      label: 'Память', 
      type: 'number', 
      unit: 'ГБ' 
    },
    { 
      id: 'ram', 
      label: 'Оперативная память', 
      type: 'number', 
      unit: 'ГБ' 
    },
    { 
      id: 'batteryCapacity', 
      label: 'Емкость аккумулятора', 
      type: 'number', 
      unit: 'мА·ч' 
    },
    { 
      id: 'screenResolution', 
      label: 'Разрешение экрана', 
      type: 'text', 
      placeholder: '1920x1080' 
    },
    { 
      id: 'cpuCores', 
      label: 'Количество ядер', 
      type: 'number'
    },
    { 
      id: 'os', 
      label: 'Операционная система', 
      type: 'text' 
    }
  ],
  'Смартфоны': [
    { 
      id: 'memory', 
      label: 'Память', 
      type: 'number', 
      unit: 'ГБ' 
    },
    { 
      id: 'ram', 
      label: 'Оперативная память', 
      type: 'number', 
      unit: 'ГБ' 
    },
    { 
      id: 'batteryCapacity', 
      label: 'Емкость аккумулятора', 
      type: 'number', 
      unit: 'мА·ч' 
    },
    { 
      id: 'screen', 
      label: 'Диагональ экрана', 
      type: 'number', 
      unit: '"' 
    },
    { 
      id: 'camera', 
      label: 'Камера', 
      type: 'text' 
    }
  ],
  'Для дома': [
    { 
      id: 'material', 
      label: 'Материал', 
      type: 'text' 
    },
    { 
      id: 'dimensions', 
      label: 'Размеры', 
      type: 'text' 
    },
    { 
      id: 'weight', 
      label: 'Вес', 
      type: 'number', 
      unit: 'г' 
    }
  ],
  'Сумки и рюкзаки': [
    { 
      id: 'material', 
      label: 'Материал', 
      type: 'text' 
    },
    { 
      id: 'size', 
      label: 'Размеры', 
      type: 'text', 
      placeholder: 'ШхВхГ, см' 
    },
    { 
      id: 'capacity', 
      label: 'Объем', 
      type: 'number', 
      unit: 'л' 
    },
    { 
      id: 'weight', 
      label: 'Вес', 
      type: 'number', 
      unit: 'г' 
    }
  ],
  'Украшения': [
    { 
      id: 'material', 
      label: 'Материал', 
      type: 'text' 
    },
    { 
      id: 'gemstone', 
      label: 'Камень/вставка', 
      type: 'text' 
    },
    { 
      id: 'weight', 
      label: 'Вес', 
      type: 'number', 
      unit: 'г' 
    }
  ],
  'Аксессуары': [
    { 
      id: 'material', 
      label: 'Материал', 
      type: 'text' 
    },
    { 
      id: 'dimensions', 
      label: 'Размеры', 
      type: 'text' 
    }
  ],
  'Одежда': [
    { 
      id: 'material', 
      label: 'Материал', 
      type: 'text' 
    },
    { 
      id: 'care', 
      label: 'Уход', 
      type: 'text' 
    }
  ],
  'Обувь': [
    { 
      id: 'material', 
      label: 'Материал верха', 
      type: 'text' 
    },
    { 
      id: 'soleMaterial', 
      label: 'Материал подошвы', 
      type: 'text' 
    },
    { 
      id: 'season', 
      label: 'Сезон', 
      type: 'text' 
    }
  ]
};

// Функция для получения спецификаций для категории
export const getSpecificationsForCategory = (category: string) => {
  return categorySpecifications[category] || [];
};

// Функция для форматирования значения спецификации с единицей измерения
export const formatSpecificationValue = (value: string, unit?: string) => {
  if (!value) return '';
  return unit ? `${value} ${unit}` : value;
};
