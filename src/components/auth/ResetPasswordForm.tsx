
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface ResetPasswordFormProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ loading, setLoading }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { updatePassword } = useAuth();

  const validatePassword = () => {
    if (password.length < 6) {
      toast.error("Пароль слишком короткий", {
        description: "Пароль должен содержать не менее 6 символов"
      });
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Пароли не совпадают", {
        description: "Пароль и подтверждение должны совпадать"
      });
      return false;
    }

    return true;
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }

    setLoading(true);
    try {
      const result = await updatePassword(password);
      
      // Check if result has an error
      if (!result.success) {
        let errorMessage = "Failed to update password";
        
        if (result.error) {
          if (typeof result.error === 'string') {
            errorMessage = result.error;
          } else if (typeof result.error === 'object' && result.error !== null && 'message' in result.error) {
            const errorObj = result.error as { message?: string };
            errorMessage = errorObj.message || errorMessage;
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

  return (
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
  );
};

export default ResetPasswordForm;
