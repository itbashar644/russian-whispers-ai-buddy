
import React, { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useAuth } from "@/context/AuthContext";
import ContactMethodField from "./ContactMethodField";
import TelegramNicknameField from "./TelegramNicknameField";
import AddressList from "./AddressList";

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

  const handleAddAddress = (address: string) => {
    setFavoriteAddresses([...favoriteAddresses, address]);
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

            <ContactMethodField form={form} />
            
            {/* Отображаем поле для ника Telegram только если выбран соответствующий способ связи */}
            {watchContactMethod === "telegram" && (
              <TelegramNicknameField form={form} />
            )}
            
            {/* Избранные адреса доставки */}
            <AddressList 
              addresses={favoriteAddresses}
              onAddAddress={handleAddAddress}
              onRemoveAddress={handleRemoveAddress}
            />
            
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
