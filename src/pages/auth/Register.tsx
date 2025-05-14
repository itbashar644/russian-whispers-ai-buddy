
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import RegisterForm from "@/components/auth/RegisterForm";
import SocialLogin from "@/components/auth/SocialLogin";

const Register = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Если пользователь уже аутентифицирован, перенаправляем на главную
  if (isAuthenticated) {
    navigate('/account');
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-grow container max-w-md mx-auto px-4 py-8">
        <Card>
          <CardContent>
            <h1 className="text-2xl font-bold mb-6 text-center pt-6">Создание аккаунта</h1>
            
            <RegisterForm />
            
            <div className="mt-4 text-center">
              <p className="text-muted-foreground">
                Уже есть аккаунт?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Войти
                </Link>
              </p>
            </div>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Или продолжить с
                </span>
              </div>
            </div>
            
            <SocialLogin isLoading={isLoading} setIsLoading={setIsLoading} />
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default Register;
