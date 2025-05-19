
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from '@/types/auth';

const useAdminStatus = (profile: UserProfile | null) => {
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  
  useEffect(() => {
    const checkSuperAdminStatus = async () => {
      // Если пользователь - halafbashar@gmail.com или vipregitrator@gmail.com, он всегда супер-админ
      if (profile?.email === 'halafbashar@gmail.com' || profile?.email === 'vipregitrator@gmail.com') {
        setIsSuperAdmin(true);
        
        // Убедимся, что в базе данных установлен флаг is_super_admin
        if (profile?.id) {
          // Проверяем, есть ли уже запись admin
          const { data: existingRole } = await supabase
            .from('user_roles')
            .select('*')
            .eq('user_id', profile.id)
            .eq('role', 'admin')
            .maybeSingle();
            
          if (!existingRole) {
            // Создаем запись, если её нет
            await supabase
              .from('user_roles')
              .insert({
                user_id: profile.id,
                role: 'admin',
                is_super_admin: true
              });
          } else if (!existingRole.is_super_admin) {
            // Обновляем запись, если флаг не установлен
            await supabase
              .from('user_roles')
              .update({ is_super_admin: true })
              .eq('user_id', profile.id)
              .eq('role', 'admin');
          }
        }
        
        return;
      }
      
      if (!profile?.id) return;
      
      // Иначе проверяем флаг is_super_admin
      const { data, error } = await supabase
        .from('user_roles')
        .select('is_super_admin')
        .eq('user_id', profile.id)
        .eq('role', 'admin')
        .single();
      
      if (error) {
        console.error("Error checking super admin status:", error);
        return;
      }
      
      setIsSuperAdmin(data?.is_super_admin === true);
    };
    
    checkSuperAdminStatus();
  }, [profile]);

  return { isSuperAdmin };
};

export default useAdminStatus;
