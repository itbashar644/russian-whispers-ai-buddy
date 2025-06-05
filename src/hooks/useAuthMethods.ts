
import { authMethods } from '@/utils/auth/authMethods';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/auth';
import { AuthResult, PasswordUpdateResult, ResetPasswordParams } from '@/utils/auth/types';

export function useAuthMethods(setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>) {
  // Auth functions that use our authMethods
  const loginWithEmail = async (email: string, password: string) => {
    return await authMethods.loginWithEmail(email, password);
  };

  const logout = async () => {
    const result = await authMethods.logout();
    if (result.success) {
      setProfile(null);
    }
    return result;
  };

  const updatePassword = async (newPassword: string) => {
    return await authMethods.updatePassword(newPassword);
  };

  const sendPasswordResetEmail = async (email: string) => {
    return await authMethods.sendPasswordResetEmail(email);
  };

  const resetPassword = async (params: ResetPasswordParams) => {
    return await authMethods.resetPassword(params);
  };

  const signupWithEmail = async (email: string, password: string, metadata?: { name?: string }) => {
    return await authMethods.signupWithEmail(email, password, metadata);
  };
  
  // Added methods for convenience
  const updateEmail = async (newEmail: string): Promise<AuthResult> => {
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { 
        success: true, 
        message: "Email update initiated. Please check your new email for verification." 
      };
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error";
      return { success: false, error: errorMessage };
    }
  };
  
  // Check if user has specific role
  const hasRole = async (roleName: 'admin' | 'editor' | 'user'): Promise<boolean> => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user) return false;
      
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: session.session.user.id,
        _role: roleName
      });
      
      if (error) {
        console.error('Error checking role:', error);
        return false;
      }
      
      return data || false;
    } catch (error) {
      console.error('Error checking role:', error);
      return false;
    }
  };

  return {
    loginWithEmail,
    logout,
    updatePassword,
    sendPasswordResetEmail,
    resetPassword,
    signupWithEmail,
    hasRole,
    updateEmail
  };
}
