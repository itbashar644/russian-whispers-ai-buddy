
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  subscribed_at: string;
}

export const useNewsletterSubscribers = () => {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscribers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .order('subscribed_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setSubscribers(data || []);
    } catch (err) {
      console.error('Error fetching newsletter subscribers:', err);
      setError('Не удалось загрузить список подписчиков');
      toast.error('Ошибка при загрузке списка подписчиков');
    } finally {
      setLoading(false);
    }
  };

  const sendNewsletter = async (subject: string, content: string) => {
    if (subscribers.length === 0) {
      toast.error('Нет подписчиков для рассылки');
      return false;
    }
    
    try {
      // In a real app, this would call an API endpoint to send emails
      console.log("Sending newsletter:", { subject, content });
      console.log("To subscribers:", subscribers.map(s => s.email));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Рассылка успешно отправлена ${subscribers.length} подписчикам!`);
      return true;
    } catch (error) {
      console.error("Error sending newsletter:", error);
      toast.error("Ошибка при отправке рассылки. Попробуйте позже.");
      return false;
    }
  };

  // Load subscribers on component mount
  useEffect(() => {
    fetchSubscribers();
  }, []);

  return { 
    subscribers, 
    loading, 
    error, 
    fetchSubscribers,
    sendNewsletter
  };
};
