
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { resetPassword, updatePassword } from "@/utils/auth/methods";
import { toast } from "sonner";

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecoveryMode, setIsRecoveryMode] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a recovery token in the URL
    const checkForRecoveryToken = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      
      if (accessToken && refreshToken) {
        try {
          setLoading(true);
          // If we have a token, we're in password update mode
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            throw error;
          }

          if (data.user) {
            setIsRecoveryMode(false);
            toast.info("Введите новый пароль", {
              description: "Вы можете установить новый пароль для своего аккаунта"
            });
          }
        } catch (error: any) {
          toast.error("Ошибка проверки токена", {
            description: error.message || "Не удалось проверить токен восстановления"
          });
        } finally {
          setLoading(false);
        }
      }
    };

    checkForRecoveryToken();
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Укажите email", {
        description: "Для сброса пароля необходимо указать email"
      });
      return;
    }

    setLoading(true);
    const success = await resetPassword(email);
    setLoading(false);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Пароль слишком короткий", {
        description: "Пароль должен содержать не менее 6 символов"
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Пароли не совпадают", {
        description: "Пароль и подтверждение должны совпадать"
      });
      return;
    }

    setLoading(true);
    const success = await updatePassword(password);
    if (success) {
      setTimeout(() => navigate("/auth/login"), 2000);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isRecoveryMode ? "Восстановление пароля" : "Установка нового пароля"}</CardTitle>
          <CardDescription>
            {isRecoveryMode
              ? "Введите email для получения инструкций по восстановлению пароля"
              : "Придумайте новый пароль для вашего аккаунта"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isRecoveryMode ? (
            <form onSubmit={handleResetPassword}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Введите ваш email"
                    required
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? "Отправка..." : "Отправить инструкции по восстановлению"}
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleUpdatePassword}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="password">Новый пароль</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Введите новый пароль"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Подтверждение пароля</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Повторите новый пароль"
                    required
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? "Обновление..." : "Обновить пароль"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={() => navigate("/auth/login")}>
            Вернуться на страницу входа
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPassword;
