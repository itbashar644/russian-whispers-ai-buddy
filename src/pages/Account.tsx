
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

const Account = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect to account/Account.tsx which has the full implementation
  React.useEffect(() => {
    // Small timeout to prevent immediate redirect
    const timer = setTimeout(() => {
      navigate("/account");
    }, 100);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-6">Личный кабинет</h1>
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <p className="mb-4">Вы вошли как: {user.email}</p>
            <Button variant="outline" onClick={handleLogout}>
              Выйти
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Account;
