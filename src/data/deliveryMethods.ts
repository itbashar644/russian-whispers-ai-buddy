
import { DeliveryMethod } from "../types/product";

export const deliveryMethods: DeliveryMethod[] = [
  {
    id: "standard",
    name: "Обычная доставка",
    description: "Доставка в течение 10-20 дней",
    price: 300,
    estimatedDays: "10-20 дней",
    icon: "truck"
  },
  {
    id: "express",
    name: "Ускоренная доставка",
    description: "Доставка в течение 5-7 дней",
    price: 800,
    estimatedDays: "5-7 дней",
    icon: "package"
  },
  {
    id: "pickup",
    name: "Самовывоз из пункта выдачи",
    description: "Бесплатно при заказе от 2000 ₽",
    price: 0,
    estimatedDays: "10-15 дней",
    icon: "map-pin"
  }
];
