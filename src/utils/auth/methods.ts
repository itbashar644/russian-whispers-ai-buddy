
import { toast } from "sonner";
import { supabase, cleanupAuthState } from "@/integrations/supabase/client";
import { User } from '@supabase/supabase-js';
import { UserProfile } from "@/types/auth";

// Функция для входа пользователя
const login = async (email: string, password: string): Promise<boolean> => {
  try {
    // Очистка предыдущего состояния авторизации
    cleanupAuthState();
    
    // Попытка глобального выхода
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (err) {
      // Продолжаем даже при ошибке
    }
    
    // Вход по email/паролю
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      toast("Ошибка входа", {
        description: error.message || "Неверный email или пароль",
      });
      return false;
    }
    
    toast("Успешный вход", {
      description: "Вы успешно вошли в систему",
    });
    
    return true;
  } catch (error: any) {
    console.error("Ошибка при входе:", error);
    toast("Ошибка входа", {
      description: error.message || "Произошла ошибка при входе в систему",
    });
    return false;
  }
};

// Функция для регистрации пользователя
const register = async (email: string, password: string, name: string): Promise<boolean> => {
  try {
    // Очистка предыдущего состояния авторизации
    cleanupAuthState();
    
    // Регистрация нового пользователя
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name
        }
      }
    });
    
    if (error) {
      toast("Ошибка регистрации", {
        description: error.message || "Не удалось создать аккаунт",
      });
      return false;
    }

    toast("Успешная регистрация", {
      description: "Аккаунт успешно создан",
    });
    
    return true;
  } catch (error: any) {
    console.error("Ошибка при регистрации:", error);
    toast("Ошибка регистрации", {
      description: error.message || "Произошла ошибка при создании аккаунта",
    });
    return false;
  }
};

// Функция для выхода из системы
const logout = async () => {
  try {
    // Очистка состояния авторизации
    cleanupAuthState();
    
    // Попытка глобального выхода
    await supabase.auth.signOut({ scope: 'global' });
    
    toast("Выход из системы", {
      description: "Вы успешно вышли из системы",
    });
    
    // Принудительное обновление страницы для очистки состояния
    window.location.href = '/';
  } catch (error: any) {
    console.error("Ошибка при выходе:", error);
    toast("Ошибка", {
      description: error.message || "Произошла ошибка при выходе из системы",
    });
  }
};

// Функция обновления профиля
const updateProfile = async (
  userData: Partial<UserProfile>,
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>,
  profile: UserProfile | null
): Promise<boolean> => {
  if (!profile) return false;
  
  try {
    // Преобразуем camelCase в snake_case для БД
    const dbData: any = {
      ...userData
    };
    
    // Специальное преобразование для полей, которые имеют разные имена в БД
    if (userData.preferredContactMethod) {
      dbData.preferredcontactmethod = userData.preferredContactMethod;
      delete dbData.preferredContactMethod;
    }
    
    if (userData.savedAddresses) {
      dbData.savedaddresses = userData.savedAddresses;
      delete dbData.savedAddresses;
    }
    
    if (userData.telegramNickname) {
      dbData.telegramnickname = userData.telegramNickname;
      delete dbData.telegramNickname;
    }
    
    const { error } = await supabase
      .from('profiles')
      .update(dbData)
      .eq('id', profile.id);
    
    if (error) {
      toast("Ошибка", {
        description: error.message || "Не удалось обновить профиль",
      });
      return false;
    }
    
    // Обновляем локальное состояние
    setProfile({ ...profile, ...userData });
    
    toast("Профиль обновлен", {
      description: "Данные профиля успешно обновлены",
    });
    
    return true;
  } catch (error: any) {
    console.error("Ошибка при обновлении профиля:", error);
    toast("Ошибка", {
      description: error.message || "Произошла ошибка при обновлении профиля",
    });
    return false;
  }
};

// Функция для сброса пароля
const resetPassword = async (email: string): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) {
      toast("Ошибка", {
        description: error.message || "Не удалось отправить инструкции",
      });
      return false;
    }
    
    toast("Инструкции отправлены", {
      description: "Проверьте вашу электронную почту для сброса пароля",
    });
    
    return true;
  } catch (error: any) {
    console.error("Ошибка при сбросе пароля:", error);
    toast("Ошибка", {
      description: error.message || "Произошла ошибка при сбросе пароля",
    });
    return false;
  }
};

// Функция для обновления пароля
const updatePassword = async (newPassword: string): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.updateUser({ 
      password: newPassword
    });
    
    if (error) {
      toast("Ошибка", {
        description: error.message || "Не удалось обновить пароль",
      });
      return false;
    }
    
    toast("Пароль обновлен", {
      description: "Ваш пароль успешно изменен",
    });
    
    return true;
  } catch (error: any) {
    console.error("Ошибка при обновлении пароля:", error);
    toast("Ошибка", {
      description: error.message || "Произошла ошибка при обновлении пароля",
    });
    return false;
  }
};

// Функция для обновления email
const updateEmail = async (newEmail: string): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.updateUser({ 
      email: newEmail
    });
    
    if (error) {
      toast("Ошибка", {
        description: error.message || "Не удалось обновить email",
      });
      return false;
    }
    
    toast("Email обновлен", {
      description: "На новый адрес email отправлено письмо для подтверждения",
    });
    
    return true;
  } catch (error: any) {
    console.error("Ошибка при обновлении email:", error);
    toast("Ошибка", {
      description: error.message || "Произошла ошибка при обновлении email",
    });
    return false;
  }
};

// Функция для проверки роли пользователя
const hasRole = async (
  role: 'admin' | 'editor' | 'user',
  user: User | null,
  userRoles: string[],
  setUserRoles: React.Dispatch<React.SetStateAction<string[]>>
): Promise<boolean> => {
  // Если нет пользователя, то нет и ролей
  if (!user) return false;
  
  // Если у нас уже есть кэшированные роли, используем их
  if (userRoles.length > 0) {
    return userRoles.includes(role);
  }
  
  // Если ролей еще нет, загружаем их из базы данных
  try {
    const { data: rolesData, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Ошибка при проверке ролей:', error);
      return false;
    }
    
    const roles = rolesData.map(r => r.role);
    // Кэшируем роли для будущих проверок
    setUserRoles(roles);
    
    return roles.includes(role);
  } catch (error) {
    console.error('Ошибка при проверке ролей:', error);
    return false;
  }
};

export const authMethods = {
  login,
  register,
  logout,
  updateProfile,
  resetPassword,
  updatePassword,
  updateEmail,
  hasRole
};
