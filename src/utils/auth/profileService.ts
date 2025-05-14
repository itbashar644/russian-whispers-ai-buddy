
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserProfile } from "@/types/auth";

export async function updateUserProfile(
  userData: Partial<UserProfile>,
  currentProfileId: string
): Promise<boolean> {
  try {
    if (!currentProfileId) {
      toast("Ошибка обновления профиля", {
        description: "Пользователь не авторизован",
      });
      return false;
    }
    
    const { error } = await supabase
      .from('profiles')
      .update({
        name: userData.name,
        phone: userData.phone,
        address: userData.address,
        avatar_url: userData.avatar_url,
        preferredcontactmethod: userData.preferredContactMethod,
        savedaddresses: userData.savedAddresses,
        telegramnickname: userData.telegramNickname
      })
      .eq('id', currentProfileId);
    
    if (error) throw error;
    
    toast("Профиль обновлен", {
      description: "Ваши данные успешно сохранены",
    });
    
    return true;
  } catch (error: any) {
    toast("Ошибка обновления профиля", {
      description: error.message || "Не удалось обновить профиль",
    });
    return false;
  }
}

export async function checkUserRole(
  userId: string,
  role: 'admin' | 'editor' | 'user'
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', role);
    
    if (error) throw error;
    
    return data && data.length > 0;
  } catch (error) {
    console.error("Error checking user role:", error);
    return false;
  }
}
