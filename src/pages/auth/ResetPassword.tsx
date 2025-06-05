import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import ResetPasswordError from "@/components/auth/ResetPasswordError";
import ResetPasswordWrapper from "@/components/auth/ResetPasswordWrapper";

const ResetPassword: React.FC = () => {
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
            
            // If we're on the /reset-password path but don't have a token, redirect to the forgot password page
            if (location.pathname === '/reset-password') {
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

  return (
    <ResetPasswordWrapper 
      isRecoveryMode={isRecoveryMode} 
      loading={loading} 
      setLoading={setLoading}
      navigate={navigate}
    />
  );
};

export default ResetPassword;
