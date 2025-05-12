
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserOrders from "./UserOrders";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  phone: z.string().optional(),
  address: z.string().optional(),
  preferredContactMethod: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Account = () => {
  const navigate = useNavigate();
  const { profile, logout, updateProfile, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [favoriteAddresses, setFavoriteAddresses] = useState<string[]>([]);
  const [newAddress, setNewAddress] = useState("");

  // Create the form regardless of authentication state to ensure consistent hook usage
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || "",
      phone: profile?.phone || "",
      address: profile?.address || "",
      preferredContactMethod: profile?.preferredContactMethod || "phone",
    },
  });

  // Use useEffect to handle redirect instead of conditional rendering
  useEffect(() => {
    if (!isAuthenticated || !profile) {
      navigate("/login");
    } else {
      // Load saved addresses if available
      if (profile.savedAddresses && Array.isArray(profile.savedAddresses)) {
        setFavoriteAddresses(profile.savedAddresses);
      }
    }
  }, [isAuthenticated, profile, navigate]);

  // If we're not authenticated, render a loading state but keep all hooks
  if (!isAuthenticated || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const onSubmit = (data: ProfileFormValues) => {
    const updatedProfile = {
      ...data,
      savedAddresses: favoriteAddresses
    };
    updateProfile(updatedProfile);
    toast.success("Профиль успешно обновлен");
  };

  const handleAddAddress = () => {
    if (newAddress.trim() && !favoriteAddresses.includes(newAddress)) {
      setFavoriteAddresses([...favoriteAddresses, newAddress]);
      setNewAddress("");
      toast.success("Адрес добавлен в избранное");
    }
  };

  const handleRemoveAddress = (address: string) => {
    setFavoriteAddresses(favoriteAddresses.filter(addr => addr !== address));
    toast.success("Адрес удален из избранных");
  };

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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-grow container px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Боковая панель с информацией о пользователе */}
          <div className="md:w-1/4">
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
                  variant="outline" 
                  className="w-full mb-4"
                  onClick={() => {
                    setActiveTab("profile");
                  }}
                >
                  Личные данные
                </Button>
                <Button 
                  variant="outline" 
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
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  Выход
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Основной контент */}
          <div className="md:w-3/4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="profile">Личные данные</TabsTrigger>
                <TabsTrigger value="orders">Мои заказы</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Личные данные</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Имя</FormLabel>
                              <FormControl>
                                <Input placeholder="Введите ваше имя" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Телефон</FormLabel>
                              <FormControl>
                                <Input placeholder="Введите номер телефона" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Основной адрес доставки</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Введите адрес доставки" 
                                  className="min-h-[100px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Предпочтительный способ связи */}
                        <FormField
                          control={form.control}
                          name="preferredContactMethod"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Предпочтительный способ связи</FormLabel>
                              <FormControl>
                                <Select 
                                  value={field.value} 
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Выберите способ связи" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="phone">По телефону</SelectItem>
                                    <SelectItem value="telegram">Telegram</SelectItem>
                                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* Избранные адреса доставки */}
                        <div className="space-y-4">
                          <h3 className="text-md font-semibold">Избранные адреса доставки</h3>
                          
                          <div className="space-y-2">
                            {favoriteAddresses.length > 0 ? (
                              favoriteAddresses.map((address, index) => (
                                <div key={index} className="flex items-center gap-2 p-3 border rounded-md">
                                  <div className="flex-1">
                                    <p className="text-sm">{address}</p>
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => handleRemoveAddress(address)}
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-muted-foreground">У вас пока нет избранных адресов</p>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            <Input 
                              placeholder="Новый адрес доставки" 
                              value={newAddress}
                              onChange={(e) => setNewAddress(e.target.value)}
                            />
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={handleAddAddress}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Добавить
                            </Button>
                          </div>
                        </div>
                        
                        <Button type="submit">
                          Сохранить изменения
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
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
  );
};

export default Account;
