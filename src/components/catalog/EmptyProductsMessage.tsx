
import React from "react";

const EmptyProductsMessage: React.FC = () => {
  return (
    <div className="py-8 text-center">
      <h2 className="text-xl font-semibold mb-2">Товары не найдены</h2>
      <p className="text-muted-foreground">
        Попробуйте изменить параметры фильтрации или поисковый запрос
      </p>
    </div>
  );
};

export default EmptyProductsMessage;
