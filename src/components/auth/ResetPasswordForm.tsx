
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { updatePassword } from "@/utils/auth/methods";
import { toast } from "sonner";

// Define a type for the possible return values of updatePassword
type UpdatePasswordResult = boolean | { error: { message?: string } | string | unknown };

interface ResetPasswordFormProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ loading, setLoading }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

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
