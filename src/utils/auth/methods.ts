
import { supabase, cleanupAuthState } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserProfile } from "@/types/auth";
import { loadUserProfile } from "./profile";

export async function signInWithEmail(email: string, password: string) {
  try {
    // Clean up existing auth state before signing in
    cleanupAuthState();
    
    // Attempt to sign out globally first to prevent conflicts
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (err) {
      // Continue even if this fails
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    toast("Ошибка входа", {
      description: error.message,
    });
    return { data: null, error };
  }
}

export async function signUpWithEmail(email: string, password: string) {
  try {
    // Clean up existing auth state before signing up
    cleanupAuthState();
    
    // Set redirect URL for confirmation emails
    const redirectTo = `${window.location.origin}/auth/callback`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
        data: {
          email_confirmed_at: new Date().toISOString(), // Auto-confirm for development
        }
      }
    });

    if (error) throw error;
    
    let message = "Аккаунт создан успешно.";
    
    // If email confirmation is required by Supabase settings
    if (data?.user?.identities?.length === 0) {
      message = "На ваш email отправлено письмо для подтверждения. Пожалуйста, проверьте почту.";
    } else {
      message = "Аккаунт создан успешно. Вы можете войти в систему.";
    }
    
    toast("Регистрация выполнена", {
      description: message,
    });
    
    return { 
      data, 
      error: null, 
      message 
    };
  } catch (error: any) {
    const errorMessage = error.message || "Произошла ошибка при регистрации";
    toast("Ошибка регистрации", {
      description: errorMessage,
    });
    return { 
      data: null, 
      error,
      message: errorMessage
    };
  }
}

export async function signOut() {
  try {
    // Clean up auth state
    cleanupAuthState();
    
    // Attempt global sign out
    const { error } = await supabase.auth.signOut({ scope: 'global' });
    if (error) throw error;
    
    // Force page reload for clean state
    window.location.href = '/';
    
    return { error: null };
  } catch (error: any) {
    toast("Ошибка выхода", {
      description: error.message,
    });
    return { error };
  }
}

export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;
    
    toast("Письмо отправлено", {
      description: "Проверьте почту для сброса пароля",
    });
    
    return { error: null };
  } catch (error: any) {
    toast("Ошибка сброса пароля", {
      description: error.message,
    });
    return { error };
  }
}

export async function updatePassword(password: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) throw error;
    
    toast("Пароль обновлен", {
      description: "Вы можете использовать новый пароль для входа",
    });
    
    return { error: null };
  } catch (error: any) {
    toast("Ошибка обновления пароля", {
      description: error.message,
    });
    return { error };
  }
}

// Added export for the authMethods object with all required methods
export const authMethods = {
  // Authentication methods
  login: async (email: string, password: string): Promise<boolean> => {
    const { data, error } = await signInWithEmail(email, password);
    return !error && !!data;
  },
  
  register: async (email: string, password: string, name: string): Promise<{ success: boolean, message?: string }> => {
    const { data, error, message } = await signUpWithEmail(email, password);
    
    if (error) return { success: false, message };
    
    if (data.user) {
      // Update profile with name after successful registration
      try {
        await supabase
          .from('profiles')
          .update({ name })
          .eq('id', data.user.id);
          
        return { success: true, message };
      } catch (err: any) {
        console.error("Error updating profile:", err);
        return { 
          success: !!data.user, 
          message: "Аккаунт создан, но произошла ошибка при сохранении профиля"
        }; // Return true even if profile update fails
      }
    }
    
    return { success: false, message: "Неизвестная ошибка при регистрации" };
  },
  
  logout: async (): Promise<void> => {
    await signOut();
  },
  
  // Profile methods
  updateProfile: async (
    userData: Partial<UserProfile>,
    setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>,
    currentProfile: UserProfile | null
  ): Promise<boolean> => {
    try {
      if (!currentProfile?.id) {
        toast("Ошибка обновления профиля", {
          description: "Пользователь не авторизован",
        });
        return false;
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({
          name: userData.name,
          phone: userData.phone,
          address: userData.address,
          avatar_url: userData.avatar_url,
          preferredcontactmethod: userData.preferredContactMethod,
          savedaddresses: userData.savedAddresses,
          telegramnickname: userData.telegramNickname
        })
        .eq('id', currentProfile.id);
      
      if (error) throw error;
      
      // Update local state
      if (setProfile && currentProfile) {
        setProfile({
          ...currentProfile,
          ...userData
        });
      }
      
      toast("Профиль обновлен", {
        description: "Ваши данные успешно сохранены",
      });
      
      return true;
    } catch (error: any) {
      toast("Ошибка обновления профиля", {
        description: error.message || "Не удалось обновить профиль",
      });
      return false;
    }
  },
  
  // Password management
  resetPassword: async (email: string): Promise<boolean> => {
    const { error } = await resetPassword(email);
    return !error;
  },
  
  updatePassword: async (newPassword: string): Promise<boolean> => {
    const { error } = await updatePassword(newPassword);
    return !error;
  },
  
  // Email management
  updateEmail: async (newEmail: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail,
      });
      
      if (error) throw error;
      
      toast("Email обновлен", {
        description: "Проверьте новый email для подтверждения",
      });
      
      return true;
    } catch (error: any) {
      toast("Ошибка обновления email", {
        description: error.message,
      });
      return false;
    }
  },
  
  // Role management
  hasRole: async (
    role: 'admin' | 'editor' | 'user',
    user: any,
    userRoles: string[],
    setUserRoles: React.Dispatch<React.SetStateAction<string[]>>
  ): Promise<boolean> => {
    // Check if we have the role in our local state first
    if (userRoles.includes(role)) {
      return true;
    }
    
    // If not, check from the database
    if (!user?.id) return false;
    
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', role);
      
      if (error) throw error;
      
      const hasRole = data && data.length > 0;
      
      // Update local cache if role found
      if (hasRole && !userRoles.includes(role)) {
        setUserRoles([...userRoles, role]);
      }
      
      return hasRole;
    } catch (error) {
      console.error("Error checking user role:", error);
      return false;
    }
  }
};
