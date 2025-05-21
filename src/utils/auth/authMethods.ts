
import { supabase } from "@/integrations/supabase/client";
import { AuthResult, PasswordUpdateResult, ResetPasswordParams } from "./types";

/**
 * Logs a user in with email and password
 */
export const loginWithEmail = async (
  email: string,
  password: string
): Promise<AuthResult> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (e) {
    console.error("Login exception:", e);
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    return { success: false, error: errorMessage };
  }
};

/**
 * Logs a user out
 */
export const logout = async (): Promise<AuthResult> => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (e) {
    console.error("Logout exception:", e);
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    return { success: false, error: errorMessage };
  }
};

/**
 * Updates a user's password
 */
export const updatePassword = async (
  newPassword: string
): Promise<PasswordUpdateResult> => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error("Password update error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, message: "Password updated successfully" };
  } catch (e) {
    console.error("Password update exception:", e);
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    return { success: false, error: errorMessage };
  }
};

/**
 * Sends a password reset email
 */
export const sendPasswordResetEmail = async (
  email: string
): Promise<AuthResult> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
     redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      console.error("Reset password error:", error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      message: "Password reset instructions sent to your email",
    };
  } catch (e) {
    console.error("Reset password exception:", e);
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    return { success: false, error: errorMessage };
  }
};

/**
 * Reset user password with token
 */
export const resetPassword = async ({
  accessToken,
  password,
}: ResetPasswordParams): Promise<AuthResult> => {
  try {
    // Check if we have an access token
    if (!accessToken) {
      return { 
        success: false, 
        error: "No access token provided" 
      };
    }

    // Update the user's password
    const { data, error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      console.error("Password reset error:", error);
      return { 
        success: false, 
        error: error.message 
      };
    }

    return { 
      success: true,
      message: "Password successfully reset. You can now log in with your new password." 
    };
  } catch (e) {
    console.error("Password reset exception:", e);
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    return { 
      success: false, 
      error: errorMessage 
    };
  }
};

/**
 * Signs up a new user with email and password
 */
export const signupWithEmail = async (
  email: string,
  password: string,
  metadata?: { name?: string }
): Promise<AuthResult> => {
  try {
    // Проверка, существует ли уже пользователь с таким email
    const { data: existingUsers } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email)
      .maybeSingle();
    
    if (existingUsers) {
      return { 
        success: false, 
        error: "This email is already registered. Please log in instead.", 
        isExistingUser: true 
      };
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });

    if (error) {
      console.error("Signup error:", error);
      return { success: false, error: error.message };
    }

    // Проверяем, не существует ли уже пользователь (через identities)
    if (data.user?.identities?.length === 0) {
      return { 
        success: false, 
        error: "This email is already registered. Please log in instead.", 
        isExistingUser: true 
      };
    }

    return { 
      success: true,
      message: "Registration successful. Please check your email to confirm your account."
    };
  } catch (e) {
    console.error("Signup exception:", e);
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    return { success: false, error: errorMessage };
  }
};

// Export all auth methods
export const authMethods = {
  loginWithEmail,
  logout,
  updatePassword,
  sendPasswordResetEmail,
  resetPassword,
  signupWithEmail,
};

export default authMethods;
