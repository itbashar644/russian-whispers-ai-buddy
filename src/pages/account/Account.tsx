
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import UserOrders from "./UserOrders";
import AccountSidebar from "@/components/account/AccountSidebar";
import ProfileForm from "@/components/account/ProfileForm";
import UserAuth from "@/components/account/UserAuth";

const Account = () => {
  const navigate = useNavigate();
  const { logout, isAuthenticated, profile } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <UserAuth>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <div className="flex-grow container px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar with user info */}
            <div className="md:w-1/4">
              <AccountSidebar 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onLogout={handleLogout}
              />
            </div>
            
            {/* Main content */}
            <div className="md:w-3/4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="profile">Личные данные</TabsTrigger>
                  <TabsTrigger value="orders">Мои заказы</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile">
                  <ProfileForm />
                </TabsContent>
                
                <TabsContent value="orders">
                  <UserOrders />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </UserAuth>
  );
};

export default Account;
