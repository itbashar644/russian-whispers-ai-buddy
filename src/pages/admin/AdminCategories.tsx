
import React from "react";
import CategoryManager from "@/components/admin/CategoryManager";

const AdminCategories = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление категориями</h2>
      </div>

      <CategoryManager />
    </div>
  );
};

export default AdminCategories;
