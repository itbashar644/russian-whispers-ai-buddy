
import { toast } from "@/hooks/use-toast";
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
      toast({
        title: "Ошибка входа",
        description: error.message || "Неверный email или пароль",
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "Успешный вход",
      description: "Вы успешно вошли в систему",
    });
    
    return true;
  } catch (error: any) {
    console.error("Ошибка при входе:", error);
    toast({
      title: "Ошибка входа",
      description: error.message || "Произошла ошибка при входе в систему",
      variant: "destructive",
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
      toast({
        title: "Ошибка регистрации",
        description: error.message || "Не удалось создать аккаунт",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Успешная регистрация",
      description: "Аккаунт успешно создан",
    });
    
    return true;
  } catch (error: any) {
    console.error("Ошибка при регистрации:", error);
    toast({
      title: "Ошибка регистрации",
      description: error.message || "Произошла ошибка при создании аккаунта",
      variant: "destructive",
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
    
    toast({
      title: "Выход из системы",
      description: "Вы успешно вышли из системы",
    });
    
    // Принудительное обновление страницы для очистки состояния
    window.location.href = '/';
  } catch (error: any) {
    console.error("Ошибка при выходе:", error);
    toast({
      title: "Ошибка",
      description: error.message || "Произошла ошибка при выходе из системы",
      variant: "destructive",
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
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось обновить профиль",
        variant: "destructive",
      });
      return false;
    }
    
    // Обновляем локальное состояние
    setProfile({ ...profile, ...userData });
    
    toast({
      title: "Профиль обновлен",
      description: "Данные профиля успешно обновлены",
    });
    
    return true;
  } catch (error: any) {
    console.error("Ошибка при обновлении профиля:", error);
    toast({
      title: "Ошибка",
      description: error.message || "Произошла ошибка при обновлении профиля",
      variant: "destructive",
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
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось отправить инструкции",
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "Инструкции отправлены",
      description: "Проверьте вашу электронную почту для сброса пароля",
    });
    
    return true;
  } catch (error: any) {
    console.error("Ошибка при сбросе пароля:", error);
    toast({
      title: "Ошибка",
      description: error.message || "Произошла ошибка при сбросе пароля",
      variant: "destructive",
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
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось обновить пароль",
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "Пароль обновлен",
      description: "Ваш пароль успешно изменен",
    });
    
    return true;
  } catch (error: any) {
    console.error("Ошибка при обновлении пароля:", error);
    toast({
      title: "Ошибка",
      description: error.message || "Произошла ошибка при обновлении пароля",
      variant: "destructive",
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
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось обновить email",
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "Email обновлен",
      description: "На новый адрес email отправлено письмо для подтверждения",
    });
    
    return true;
  } catch (error: any) {
    console.error("Ошибка при обновлении email:", error);
    toast({
      title: "Ошибка",
      description: error.message || "Произошла ошибка при обновлении email",
      variant: "destructive",
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
