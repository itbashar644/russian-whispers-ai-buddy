
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { supabase, cleanupAuthState } from "@/integrations/supabase/client";
import { User, Session, Provider } from '@supabase/supabase-js';

// Типы, которые соответствуют нашей структуре базы данных
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  avatar_url?: string;
  role?: 'admin' | 'editor' | 'user';
  preferredContactMethod?: 'phone' | 'telegram' | 'whatsapp';
  savedAddresses?: string[];
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<UserProfile>) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
  updateEmail: (newEmail: string) => Promise<boolean>;
  hasRole: (role: 'admin' | 'editor' | 'user') => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRoles, setUserRoles] = useState<string[]>([]);

  // Функция для загрузки профиля пользователя
  const loadUserProfile = async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Ошибка при загрузке профиля:', profileError);
        return;
      }

      // Получаем роли пользователя
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (rolesError) {
        console.error('Ошибка при загрузке ролей:', rolesError);
        return;
      }

      const roles = rolesData.map(r => r.role);
      setUserRoles(roles);

      // Cast the profile data to make TypeScript happy and ensure all fields are properly typed
      const typedProfileData = profileData as {
        id: string;
        email: string | null;
        name: string | null;
        phone: string | null;
        address: string | null;
        avatar_url: string | null;
        preferredcontactmethod: string | null; // Note the lowercase in DB column
        savedaddresses: any | null; // Note the lowercase in DB column
      };

      const fullProfile: UserProfile = {
        id: typedProfileData.id,
        email: typedProfileData.email || '',
        name: typedProfileData.name || '',
        phone: typedProfileData.phone || undefined,
        address: typedProfileData.address || undefined,
        avatar_url: typedProfileData.avatar_url || undefined,
        role: roles.includes('admin') ? 'admin' : roles.includes('editor') ? 'editor' : 'user',
        // Map database column names to our camelCase interface properties
        preferredContactMethod: (typedProfileData.preferredcontactmethod as 'phone' | 'telegram' | 'whatsapp') || 'phone',
        savedAddresses: Array.isArray(typedProfileData.savedaddresses) ? typedProfileData.savedaddresses : []
      };

      setProfile(fullProfile);
    } catch (error) {
      console.error('Ошибка при загрузке профиля:', error);
    }
  };

  // Инициализация состояния аутентификации
  useEffect(() => {
    // Настраиваем слушатель изменения статуса аутентификации
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsAuthenticated(!!currentSession);
        
        if (currentSession?.user) {
          // Использ��в setTimeout для предотвращения блокировок
          setTimeout(() => {
            loadUserProfile(currentSession.user.id);
          }, 0);
        } else {
          setProfile(null);
          setUserRoles([]);
        }
      }
    );

    // Проверяем текущую сессию
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsAuthenticated(!!currentSession);
      
      if (currentSession?.user) {
        loadUserProfile(currentSession.user.id);
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
      toast("Ошибк�� входа", {
        description: error.message || "Произошла ошибка при входе в систему",
      });
      return false;
    }
  };

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

  const updateProfile = async (userData: Partial<UserProfile>): Promise<boolean> => {
    if (!user || !profile) return false;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(userData)
        .eq('id', user.id);
      
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

  const hasRole = async (role: 'admin' | 'editor' | 'user'): Promise<boolean> => {
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

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        profile, 
        isAuthenticated, 
        isLoading,
        login, 
        register, 
        logout, 
        updateProfile, 
        resetPassword,
        updatePassword,
        updateEmail,
        hasRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
