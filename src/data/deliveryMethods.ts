
import { DeliveryMethod } from "../types/product";

export const deliveryMethods: DeliveryMethod[] = [
  {
    id: "russianpost",
    name: "Почта РФ",
    description: "Доставка Почтой России",
    price: 0,
    estimatedDays: "10-20 дней",
    icon: "mail"
  },
  {
    id: "cdek",
    name: "СДЭК",
    description: "Доставка курьерской службой СДЭК",
    price: 0,
    estimatedDays: "5-7 дней",
    icon: "truck"
  },
  {
    id: "wb",
    name: "В ПВЗ WB",
    description: "Самовывоз из пункта выдачи Wildberries",
    price: 0,
    estimatedDays: "10-15 дней",
    icon: "map-pin"
  }
];
