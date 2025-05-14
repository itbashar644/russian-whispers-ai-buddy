
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserProfile } from "@/types/auth";

// Basic authentication methods
export async function signInWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    toast("Ошибка входа", {
      description: error.message,
    });
    return { data: null, error };
  }
}

export async function signUpWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    
    toast("Регистрация выполнена", {
      description: "Проверьте почту для подтверждения аккаунта",
    });
    
    return { data, error: null };
  } catch (error: any) {
    toast("Ошибка регистрации", {
      description: error.message,
    });
    return { data: null, error };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    toast("Ошибка выхода", {
      description: error.message,
    });
    return { error };
  }
}

export async function getSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error("Ошибка получения сессии:", error);
    return { data: null, error };
  }
}
