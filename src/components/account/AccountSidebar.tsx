
import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

interface AccountSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const AccountSidebar: React.FC<AccountSidebarProps> = ({
  activeTab,
  setActiveTab,
  onLogout
}) => {
  const { profile } = useAuth();

  if (!profile) return null;

  // Получаем инициалы пользователя для аватара
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg bg-primary text-primary-foreground">
              {getInitials(profile.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{profile.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Button 
          variant={activeTab === "profile" ? "default" : "outline"} 
          className="w-full mb-4"
          onClick={() => {
            setActiveTab("profile");
          }}
        >
          Личные данные
        </Button>
        <Button 
          variant={activeTab === "orders" ? "default" : "outline"} 
          className="w-full mb-4"
          onClick={() => {
            setActiveTab("orders");
          }}
        >
          Мои заказы
        </Button>
        <Button 
          variant="destructive" 
          className="w-full"
          onClick={onLogout}
        >
          Выход
        </Button>
      </CardContent>
    </Card>
  );
};

export default AccountSidebar;
