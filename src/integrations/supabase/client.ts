
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://lpwvhyawvxibtuxfhitx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwd3ZoeWF3dnhpYnR1eGZoaXR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MzIyOTUsImV4cCI6MjA2MjEwODI5NX0.-2aL1s3lUq4Oeos9jWoEd0Fn1g_-_oaQ_QWVEDByaOI";

// Настраиваем клиент с правильными параметрами для аутентификации
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Утилитарная функция для очистки состояния аутентификации
export const cleanupAuthState = () => {
  // Удаляем стандартные токены
  localStorage.removeItem('supabase.auth.token');
  // Удаляем все ключи Supabase из localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
};
