
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Mail } from "lucide-react";
import RegisterFormSchema from "@/pages/auth/schemas/registerFormSchema";
import { toast } from "sonner";
import { formatAuthError } from "@/utils/auth/errorFormatter";

type FormData = z.infer<typeof RegisterFormSchema>;

export default function RegisterForm() {
  const { signupWithEmail } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  
  const form = useForm<FormData>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setShowLoginPrompt(false);
    setShowEmailConfirmation(false);
    
    try {
      const result = await signupWithEmail(data.email, data.password, { name: data.name });
      
      if (result.success) {
        setUserEmail(data.email);
        setShowEmailConfirmation(true);
        toast.success("Регистрация успешна!", {
          description: "Проверьте вашу почту для подтверждения регистрации.",
        });
      } else if (result.isExistingUser) {
        // User already exists, show login prompt
        setShowLoginPrompt(true);
        form.setError("email", {
          type: "manual",
          message: "Пользователь с таким email уже существует",
        });
      } else {
        const errorMessage = result.error ? 
          formatAuthError(new Error(typeof result.error === 'string' ? result.error : result.error.message || 'Unknown error')) : 
          "Что-то пошло не так. Попробуйте еще раз.";
        toast.error("Ошибка при регистрации", {
          description: errorMessage,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? formatAuthError(error) : "Что-то пошло не так. Попробуйте еще раз.";
      toast.error("Ошибка при регистрации", {
        description: errorMessage,
      });
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (showEmailConfirmation) {
    return (
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Подтвердите вашу почту</h2>
          <p className="text-muted-foreground">
            Мы отправили письмо с подтверждением на адрес:
          </p>
          <p className="font-medium text-blue-600">{userEmail}</p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
          <p className="mb-2">
            <strong>Что делать дальше:</strong>
          </p>
          <ol className="list-decimal list-inside space-y-1 text-left">
            <li>Проверьте вашу почту (включая папку "Спам")</li>
            <li>Найдите письмо от нас с темой подтверждения регистрации</li>
            <li>Нажмите на ссылку в письме для подтверждения</li>
            <li>После подтверждения вернитесь на страницу входа</li>
          </ol>
        </div>
        
        <div className="space-y-3">
          <Button 
            onClick={() => setShowEmailConfirmation(false)} 
            variant="outline"
            className="w-full"
          >
            Изменить email или попробовать снова
          </Button>
          
          <Button asChild className="w-full">
            <Link to="/login">
              Перейти на страницу входа
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имя</FormLabel>
              <FormControl>
                <Input placeholder="Иван Иванов" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="mail@example.com"
                  autoComplete="username"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Пароль</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Подтвердите пароль</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {showLoginPrompt && (
          <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-700">
            У вас уже есть аккаунт.{" "}
            <Link to="/login" className="font-medium underline">
              Войти сейчас
            </Link>
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Регистрация...
            </>
          ) : (
            "Зарегистрироваться"
          )}
        </Button>

        <div className="text-center text-sm">
          Уже есть аккаунт?{" "}
           <Link to="/login" className="font-medium">
            Войти
          </Link>
        </div>
      </form>
    </Form>
  );
}
