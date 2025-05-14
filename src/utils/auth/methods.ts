
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export async function signInWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    toast.error("Ошибка входа", {
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
    
    toast.success("Регистрация выполнена", {
      description: "Проверьте почту для подтверждения аккаунта",
    });
    
    return { data, error: null };
  } catch (error: any) {
    toast.error("Ошибка регистрации", {
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
    toast.error("Ошибка выхода", {
      description: error.message,
    });
    return { error };
  }
}

export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;
    
    toast.success("Письмо отправлено", {
      description: "Проверьте почту для сброса пароля",
    });
    
    return { error: null };
  } catch (error: any) {
    toast.error("Ошибка сброса пароля", {
      description: error.message,
    });
    return { error };
  }
}

export async function updatePassword(password: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) throw error;
    
    toast.success("Пароль обновлен", {
      description: "Вы можете использовать новый пароль для входа",
    });
    
    return { error: null };
  } catch (error: any) {
    toast.error("Ошибка обновления пароля", {
      description: error.message,
    });
    return { error };
  }
}
