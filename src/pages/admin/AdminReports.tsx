
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Download, Calendar } from "lucide-react";

// Фиктивные данные для отчетов
const salesData = [
  { name: 'Янв', Продажи: 4000, Прибыль: 2400 },
  { name: 'Фев', Продажи: 3000, Прибыль: 1398 },
  { name: 'Мар', Продажи: 2000, Прибыль: 9800 },
  { name: 'Апр', Продажи: 2780, Прибыль: 3908 },
  { name: 'Май', Продажи: 1890, Прибыль: 4800 },
  { name: 'Июн', Продажи: 2390, Прибыль: 3800 },
  { name: 'Июл', Продажи: 3490, Прибыль: 4300 },
];

const categoryData = [
  { name: 'Освещение', value: 8400 },
  { name: 'Декор', value: 12500 },
  { name: 'Текстиль', value: 5600 },
  { name: 'Организация', value: 3200 },
  { name: 'Кухня', value: 7800 },
];

const AdminReports = () => {
  const [reportPeriod, setReportPeriod] = useState("month");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Отчеты</h2>
        <div className="flex space-x-2">
          <Select
            value={reportPeriod}
            onValueChange={setReportPeriod}
          >
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Период" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Неделя</SelectItem>
              <SelectItem value="month">Месяц</SelectItem>
              <SelectItem value="quarter">Квартал</SelectItem>
              <SelectItem value="year">Год</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Экспорт
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Динамика продаж</CardTitle>
            <CardDescription>
              Общая сумма продаж и прибыли за выбранный период
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={salesData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Продажи" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="Прибыль" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Продажи по категориям</CardTitle>
            <CardDescription>
              Распределение продаж по категориям товаров
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" name="Продажи (₽)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Топ продаж</CardTitle>
            <CardDescription>
              Самые популярные товары за период
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: 1, name: "Минималистичная настольная лампа", sales: 48, revenue: 119520 },
                { id: 8, name: "Набор керамических горшков для растений", sales: 35, revenue: 62650 },
                { id: 3, name: "Декоративная ваза в скандинавском стиле", sales: 29, revenue: 49010 },
                { id: 4, name: "Хлопковое постельное белье", sales: 22, revenue: 76780 },
                { id: 6, name: "Настенное зеркало в металлической раме", sales: 18, revenue: 50220 },
              ].map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Продано: {item.sales} шт.
                    </div>
                  </div>
                  <div className="text-right font-medium">
                    {item.revenue.toLocaleString()} ₽
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminReports;
