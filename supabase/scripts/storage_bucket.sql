
-- Создаем бакет для хранения изображений продуктов, если он не существует
INSERT INTO storage.buckets (id, name, public)
SELECT 'product-images', 'Product Images', true
WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'product-images'
);

-- Политики безопасности для бакета product-images

-- Политика для просмотра изображений всеми (анонимными и аутентифицированными пользователями)
CREATE POLICY "Public Access Product Images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'product-images');

-- Политика для загрузки изображений аутентифицированными пользователями
CREATE POLICY "Authenticated Users Can Upload Product Images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- Политика для обновления своих изображений аутентифицированными пользователями
CREATE POLICY "Authenticated Users Can Update Own Product Images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images' AND auth.uid() = owner);

-- Политика для удаления своих изображений аутентифицированными пользователями
CREATE POLICY "Authenticated Users Can Delete Own Product Images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'product-images' AND auth.uid() = owner);

-- Политика для администраторов, позволяющая им управлять всеми изображениями
CREATE POLICY "Admins Can Manage All Product Images"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'product-images' AND
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);
