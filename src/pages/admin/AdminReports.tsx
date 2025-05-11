
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const AdminReports = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Отчеты</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Аналитика продаж</CardTitle>
          <CardDescription>
            Анализ продаж по различным параметрам
          </CardDescription>
        </CardHeader>
        <CardContent className="py-10">
          <div className="text-center text-muted-foreground">
            <p>Модуль отчетов находится в разработке</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReports;
