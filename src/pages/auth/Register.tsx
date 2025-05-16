
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthContext } from "@/context/AuthContext";
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
import { Loader2 } from "lucide-react";
import RegisterFormSchema from "./schemas/registerFormSchema";
import { toast } from "sonner";

type FormData = z.infer<typeof RegisterFormSchema>;

export default function Register() {
  const { register: registerUser } = useAuthContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  
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
    
    try {
      const result = await registerUser(data.email, data.password, data.name);
      
      if (result.success) {
        toast.success("Регистрация успешна!", {
          description: "Теперь вы можете войти в свой аккаунт.",
        });
        navigate("/auth/login");
      } else if (result.isExistingUser) {
        // User already exists, show login prompt
        setShowLoginPrompt(true);
        form.setError("email", {
          type: "manual",
          message: "Пользователь с таким email уже существует",
        });
      } else {
        toast.error("Ошибка при регистрации", {
          description: result.message || "Что-то пошло не так. Попробуйте еще раз.",
        });
      }
    } catch (error) {
      toast.error("Ошибка при регистрации", {
        description: "Что-то пошло не так. Попробуйте еще раз.",
      });
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:block md:w-1/2 bg-gray-100">
        <div className="h-full flex items-center justify-center p-8">
          <img
            src="/lovable-uploads/c08f9eab-dd00-4949-baa0-82ab4bad889b.png"
            alt="The X Shop"
            className="max-w-sm w-full"
          />
        </div>
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
        <div className="max-w-md w-full">
          <div className="mb-8 text-center">
            <Link to="/" className="inline-block mb-6 md:hidden">
              <img
                src="/lovable-uploads/c08f9eab-dd00-4949-baa0-82ab4bad889b.png"
                alt="Logo"
                className="h-12 mx-auto"
              />
            </Link>
            <h1 className="text-2xl font-bold">Регистрация</h1>
            <p className="text-muted-foreground mt-2">
              Создайте аккаунт для доступа к заказам и избранному
            </p>
          </div>

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
                  <Link to="/auth/login" className="font-medium underline">
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
                <Link to="/auth/login" className="font-medium">
                  Войти
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
