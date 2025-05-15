
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formSchema = z.object({
  subject: z.string().min(1, "Введите тему рассылки"),
  content: z.string().min(10, "Содержание должно быть не менее 10 символов"),
});

type NewsletterFormValues = z.infer<typeof formSchema>;

export function NewsletterManager() {
  const [isLoading, setIsLoading] = useState(false);
  const [subscribers, setSubscribers] = useState<{email: string, timestamp: string}[]>([]);

  // Load subscribers from localStorage on component mount
  useState(() => {
    const storedSubscribers = localStorage.getItem("newsletterSubscriptions");
    if (storedSubscribers) {
      setSubscribers(JSON.parse(storedSubscribers));
    }
  });

  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      content: "",
    },
  });

  const onSubmit = async (data: NewsletterFormValues) => {
    if (subscribers.length === 0) {
      toast.error("Нет подписчиков для рассылки");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, this would call an API endpoint to send emails
      console.log("Sending newsletter:", data);
      console.log("To subscribers:", subscribers.map(s => s.email));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Рассылка успешно отправлена ${subscribers.length} подписчикам!`);
      form.reset();
    } catch (error) {
      console.error("Error sending newsletter:", error);
      toast.error("Ошибка при отправке рассылки. Попробуйте позже.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Управление рассылкой</CardTitle>
        <CardDescription>
          Отправка рекламной рассылки подписчикам ({subscribers.length})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тема письма</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите тему письма" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Содержание письма</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Введите текст рассылки" 
                      className="min-h-[200px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={isLoading || subscribers.length === 0}>
              {isLoading ? "Отправка..." : "Отправить рассылку"}
            </Button>
          </form>
        </Form>
        
        {subscribers.length === 0 && (
          <p className="text-center text-muted-foreground mt-4">
            У вас пока нет подписчиков для рассылки
          </p>
        )}
      </CardContent>
    </Card>
  );
}
