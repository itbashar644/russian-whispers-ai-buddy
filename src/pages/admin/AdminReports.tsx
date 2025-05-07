
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
import { DateRange } from "@/components/ui/date-range";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Download, Calendar, TrendingUp, Database } from "lucide-react";
import { format, subDays, subMonths } from "date-fns";
import { ru } from "date-fns/locale";

// Расширенные фиктивные данные для отчетов
const salesData = [
  { name: 'Янв', Продажи: 4000, Прибыль: 2400, Посещения: 2400, Конверсия: 2.4 },
  { name: 'Фев', Продажи: 3000, Прибыль: 1398, Посещения: 2210, Конверсия: 2.2 },
  { name: 'Мар', Продажи: 2000, Прибыль: 9800, Посещения: 2290, Конверсия: 3.2 },
  { name: 'Апр', Продажи: 2780, Прибыль: 3908, Посещения: 2000, Конверсия: 2.8 },
  { name: 'Май', Продажи: 1890, Прибыль: 4800, Посещения: 2181, Конверсия: 2.5 },
  { name: 'Июн', Продажи: 2390, Прибыль: 3800, Посещения: 2500, Конверсия: 3.0 },
  { name: 'Июл', Продажи: 3490, Прибыль: 4300, Посещения: 2100, Конверсия: 4.3 },
  { name: 'Авг', Продажи: 4000, Прибыль: 5000, Посещения: 2400, Конверсия: 5.0 },
  { name: 'Сен', Продажи: 3500, Прибыль: 4500, Посещения: 2700, Конверсия: 4.0 },
  { name: 'Окт', Продажи: 4500, Прибыль: 6000, Посещения: 3000, Конверсия: 4.5 },
  { name: 'Ноя', Продажи: 5000, Прибыль: 7000, Посещения: 3300, Конверсия: 5.0 },
  { name: 'Дек', Продажи: 6000, Прибыль: 8000, Посещения: 3500, Конверсия: 5.5 },
];

const categoryData = [
  { name: 'Освещение', value: 8400, percent: 24 },
  { name: 'Декор', value: 12500, percent: 36 },
  { name: 'Текстиль', value: 5600, percent: 16 },
  { name: 'Организация', value: 3200, percent: 9 },
  { name: 'Кухня', value: 5300, percent: 15 },
];

const paymentMethodData = [
  { name: 'Банковская карта', value: 65 },
  { name: 'Система Мир', value: 20 },
  { name: 'Наличными при получении', value: 10 },
  { name: 'Другие способы', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const dailyData = Array.from({ length: 30 }, (_, i) => ({
  date: format(subDays(new Date(), i), 'dd.MM'),
  Продажи: Math.floor(Math.random() * 3000) + 1000,
  Прибыль: Math.floor(Math.random() * 2000) + 500,
  Посещения: Math.floor(Math.random() * 200) + 100,
  Конверсия: ((Math.random() * 5) + 1).toFixed(2),
})).reverse();

const AdminReports = () => {
  const [reportPeriod, setReportPeriod] = useState("month");
  const [activeTab, setActiveTab] = useState("sales");
  const [dateRange, setDateRange] = useState({
    from: subMonths(new Date(), 1),
    to: new Date(),
  });

  const generateReportLink = () => {
    // В реальном приложении здесь был бы код для генерации отчета
    alert("Отчет будет скачан в формате Excel после реализации этой функции");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold">Аналитика и отчеты</h2>
        <div className="flex flex-wrap gap-2">
          <DateRange
            from={dateRange.from}
            to={dateRange.to}
            onSelect={setDateRange}
          />
          <Select
            value={reportPeriod}
            onValueChange={setReportPeriod}
          >
            <SelectTrigger className="w-[150px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Период" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">День</SelectItem>
              <SelectItem value="week">Неделя</SelectItem>
              <SelectItem value="month">Месяц</SelectItem>
              <SelectItem value="quarter">Квартал</SelectItem>
              <SelectItem value="year">Год</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={generateReportLink}>
            <Download className="h-4 w-4 mr-2" />
            Экспорт
          </Button>
        </div>
      </div>

      <Tabs defaultValue="sales" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="sales">Продажи</TabsTrigger>
          <TabsTrigger value="categories">Категории</TabsTrigger>
          <TabsTrigger value="customers">Клиенты</TabsTrigger>
          <TabsTrigger value="payments">Платежи</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-6">
          {/* Динамика продаж */}
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Динамика продаж и прибыли</CardTitle>
              <CardDescription>
                Сравнение продаж и прибыли за выбранный период
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={reportPeriod === "day" ? dailyData : salesData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={reportPeriod === "day" ? "date" : "name"} />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value.toLocaleString()} ₽`} />
                    <Legend />
                    <Line type="monotone" dataKey="Продажи" stroke="#8884d8" activeDot={{ r: 8 }} strokeWidth={2} />
                    <Line type="monotone" dataKey="Прибыль" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Посещаемость и конверсия */}
            <Card>
              <CardHeader>
                <CardTitle>Посещаемость и конверсия</CardTitle>
                <CardDescription>
                  Соотношение посещений сайта и конверсии в продажи
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={reportPeriod === "day" ? dailyData : salesData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey={reportPeriod === "day" ? "date" : "name"} />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="Посещения" stroke="#ff7300" activeDot={{ r: 5 }} />
                      <Line yAxisId="right" type="monotone" dataKey="Конверсия" stroke="#0088fe" activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Топ продаж */}
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
                    { id: 1, name: "Минималистичная настольная лампа", sales: 48, revenue: 119520, growth: 12.3 },
                    { id: 8, name: "Набор керамических горшков для растений", sales: 35, revenue: 62650, growth: 8.7 },
                    { id: 3, name: "Декоративная ваза в скандинавском стиле", sales: 29, revenue: 49010, growth: -3.2 },
                    { id: 4, name: "Хлопковое постельное белье", sales: 22, revenue: 76780, growth: 5.1 },
                    { id: 6, name: "Настенное зеркало в металлической раме", sales: 18, revenue: 50220, growth: 0.9 },
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
                      <div className="text-right">
                        <div className="font-medium">{item.revenue.toLocaleString()} ₽</div>
                        <div className={`text-sm ${item.growth > 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                          {item.growth > 0 ? '↑' : '↓'} {Math.abs(item.growth)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Продажи по категориям (круговая диаграмма) */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Распределение продаж по категориям</CardTitle>
                <CardDescription>
                  Доля продаж каждой категории товаров
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value.toLocaleString()} ₽`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Продажи по категориям (гистограмма) */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Объем продаж по категориям</CardTitle>
                <CardDescription>
                  Сумма продаж по каждой категории
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={categoryData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => `${value.toLocaleString()} ₽`} />
                      <Bar dataKey="value" name="Продажи (₽)" fill="#8884d8">
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Подробная информация по категориям</CardTitle>
              <CardDescription>
                Статистика и тренды по категориям товаров
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left font-medium py-3 px-4">Категория</th>
                      <th className="text-right font-medium py-3 px-4">Продажи (₽)</th>
                      <th className="text-right font-medium py-3 px-4">Кол-во товаров</th>
                      <th className="text-right font-medium py-3 px-4">Ср. цена</th>
                      <th className="text-right font-medium py-3 px-4">Динамика</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryData.map((category, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 px-4">{category.name}</td>
                        <td className="text-right py-3 px-4">{category.value.toLocaleString()} ₽</td>
                        <td className="text-right py-3 px-4">{Math.floor(Math.random() * 80) + 20}</td>
                        <td className="text-right py-3 px-4">{Math.floor(Math.random() * 5000) + 1000} ₽</td>
                        <td className="text-right py-3 px-4 flex items-center justify-end">
                          {Math.random() > 0.5 ? (
                            <span className="text-green-600 flex items-center">↑ {(Math.random() * 15).toFixed(1)}%</span>
                          ) : (
                            <span className="text-red-600 flex items-center">↓ {(Math.random() * 10).toFixed(1)}%</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Новые клиенты */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Динамика новых клиентов</CardTitle>
                  <CardDescription>
                    Количество новых регистраций по периодам
                  </CardDescription>
                </div>
                <TrendingUp className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={salesData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="Посещения" fill="#8884d8" name="Новые клиенты" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* География клиентов */}
            <Card>
              <CardHeader>
                <CardTitle>География клиентов</CardTitle>
                <CardDescription>
                  Распределение клиентов по регионам
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72 space-y-4">
                  {[
                    { region: "Москва и МО", percentage: 35, count: 1250 },
                    { region: "Санкт-Петербург и ЛО", percentage: 22, count: 780 },
                    { region: "Краснодарский край", percentage: 15, count: 520 },
                    { region: "Свердловская область", percentage: 10, count: 350 },
                    { region: "Новосибирская область", percentage: 8, count: 280 },
                    { region: "Другие регионы", percentage: 10, count: 360 },
                  ].map((region, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{region.region}</span>
                        <span className="font-medium">{region.count} клиентов</span>
                      </div>
                      <div className="overflow-hidden bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-blue-600"
                          style={{ width: `${region.percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-right text-muted-foreground">{region.percentage}%</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Лояльность клиентов */}
          <Card>
            <CardHeader>
              <CardTitle>Лояльность клиентов</CardTitle>
              <CardDescription>
                Распределение клиентов по частоте и сумме покупок
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Новые (1 заказ)", value: 40 },
                        { name: "Повторные (2-3 заказа)", value: 30 },
                        { name: "Постоянные (4-7 заказов)", value: 20 },
                        { name: "Лояльные (8+ заказов)", value: 10 },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {[...Array(4)].map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Способы оплаты */}
            <Card>
              <CardHeader>
                <CardTitle>Способы оплаты</CardTitle>
                <CardDescription>
                  Распределение платежей по способам оплаты
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentMethodData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {paymentMethodData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Статистика по платежам */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Статистика платежей</CardTitle>
                  <CardDescription>
                    Основные показатели по платежам
                  </CardDescription>
                </div>
                <Database className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Средний чек", value: "4,250 ₽" },
                    { label: "Успешных платежей", value: "96.5%" },
                    { label: "Отказов оплаты", value: "3.5%" },
                    { label: "Возвратов", value: "2.1%" }
                  ].map((stat, i) => (
                    <div key={i} className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500">{stat.label}</div>
                      <div className="text-2xl font-medium mt-1">{stat.value}</div>
                    </div>
                  ))}
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Платежи по системе Мир</h4>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                      <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                    <span className="text-sm font-medium">20%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Доля платежей через систему Мир от общего объема
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Динамика платежей */}
          <Card>
            <CardHeader>
              <CardTitle>Динамика платежей</CardTitle>
              <CardDescription>
                Изменение объемов платежей по разным способам оплаты
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { month: 'Янв', Карта: 4000, Мир: 1000, Наличные: 500 },
                      { month: 'Фев', Карта: 3800, Мир: 1100, Наличные: 450 },
                      { month: 'Мар', Карта: 3900, Мир: 1200, Наличные: 430 },
                      { month: 'Апр', Карта: 3700, Мир: 1400, Наличные: 410 },
                      { month: 'Май', Карта: 3600, Мир: 1600, Наличные: 400 },
                      { month: 'Июн', Карта: 3400, Мир: 1900, Наличные: 380 },
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value.toLocaleString()} ₽`} />
                    <Legend />
                    <Line type="monotone" dataKey="Карта" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="Мир" stroke="#82ca9d" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="Наличные" stroke="#ffc658" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminReports;
