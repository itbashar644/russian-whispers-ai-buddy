
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase, cleanupAuthState } from "@/integrations/supabase/client";
import { User, Session } from '@supabase/supabase-js';
import { UserProfile } from "@/types/auth";
import { loadUserProfile } from "@/utils/auth/profile";
import { authMethods } from "@/utils/auth/methods";

// Типы для контекста аутентификации
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

// Создание контекста аутентификации
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Хук для использования контекста аутентификации
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Провайдер аутентификации
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRoles, setUserRoles] = useState<string[]>([]);

  // Инициализация состояния аутентификации
  useEffect(() => {
    // Настраиваем слушатель изменения статуса аутентификации
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsAuthenticated(!!currentSession);
        
        if (currentSession?.user) {
          // Используем setTimeout для предотвращения блокировок
          setTimeout(async () => {
            try {
              const userData = await loadUserProfile(currentSession.user.id);
              setProfile(userData.profile);
              setUserRoles(userData.roles);
            } catch (error) {
              console.error("Error loading user profile:", error);
            }
          }, 0);
        } else {
          setProfile(null);
          setUserRoles([]);
        }
      }
    );

    // Проверяем текущую сессию при загрузке
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsAuthenticated(!!currentSession);
      
      if (currentSession?.user) {
        try {
          const userData = await loadUserProfile(currentSession.user.id);
          setProfile(userData.profile);
          setUserRoles(userData.roles);
        } catch (error) {
          console.error("Error loading user profile:", error);
        }
      }
      
      setIsLoading(false);
    });

    // Отписываемся от событий при размонтировании
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Предоставляем значение контекста
  return (
    <AuthContext.Provider
      value={{ 
        user, 
        profile, 
        isAuthenticated, 
        isLoading,
        login: authMethods.login, 
        register: authMethods.register, 
        logout: authMethods.logout, 
        updateProfile: (userData) => authMethods.updateProfile(userData, setProfile, profile),
        resetPassword: authMethods.resetPassword,
        updatePassword: authMethods.updatePassword,
        updateEmail: authMethods.updateEmail,
        hasRole: (role) => authMethods.hasRole(role, user, userRoles, setUserRoles)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
