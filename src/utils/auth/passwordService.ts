
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export async function resetPassword(email: string): Promise<boolean> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;
    
    toast("Письмо отправлено", {
      description: "Проверьте почту для сброса пароля",
    });
    
    return true;
  } catch (error: any) {
    toast("Ошибка сброса пароля", {
      description: error.message,
    });
    return false;
  }
}

export async function updatePassword(password: string): Promise<boolean> {
  try {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) throw error;
    
    toast("Пароль обновлен", {
      description: "Вы можете использовать новый пароль для входа",
    });
    
    return true;
  } catch (error: any) {
    toast("Ошибка обновления пароля", {
      description: error.message,
    });
    return false;
  }
}

export async function updateEmail(newEmail: string): Promise<boolean> {
  try {
    const { error } = await supabase.auth.updateUser({
      email: newEmail,
    });
    
    if (error) throw error;
    
    toast("Email обновлен", {
      description: "Проверьте новый email для подтверждения",
    });
    
    return true;
  } catch (error: any) {
    toast("Ошибка обновления email", {
      description: error.message,
    });
    return false;
  }
}
