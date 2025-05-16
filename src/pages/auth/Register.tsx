
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
import { Loader2 } from "lucide-react";
import RegisterFormSchema from "./schemas/registerFormSchema";
import { toast } from "sonner";
import RegisterForm from "@/components/auth/RegisterForm";

export default function Register() {
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
          
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
