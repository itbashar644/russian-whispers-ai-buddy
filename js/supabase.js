
// Supabase client for vanilla JS
import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js@2';

const supabaseUrl = 'https://lpwvhyawvxibtuxfhitx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwd3ZoeWF3dnhpYnR1eGZoaXR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MzIyOTUsImV4cCI6MjA2MjEwODI5NX0.-2aL1s3lUq4Oeos9jWoEd0Fn1g_-_oaQ_QWVEDByaOI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Load categories
export async function loadCategories() {
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
    return data || [];
  } catch (error) {
    console.error('Ошибка при загрузке категорий:', error);
    return [];
  }
}

// Load products
export async function loadProducts(filters = {}) {
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
    return data || [];
  } catch (error) {
    console.error('Ошибка при загрузке товаров:', error);
    return [];
  }
}
