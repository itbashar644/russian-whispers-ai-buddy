
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from '@/types/auth';

const useAdminStatus = (profile: UserProfile | null) => {
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  
  useEffect(() => {
    const checkSuperAdminStatus = async () => {
      // Если пользователь - halafbashar@gmail.com или vipregitrator@gmail.com, он всегда супер-админ
      if (profile?.email === 'halafbashar@gmail.com' || profile?.email === 'vipregitrator@gmail.com') {
        console.log(`Setting super admin status for ${profile.email}`);
        setIsSuperAdmin(true);
        
        // Убедимся, что в базе данных установлен флаг is_super_admin
        if (profile?.id) {
          try {
            // Проверяем, есть ли уже запись admin
            const { data: existingRole } = await supabase
              .from('user_roles')
              .select('*')
              .eq('user_id', profile.id)
              .eq('role', 'admin')
              .maybeSingle();
              
            if (!existingRole) {
              // Создаем запись, если её нет
              console.log(`Creating admin role for ${profile.email}`);
              const { error } = await supabase
                .from('user_roles')
                .insert({
                  user_id: profile.id,
                  role: 'admin',
                  is_super_admin: true
                });
              
              if (error) {
                console.error('Error creating admin role:', error);
              }
            } else if (!existingRole.is_super_admin) {
              // Обновляем запись, если флаг не установлен
              console.log(`Updating super admin flag for ${profile.email}`);
              const { error } = await supabase
                .from('user_roles')
                .update({ is_super_admin: true })
                .eq('user_id', profile.id)
                .eq('role', 'admin');
              
              if (error) {
                console.error('Error updating super admin flag:', error);
              }
            }
          } catch (error) {
            console.error('Error managing super admin status:', error);
          }
        }
        
        return;
      }
      
      if (!profile?.id) return;
      
      // Иначе проверяем флаг is_super_admin
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('is_super_admin')
          .eq('user_id', profile.id)
          .eq('role', 'admin')
          .maybeSingle();
        
        if (error) {
          console.error("Error checking super admin status:", error);
          return;
        }
        
        setIsSuperAdmin(data?.is_super_admin === true);
      } catch (error) {
        console.error("Error in super admin status check:", error);
      }
    };
    
    if (profile) {
      checkSuperAdminStatus();
    } else {
      setIsSuperAdmin(false);
    }
  }, [profile]);

  return { isSuperAdmin };
};

export default useAdminStatus;
