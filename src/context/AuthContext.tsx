
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { authMethods } from '@/utils/auth/authMethods';
import { AuthResult, PasswordUpdateResult, ResetPasswordParams, UserProfileUpdate } from '@/utils/auth/types';
import { UserProfile } from '@/types/auth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuthCore } from '@/hooks/useAuthCore';
import { useAuthMethods } from '@/hooks/useAuthMethods';

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
  const { session, user, loading, setSession, setUser } = useAuthCore();
  const { profile, setProfile, updateProfile } = useUserProfile(user);
  const { 
    loginWithEmail,
    logout,
    updatePassword,
    sendPasswordResetEmail,
    resetPassword,
    signupWithEmail, 
    hasRole,
    updateEmail
  } = useAuthMethods(setProfile);
  
  // Create a wrapper for register that adapts the parameter format
  const register = async (email: string, password: string, name?: string) => {
    const metadata = name ? { name } : undefined;
    return await signupWithEmail(email, password, metadata);
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
