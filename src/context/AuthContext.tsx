
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
  hasRole: (role: 'admin' | 'editor' | 'user') => boolean;
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

      const fullProfile = {
        ...profileData,
        role: roles.includes('admin') ? 'admin' : roles.includes('editor') ? 'editor' : 'user'
      };

      setProfile(fullProfile as UserProfile);
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
          // Используем setTimeout для предотвращения блокировок
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
      toast("Ошибка входа", {
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

  const hasRole = (role: 'admin' | 'editor' | 'user'): boolean => {
    return userRoles.includes(role);
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
        hasRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
