
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { LockIcon, User, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, hasRole } = useAuth();

  // Проверка, авторизован ли пользователь и является ли он админом
  useEffect(() => {
    if (isAuthenticated && hasRole('admin')) {
      navigate('/admin');
    }
  }, [isAuthenticated, hasRole, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Используем основной метод входа, а затем проверяем роль
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });

      if (error) {
        toast("Ошибка авторизации", {
          description: error.message || "Неверное имя пользователя или пароль",
        });
        setLoading(false);
        return;
      }

      // Проверяем роль пользователя
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id);

      if (rolesError) {
        toast("Ошибка авторизации", {
          description: "Не удалось проверить роль пользователя",
        });
        setLoading(false);
        return;
      }

      // Проверяем, есть ли среди ролей роль админа
      const isAdmin = rolesData.some(r => r.role === 'admin');

      if (isAdmin) {
        toast("Авторизация успешна", {
          description: "Добро пожаловать в административную панель",
        });
        navigate("/admin");
      } else {
        // Если роль не админ, выполняем выход
        await supabase.auth.signOut();
        toast("Ошибка авторизации", {
          description: "У вас нет прав доступа к админ-панели. Для назначения прав администратора обратитесь к существующему администратору.",
        });
        setLoading(false);
      }
    } catch (error: any) {
      console.error("Ошибка при входе:", error);
      toast("Ошибка авторизации", {
        description: error.message || "Произошла ошибка при входе в систему",
      });
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <LockIcon className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Вход в админ-панель</CardTitle>
          <CardDescription className="text-center">
            Введите свои учетные данные для доступа к административной панели
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                "Проверка..."
              ) : (
                <>
                  Войти <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>Доступ только для администраторов системы</p>
            <p className="mt-2">Чтобы получить права администратора, зарегистрируйтесь как обычный пользователь и обратитесь к администратору системы.</p>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <Button variant="outline" className="w-full" asChild>
            <a href="/">Вернуться на главную страницу</a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLogin;
