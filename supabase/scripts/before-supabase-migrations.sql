
-- Скрипт для инициализации категорий и продуктов при первом развертывании

-- Убедимся, что таблицы созданы
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  image_url TEXT NOT NULL DEFAULT '/placeholder.svg',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  discount_price NUMERIC,
  category TEXT NOT NULL REFERENCES categories(name) ON UPDATE CASCADE,
  image_url TEXT NOT NULL DEFAULT '/placeholder.svg',
  additional_images JSONB,
  rating NUMERIC NOT NULL DEFAULT 4.8,
  in_stock BOOLEAN NOT NULL DEFAULT TRUE,
  colors JSONB,
  sizes JSONB,
  material TEXT,
  country_of_origin TEXT NOT NULL,
  specifications JSONB,
  is_new BOOLEAN DEFAULT FALSE,
  is_bestseller BOOLEAN DEFAULT FALSE,
  article_number TEXT,
  barcode TEXT,
  ozon_url TEXT,
  wildberries_url TEXT,
  avito_url TEXT,
  archived BOOLEAN DEFAULT FALSE,
  stock_quantity INTEGER,
  color_variants JSONB,
  video_url TEXT,
  video_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Триггер для обновления updated_at
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_categories_timestamp ON categories;
CREATE TRIGGER update_categories_timestamp
BEFORE UPDATE ON categories
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS update_products_timestamp ON products;
CREATE TRIGGER update_products_timestamp
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Добавляем дефолтные категории, если таблица пуста
INSERT INTO public.categories (name, image_url)
SELECT * FROM (
  SELECT 'Сумки и рюкзаки' as name, '/placeholder.svg' as image_url
  UNION SELECT 'Аксессуары', '/placeholder.svg'
  UNION SELECT 'Украшения', '/placeholder.svg'
  UNION SELECT 'Одежда', '/placeholder.svg'
  UNION SELECT 'Обувь', '/placeholder.svg'
  UNION SELECT 'Для дома', '/placeholder.svg'
) t
WHERE NOT EXISTS (SELECT 1 FROM public.categories LIMIT 1);

-- Добавляем демо-продукты, если таблица пуста
INSERT INTO public.products (title, description, price, discount_price, category, image_url, rating, in_stock, country_of_origin, is_bestseller, stock_quantity)
SELECT * FROM (
  SELECT 
    'Кожаная сумка через плечо' as title, 
    'Стильная кожаная сумка через плечо ручной работы из натуральной кожи.' as description,
    5990 as price,
    NULL as discount_price,
    'Сумки и рюкзаки' as category,
    '/placeholder.svg' as image_url,
    4.8 as rating,
    TRUE as in_stock,
    'Россия' as country_of_origin,
    TRUE as is_bestseller,
    15 as stock_quantity
  
  UNION SELECT 
    'Керамическая ваза ручной работы',
    'Уникальная керамическая ваза ручной работы с авторским дизайном.',
    3500,
    2990,
    'Для дома',
    '/placeholder.svg',
    4.9,
    TRUE,
    'Россия',
    FALSE,
    8
  
  UNION SELECT 
    'Серебряное кольцо с малахитом',
    'Элегантное серебряное кольцо с натуральным малахитом российского производства.',
    4500,
    NULL,
    'Украшения',
    '/placeholder.svg',
    4.7,
    TRUE,
    'Россия',
    TRUE,
    20
) t
WHERE NOT EXISTS (SELECT 1 FROM public.products LIMIT 1);

-- Включаем Row Level Security для таблиц
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Создаем политики доступа для категорий
DROP POLICY IF EXISTS "Все могут просматривать категории" ON public.categories;
CREATE POLICY "Все могут просматривать категории" 
  ON public.categories 
  FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Только администраторы могут изменять категории" ON public.categories;
CREATE POLICY "Только администраторы могут изменять категории" 
  ON public.categories 
  FOR ALL 
  USING (
    auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin')
  );

-- Создаем политики доступа для продуктов
DROP POLICY IF EXISTS "Все могут просматривать неархивированные товары" ON public.products;
CREATE POLICY "Все могут просматривать неархивированные товары" 
  ON public.products 
  FOR SELECT 
  USING (NOT archived);

DROP POLICY IF EXISTS "Администраторы могут видеть все товары" ON public.products;
CREATE POLICY "Администраторы могут видеть все товары" 
  ON public.products 
  FOR SELECT 
  USING (
    auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin')
  );

DROP POLICY IF EXISTS "Только администраторы могут изменять товары" ON public.products;
CREATE POLICY "Только администраторы могут изменять товары" 
  ON public.products 
  FOR ALL 
  USING (
    auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin')
  );
