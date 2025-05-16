
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { authMethods } from '@/utils/auth/authMethods';
import { AuthResult, PasswordUpdateResult } from '@/utils/auth/types';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<AuthResult>;
  isAuthenticated: boolean;
  updatePassword: (newPassword: string) => Promise<PasswordUpdateResult>;
  sendPasswordResetEmail: (email: string) => Promise<AuthResult>;
  resetPassword: (params: { accessToken: string; password: string; }) => Promise<AuthResult>;
  signupWithEmail: (email: string, password: string, metadata?: { name?: string; }) => Promise<AuthResult>;
  hasRole: (roleName: string) => Promise<boolean>;
};

const defaultContext: AuthContextType = {
  session: null,
  user: null,
  loading: true,
  loginWithEmail: async () => ({ success: false }),
  logout: async () => ({ success: false }),
  isAuthenticated: false,
  updatePassword: async () => ({ success: false }),
  sendPasswordResetEmail: async () => ({ success: false }),
  resetPassword: async () => ({ success: false }),
  signupWithEmail: async () => ({ success: false }),
  hasRole: async () => false
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST to avoid missing events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Auth functions that use our authMethods
  const loginWithEmail = async (email: string, password: string) => {
    return await authMethods.loginWithEmail(email, password);
  };

  const logout = async () => {
    return await authMethods.logout();
  };

  const updatePassword = async (newPassword: string) => {
    return await authMethods.updatePassword(newPassword);
  };

  const sendPasswordResetEmail = async (email: string) => {
    return await authMethods.sendPasswordResetEmail(email);
  };

  const resetPassword = async ({ accessToken, password }: { accessToken: string; password: string }) => {
    return await authMethods.resetPassword({ accessToken, password });
  };

  const signupWithEmail = async (email: string, password: string, metadata?: { name?: string }) => {
    return await authMethods.signupWithEmail(email, password, metadata);
  };
  
  // Check if user has specific role
  const hasRole = async (roleName: string): Promise<boolean> => {
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

  const value = {
    session,
    user,
    loading,
    loginWithEmail,
    logout,
    isAuthenticated: !!session,
    updatePassword,
    sendPasswordResetEmail,
    resetPassword,
    signupWithEmail,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
