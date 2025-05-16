
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/auth";

/**
 * Create a new user profile
 */
export async function createUserProfile(profileData: {
  id: string;
  name: string;
  email: string;
}) {
  try {
    const { error } = await supabase
      .from("profiles")
      .insert([
        {
          id: profileData.id,
          email: profileData.email,
          name: profileData.name,
        },
      ]);

    if (error) {
      console.error("Error creating user profile:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error creating profile:", error);
    return { success: false, error };
  }
}

/**
 * Update an existing user profile
 */
export async function updateUserProfile(profileData: Partial<UserProfile> & { id: string }) {
  try {
    const { error } = await supabase
      .from("profiles")
      .update({
        name: profileData.name,
        phone: profileData.phone,
        address: profileData.address,
        avatar_url: profileData.avatar_url,
        preferredcontactmethod: profileData.preferredContactMethod,
        savedaddresses: profileData.savedAddresses,
        telegramnickname: profileData.telegramNickname,
      })
      .eq("id", profileData.id);

    if (error) {
      console.error("Error updating user profile:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error updating profile:", error);
    return { success: false, error };
  }
}

// Функция для загрузки профиля пользователя
export const loadUserProfile = async (userId: string) => {
  try {
    // Получаем данные профиля из базы
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Ошибка при загрузке профиля:', profileError);
      return { profile: null, roles: [] };
    }

    // Получаем роли пользователя
    const { data: rolesData, error: rolesError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);

    if (rolesError) {
      console.error('Ошибка при загрузке ролей:', rolesError);
      return { profile: null, roles: [] };
    }

    const roles = rolesData ? rolesData.map(r => r.role) : [];

    // Приводим данные профиля к нужному формату
    const typedProfileData = profileData as {
      id: string;
      email: string | null;
      name: string | null;
      phone: string | null;
      address: string | null;
      avatar_url: string | null;
      preferredcontactmethod: string | null; // Обратите внимание на lowercase в имени колонки БД
      savedaddresses: any | null; // Обратите внимание на lowercase в имени колонки БД
      telegramnickname: string | null; // Новое поле
    };

    // Создаем объект профиля с типизацией
    const fullProfile: UserProfile = {
      id: typedProfileData.id,
      email: typedProfileData.email || '',
      name: typedProfileData.name || '',
      phone: typedProfileData.phone || undefined,
      address: typedProfileData.address || undefined,
      avatar_url: typedProfileData.avatar_url || undefined,
      role: roles.includes('admin') ? 'admin' : roles.includes('editor') ? 'editor' : 'user',
      // Маппим имена колонок из БД в имена свойств в camelCase
      preferredContactMethod: (typedProfileData.preferredcontactmethod as 'phone' | 'telegram' | 'whatsapp') || 'phone',
      savedAddresses: Array.isArray(typedProfileData.savedaddresses) ? typedProfileData.savedaddresses : [],
      telegramNickname: typedProfileData.telegramnickname || undefined,
    };

    return { profile: fullProfile, roles };
  } catch (error) {
    console.error('Ошибка при загрузке профиля:', error);
    return { profile: null, roles: [] };
  }
};
