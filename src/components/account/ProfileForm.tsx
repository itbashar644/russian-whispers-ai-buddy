
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash, MessageCircle, Phone } from "lucide-react";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";

const profileSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  phone: z.string().optional(),
  address: z.string().optional(),
  preferredContactMethod: z.enum(['phone', 'telegram', 'whatsapp']),
  telegramNickname: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfileForm: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  const [favoriteAddresses, setFavoriteAddresses] = React.useState<string[]>([]);
  const [newAddress, setNewAddress] = React.useState("");

  // Initialize form with user profile data
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || "",
      phone: profile?.phone || "",
      address: profile?.address || "",
      preferredContactMethod: profile?.preferredContactMethod || "phone",
      telegramNickname: profile?.telegramNickname || "",
    },
  });

  const watchContactMethod = form.watch("preferredContactMethod");

  // Load saved addresses if available
  React.useEffect(() => {
    if (profile?.savedAddresses && Array.isArray(profile.savedAddresses)) {
      setFavoriteAddresses(profile.savedAddresses);
    }
  }, [profile]);

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

  return (
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
                        <SelectItem value="phone">
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2" />
                            По телефону
                          </div>
                        </SelectItem>
                        <SelectItem value="telegram">
                          <div className="flex items-center">
                            <MessageCircle className="h-4 w-4 mr-2 text-[#1EAEDB]" />
                            Telegram
                          </div>
                        </SelectItem>
                        <SelectItem value="whatsapp">
                          <div className="flex items-center">
                            <MessageCircle className="h-4 w-4 mr-2 text-[#25D366]" />
                            WhatsApp
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Отображаем поле для ника Telegram только если выбран соответствующий способ связи */}
            {watchContactMethod === "telegram" && (
              <FormField
                control={form.control}
                name="telegramNickname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ник в Telegram</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <span className="bg-[#1EAEDB] p-2 rounded-l-md">
                          <MessageCircle className="h-5 w-5 text-white" />
                        </span>
                        <Input 
                          placeholder="Введите ваш ник в Telegram" 
                          className="rounded-l-none"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
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
  );
};

export default ProfileForm;
