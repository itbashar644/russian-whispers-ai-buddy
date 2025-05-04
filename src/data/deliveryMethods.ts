
import { DeliveryMethod } from "../types/product";
import { Truck, Package, Home } from "lucide-react";

export const deliveryMethods: DeliveryMethod[] = [
  {
    id: "standard",
    name: "Стандартная доставка",
    description: "Доставка в течение 3-5 рабочих дней",
    price: 300,
    estimatedDays: "3-5 дней",
    icon: "truck"
  },
  {
    id: "express",
    name: "Экспресс-доставка",
    description: "Доставка в течение 1-2 рабочих дней",
    price: 500,
    estimatedDays: "1-2 дня",
    icon: "package"
  },
  {
    id: "pickup",
    name: "Самовывоз",
    description: "Забрать заказ из магазина",
    price: 0,
    estimatedDays: "В тот же день",
    icon: "home"
  }
];
