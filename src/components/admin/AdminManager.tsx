
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card"; 
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import AdminActions from './AdminActions';
import AdminSearchResult from './AdminSearchResult';
import useAdminStatus from '@/hooks/useAdminStatus';
import { useAuth } from '@/context/AuthContext';

const AdminManager = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<{ email: string; isAdmin: boolean } | null>(null);
  const { profile } = useAuth();
  const { isSuperAdmin } = useAdminStatus(profile);

  // Check if email exists and if it has admin role
  const checkUserExistsAndIsAdmin = async (email: string) => {
    setLoading(true);
    try {
      // First, find the user by email to get the ID
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', email)
        .single();

      if (profileError || !profileData) {
        setSearchResult(null);
        toast.error('Пользователь с таким email не найден');
        setLoading(false);
        return null;
      }

      // Then check if they have the admin role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', profileData.id)
        .eq('role', 'admin')
        .maybeSingle();

      setSearchResult({
        email: profileData.email,
        isAdmin: !!roleData
      });
      
      return profileData;
    } catch (error) {
      console.error('Error checking user:', error);
      toast.error('Ошибка при проверке пользователя');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async () => {
    if (!isSuperAdmin) {
      toast.error('Только супер-администраторы могут управлять администраторами');
      return;
    }

    setLoading(true);
    try {
      const user = await checkUserExistsAndIsAdmin(email);
      if (!user) {
        setLoading(false);
        return;
      }

      // Skip if already admin
      if (searchResult?.isAdmin) {
        toast.info('Пользователь уже является администратором');
        setLoading(false);
        return;
      }

      // Add admin role
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: user.id,
          role: 'admin'
        });

      if (error) {
        console.error('Error adding admin:', error);
        toast.error('Ошибка при назначении прав администратора');
        return;
      }

      toast.success('Права администратора успешно предоставлены');
      setSearchResult({ ...searchResult!, isAdmin: true });
    } catch (error) {
      console.error('Error adding admin:', error);
      toast.error('Ошибка при назначении прав администратора');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAdmin = async () => {
    if (!isSuperAdmin) {
      toast.error('Только супер-администраторы могут управлять администраторами');
      return;
    }

    setLoading(true);
    try {
      const user = await checkUserExistsAndIsAdmin(email);
      if (!user) {
        setLoading(false);
        return;
      }

      // Skip if not admin
      if (!searchResult?.isAdmin) {
        toast.info('Пользователь не является администратором');
        setLoading(false);
        return;
      }

      // Check if trying to remove rights from a fixed super admin
      if (email === 'halafbashar@gmail.com' || email === 'vipregitrator@gmail.com') {
        toast.error('Невозможно лишить прав администратора учетную запись основателя');
        setLoading(false);
        return;
      }
      
      // Remove admin role
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', user.id)
        .eq('role', 'admin');

      if (error) {
        console.error('Error removing admin:', error);
        toast.error('Ошибка при удалении прав администратора');
        return;
      }

      toast.success('Права администратора успешно удалены');
      setSearchResult({ ...searchResult!, isAdmin: false });
    } catch (error) {
      console.error('Error removing admin:', error);
      toast.error('Ошибка при удалении прав администратора');
    } finally {
      setLoading(false);
    }
  };

  // Special handling for vipregitrator@gmail.com - make them admin automatically
  useEffect(() => {
    const ensureVipRegistratorIsAdmin = async () => {
      const vipEmail = 'vipregitrator@gmail.com';
      try {
        // First check if this account exists
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, email')
          .eq('email', vipEmail)
          .single();

        if (profileError || !profileData) {
          console.log('vipregitrator@gmail.com account not found, cannot add admin rights yet');
          return;
        }

        // Check if already admin
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', profileData.id)
          .eq('role', 'admin')
          .maybeSingle();

        // If not admin, make them admin
        if (!roleData) {
          const { error } = await supabase
            .from('user_roles')
            .insert({
              user_id: profileData.id,
              role: 'admin',
              is_super_admin: true // Mark as super admin
            });

          if (error) {
            console.error('Error adding vipregitrator as admin:', error);
          } else {
            console.log('Successfully added vipregitrator@gmail.com as admin');
          }
        }
      } catch (error) {
        console.error('Error setting up vipregitrator admin:', error);
      }
    };

    if (isSuperAdmin) {
      ensureVipRegistratorIsAdmin();
    }
  }, [isSuperAdmin]);

  const handleSearch = async () => {
    if (email) {
      await checkUserExistsAndIsAdmin(email);
    }
  };

  useEffect(() => {
    if (email) {
      const delayDebounceFn = setTimeout(() => {
        handleSearch();
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setSearchResult(null);
    }
  }, [email]);

  if (!isSuperAdmin) {
    return (
      <Card>
        <CardContent className="p-6">
          <p>У вас недостаточно прав для управления администраторами.</p>
          <p className="text-sm text-muted-foreground mt-2">Эта функция доступна только для супер-администраторов.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Управление администраторами</h2>
          <p className="text-sm text-muted-foreground">
            Добавляйте или удаляйте администраторов системы
          </p>
        </div>

        <AdminActions
          email={email}
          setEmail={setEmail}
          loading={loading}
          onAddAdmin={handleAddAdmin}
          onRemoveAdmin={handleRemoveAdmin}
        />

        {searchResult && (
          <div className="mt-4">
            <h3 className="text-md font-medium mb-2">Результат поиска:</h3>
            <AdminSearchResult result={searchResult} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminManager;
