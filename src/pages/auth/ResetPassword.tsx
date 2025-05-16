
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { updatePassword } from "@/utils/auth/methods";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Define a type for the possible return values of updatePassword
type UpdatePasswordResult = boolean | { error: { message?: string } | string | unknown };

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if we have a recovery token in the URL (either in hash or query params)
    const checkForRecoveryToken = async () => {
      try {
        setLoading(true);
        
        // Check for hash params (Supabase default method)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        const type = hashParams.get("type");
        
        // If we have tokens in the hash
        if (accessToken && refreshToken) {
          console.log("Found tokens in hash");
          
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            throw error;
          }

          if (data.user) {
            setIsRecoveryMode(true);
            toast.info("Введите новый пароль", {
              description: "Вы можете установить новый пароль для своего аккаунта"
            });
          }
          
        } 
        // Otherwise try to get the current session
        else {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            setIsRecoveryMode(true);
            toast.info("Введите новый пароль", {
              description: "Вы можете установить новый пароль для своего аккаунта"
            });
          } else {
            // No recovery token and no session
            setIsRecoveryMode(false);
            toast.warning("Ссылка для сброса пароля не действительна", {
              description: "Пожалуйста, запросите новую ссылку для сброса пароля"
            });
            
            // If we're on the /auth/reset-password path but don't have a token, redirect to the forgot password page
            if (location.pathname === '/auth/reset-password') {
              setTimeout(() => navigate("/forgot-password"), 2000);
            }
          }
        }
      } catch (error: any) {
        console.error("Error checking recovery token:", error);
        toast.error("Ошибка проверки токена", {
          description: error.message || "Не удалось проверить токен восстановления"
        });
        setIsRecoveryMode(false);
      } finally {
        setLoading(false);
      }
    };

    checkForRecoveryToken();
  }, [navigate, location.pathname]);

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
    try {
      // Call the updatePassword function and handle both possible return types
      const result = await updatePassword(password) as UpdatePasswordResult;
      
      // If result is a boolean (true/false), handle accordingly
      if (typeof result === "boolean") {
        if (!result) {
          throw new Error("Failed to update password");
        }
      } 
      // If result is an object with error property, check the error
      else if (result && typeof result === 'object') {
        // Safe extraction of error message with multiple type checks
        let errorMessage = "Failed to update password";
        
        if ('error' in result) {
          const errorObj = result.error;
          if (typeof errorObj === 'object' && errorObj !== null && 'message' in errorObj) {
            errorMessage = String(errorObj.message);
          } else if (typeof errorObj === 'string') {
            errorMessage = errorObj;
          }
        }
        
        throw new Error(errorMessage);
      }
      
      toast.success("Пароль успешно обновлен", {
        description: "Вы можете войти с новым паролем"
      });
      
      setTimeout(() => navigate("/login"), 2000);
    } catch (error: any) {
      toast.error("Ошибка обновления пароля", {
        description: error.message || "Не удалось обновить пароль"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPasswordReset = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{isRecoveryMode ? "Установка нового пароля" : "Сброс пароля"}</CardTitle>
            <CardDescription>
              {isRecoveryMode
                ? "Придумайте новый пароль для вашего аккаунта"
                : "Запросите ссылку для сброса пароля"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isRecoveryMode ? (
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="password">Новый пароль</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Введите новый пароль"
                    required
                    disabled={loading}
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
                    disabled={loading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Обновление..." : "Обновить пароль"}
                </Button>
              </form>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground mb-4">
                  Ссылка для сброса пароля недействительна или срок её действия истек.
                </p>
                <Button onClick={handleRequestPasswordReset}>
                  Запросить новую ссылку
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="link" onClick={() => navigate("/login")}>
              Вернуться на страницу входа
            </Button>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPassword;
