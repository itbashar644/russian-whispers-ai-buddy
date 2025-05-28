
// Supabase client for vanilla JS
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Load categories
export async function loadCategories() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error loading categories:', error);
    return [];
  }
}

// Load products
export async function loadProducts(filters = {}) {
  try {
    let query = supabase
      .from('products')
      .select('*')
      .eq('isActive', true);
    
    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    
    const { data, error } = await query.order('createdAt', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
}
