import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { authMethods } from '@/utils/auth/authMethods';
import { AuthResult, PasswordUpdateResult, ResetPasswordParams, UserProfileUpdate } from '@/utils/auth/types';
import { UserProfile } from '@/types/auth';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<AuthResult>;
  login: (email: string, password: string) => Promise<AuthResult>; // Alias for loginWithEmail
  logout: () => Promise<AuthResult>;
  register: (email: string, password: string, name?: string) => Promise<AuthResult>; // Alias for signupWithEmail
  isAuthenticated: boolean;
  updatePassword: (newPassword: string) => Promise<PasswordUpdateResult>;
  updateEmail: (newEmail: string) => Promise<AuthResult>;
  sendPasswordResetEmail: (email: string) => Promise<AuthResult>;
  resetPassword: (params: ResetPasswordParams) => Promise<AuthResult>;
  signupWithEmail: (email: string, password: string, metadata?: { name?: string; }) => Promise<AuthResult>;
  hasRole: (roleName: 'admin' | 'editor' | 'user') => Promise<boolean>;
  updateProfile: (profileData: UserProfileUpdate) => Promise<boolean>;
  isLoading: boolean; // Alias for loading
};

const defaultContext: AuthContextType = {
  session: null,
  user: null,
  profile: null,
  loading: true,
  isLoading: true, // Alias for loading
  loginWithEmail: async () => ({ success: false }),
  login: async () => ({ success: false }), // Alias for loginWithEmail
  logout: async () => ({ success: false }),
  register: async () => ({ success: false }), // Alias for signupWithEmail
  isAuthenticated: false,
  updatePassword: async () => ({ success: false }),
  updateEmail: async () => ({ success: false }),
  sendPasswordResetEmail: async () => ({ success: false }),
  resetPassword: async () => ({ success: false }),
  signupWithEmail: async () => ({ success: false }),
  hasRole: async () => false,
  updateProfile: async () => false
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST to avoid missing events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          fetchUserProfile(session.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);
  
  // Fetch user profile data
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }
      
      if (data) {
        // Transform database fields to match our UserProfile interface
        const userProfile: UserProfile = {
          id: data.id,
          email: data.email || user?.email || '',
          name: data.name || '',
          phone: data.phone || '',
          address: data.address || '',
          avatar_url: data.avatar_url,
          role: user?.app_metadata?.role as 'admin' | 'editor' | 'user' || 'user',
          preferredContactMethod: data.preferredcontactmethod as 'phone' | 'telegram' | 'whatsapp',
          // Convert any JSON array to an array of strings
          savedAddresses: Array.isArray(data.savedaddresses) 
            ? data.savedaddresses.map(item => String(item))
            : [],
          telegramNickname: data.telegramnickname || ''
        };
        
        setProfile(userProfile);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };
  
  // Update user profile
  const updateProfile = async (profileData: UserProfileUpdate): Promise<boolean> => {
    try {
      if (!user) return false;
      
      const updates = {
        id: user.id,
        name: profileData.name,
        phone: profileData.phone,
        address: profileData.address,
        preferredcontactmethod: profileData.preferredContactMethod,
        telegramnickname: profileData.telegramNickname,
        savedaddresses: profileData.savedAddresses,
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('profiles')
        .upsert(updates);
        
      if (error) {
        console.error("Error updating profile:", error);
        return false;
      }
      
      // Update local profile state
      if (profile) {
        setProfile({
          ...profile,
          name: profileData.name || profile.name,
          phone: profileData.phone || profile.phone,
          address: profileData.address || profile.address,
          preferredContactMethod: profileData.preferredContactMethod || profile.preferredContactMethod,
          telegramNickname: profileData.telegramNickname || profile.telegramNickname,
          savedAddresses: profileData.savedAddresses || profile.savedAddresses
        });
      }
      
      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      return false;
    }
  };

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

  // Create a wrapper for register that adapts the parameter format
  const register = async (email: string, password: string, name?: string) => {
    const metadata = name ? { name } : undefined;
    return await signupWithEmail(email, password, metadata);
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
      if (!user) return false;
      
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: user.id,
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

  const value: AuthContextType = {
    session,
    user,
    profile,
    loading,
    isLoading: loading, // Alias for loading
    loginWithEmail,
    login: loginWithEmail, // Alias for loginWithEmail
    logout,
    register, // Use the wrapper function
    isAuthenticated: !!session,
    updatePassword,
    updateEmail,
    sendPasswordResetEmail,
    resetPassword,
    signupWithEmail,
    hasRole,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
