import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";

interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  phone?: string;
  address?: string;
  orderHistory?: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Проверка наличия авторизованного пользователя при загрузке
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Имитация запроса к API
      // В реальном приложении здесь будет запрос к серверу

      // Проверяем наличие пользователя в localStorage (для демонстрации)
      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const foundUser = storedUsers.find(
        (u: any) => u.email === email && u.password === password
      );

      if (!foundUser) {
        toast("Ошибка входа", {
          description: "Неверный email или пароль",
        });
        return false;
      }

      // Удаляем пароль из объекта пользователя для хранения
      const { password: _, ...userWithoutPassword } = foundUser;
      
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      
      toast("Успешный вход", {
        description: "Вы успешно вошли в систему",
      });
      
      return true;
    } catch (error) {
      console.error("Ошибка при входе:", error);
      toast("Ошибка входа", {
        description: "Произошла ошибка при входе в систему",
      });
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      // Имитация запроса к API
      // В реальном приложении здесь будет запрос к серверу
      
      // Проверяем, есть ли уже такой email в localStorage (для демонстрации)
      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
      
      if (storedUsers.some((u: any) => u.email === email)) {
        toast("Ошибка регистрации", {
          description: "Пользователь с таким email уже существует",
        });
        return false;
      }
      
      const newUser = {
        id: `user_${Date.now()}`,
        email,
        password, // В реальном приложении пароль должен быть захеширован
        name,
        role: 'user', // Добавляем роль по умолчанию
        orderHistory: []
      };
      
      storedUsers.push(newUser);
      localStorage.setItem("users", JSON.stringify(storedUsers));
      
      // Удаляем пароль из объекта пользователя для хранения в состоянии
      const { password: _, ...userWithoutPassword } = newUser;
      
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      
      toast("Успешная регистрация", {
        description: "Аккаунт успешно создан",
      });
      
      return true;
    } catch (error) {
      console.error("Ошибка при регистрации:", error);
      toast("Ошибка регистрации", {
        description: "Произошла ошибка при создании аккаунта",
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    toast("Выход из системы", {
      description: "Вы успешно вышли из системы",
    });
  };

  const updateProfile = (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    
    // Обновляем пользователя в списке всех пользователей
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = storedUsers.map((u: any) => 
      u.id === user.id ? { ...u, ...userData } : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    
    toast("Профиль обновлен", {
      description: "Данные профиля успешно обновлены",
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, register, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};
