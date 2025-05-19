
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
