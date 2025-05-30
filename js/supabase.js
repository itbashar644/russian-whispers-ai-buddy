
// Supabase client for vanilla JS
// Используем jsDelivr вместо skypack для большей стабильности
// https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm отдаёт ESM-версию
// библиотеки без необходимости сборки
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = 'https://lpwvhyawvxibtuxfhitx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwd3ZoeWF3dnhpYnR1eGZoaXR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MzIyOTUsImV4cCI6MjA2MjEwODI5NX0.-2aL1s3lUq4Oeos9jWoEd0Fn1g_-_oaQ_QWVEDByaOI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Load categories
export async function loadCategories() {
  const cached = typeof getCache === 'function' ? getCache('categories') : null;
  if (cached) {
    return cached;
  }
  try {
    console.log('Загружаю категории из Supabase...');
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Ошибка загрузки категорий:', error);
      throw error;
    }
    
    console.log('Категории успешно загружены:', data);
    if (typeof setCache === 'function') setCache('categories', data, 60);
    return data || [];
  } catch (error) {
    console.error('Ошибка при загрузке категорий:', error);
    return [];
  }
}

// Load products
export async function loadProducts(filters = {}) {
  const cacheKey = 'products:' + JSON.stringify(filters);
  const cached = typeof getCache === 'function' ? getCache(cacheKey) : null;
  if (cached) {
    return cached;
  }
  try {
    console.log('Загружаю товары из Supabase с фильтрами:', filters);
    
    let query = supabase
      .from('products')
      .select('*')
      .eq('in_stock', true);
    
    // Добавляем фильтр по архивации
    query = query.neq('archived', true);
    
    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    
    if (filters.search) {
      query = query.ilike('title', `%${filters.search}%`);
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Ошибка загрузки товаров:', error);
      throw error;
    }
    
    console.log('Товары успешно загружены:', data);
    if (typeof setCache === 'function') setCache(cacheKey, data, 5);
    return data || [];
  } catch (error) {
    console.error('Ошибка при загрузке товаров:', error);
    try {
      const fallback = await fetch('/products-fallback.json');
      if (fallback.ok) {
        return await fallback.json();
      }
    } catch (fallbackError) {
      console.error('Ошибка при загрузке fallback данных:', fallbackError);
    }
    return [];
  }
}
