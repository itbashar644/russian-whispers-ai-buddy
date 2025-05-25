
const { createClient } = require('@supabase/supabase-js');

class SupabaseClient {
  constructor() {
    const supabaseUrl = 'https://lpwvhyawvxibtuxfhitx.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwd3ZoeWF3dnhpYnR1eGZoaXR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MzIyOTUsImV4cCI6MjA2MjEwODI5NX0.-2aL1s3lUq4Oeos9jWoEd0Fn1g_-_oaQ_QWVEDByaOI';
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // Получение всех товаров
  async getProducts() {
    try {
      console.log('Получение товаров из Supabase...');
      
      const { data, error } = await this.supabase
        .from('products')
        .select('*')
        .eq('archived', false);

      if (error) {
        console.error('Ошибка при получении товаров:', error);
        throw error;
      }

      console.log(`✅ Получено ${data.length} товаров`);
      return data;
    } catch (error) {
      console.error('Ошибка подключения к Supabase:', error);
      throw error;
    }
  }

  // Получение категорий товаров
  async getCategories() {
    try {
      const { data, error } = await this.supabase
        .from('categories')
        .select('*');

      if (error) {
        console.error('Ошибка при получении категорий:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Ошибка получения категорий:', error);
      return [];
    }
  }
}

module.exports = SupabaseClient;
