
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/auth";
import { toast } from "sonner";
import { formatAuthError } from "./errorFormatter";
import { createUserProfile, updateUserProfile } from "./profile";

/**
 * Auth methods for user authentication
 */
export const authMethods = {
  /**
   * Log in a user
   */
  async login(email: string, password: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        toast.error("Ошибка входа", { description: formatAuthError(error) });
        return false;
      }

      return !!data?.user;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Ошибка входа", {
        description: "Произошла неизвестная ошибка. Попробуйте снова позже.",
      });
      return false;
    }
  },

  /**
   * Register a new user
   */
  async register(email: string, password: string, name: string = ""): Promise<{ 
    success: boolean; 
    message?: string;
    isExistingUser?: boolean;
  }> {
    try {
      const { data: existingUser, error: checkError } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email)
        .single();

      if (existingUser) {
        return { 
          success: false, 
          message: "Пользователь с таким email уже существует",
          isExistingUser: true
        };
      }

      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            name: name,
          },
        },
      });

      if (error) {
        return { success: false, message: formatAuthError(error) };
      }

      // Create user profile
      if (data.user) {
        await createUserProfile({
          id: data.user.id,
          name: name || "",
          email: email,
        });
      }

      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, message: "Произошла ошибка при регистрации" };
    }
  },

  /**
   * Log out the current user
   */
  async logout(): Promise<void> {
    try {
      await supabase.auth.signOut();
      // Force page reload to clear any local state
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Ошибка выхода", {
        description: "Не удалось завершить сеанс. Попробуйте снова.",
      });
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(
    userData: Partial<UserProfile>, 
    setProfile: (profile: UserProfile) => void, 
    currentProfile: UserProfile | null
  ): Promise<boolean> {
    if (!currentProfile) {
      toast.error("Профиль не найден");
      return false;
    }

    try {
      const result = await updateUserProfile({
        ...userData,
        id: currentProfile.id,
      });

      if (!result.success) {
        toast.error("Ошибка обновления профиля");
        return false;
      }

      // Update local state with new profile data
      setProfile({
        ...currentProfile,
        ...userData,
      });

      toast.success("Профиль успешно обновлен");
      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Ошибка обновления профиля");
      return false;
    }
  },

  /**
   * Reset user password
   */
  async resetPassword(email: string): Promise<boolean> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        toast.error("Ошибка сброса пароля", { description: formatAuthError(error) });
        return false;
      }

      toast.success("Запрос на сброс пароля отправлен", {
        description: "Проверьте вашу электронную почту для дальнейших инструкций",
      });
      return true;
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("Ошибка сброса пароля");
      return false;
    }
  },

  /**
   * Update user password
   */
  async updatePassword(newPassword: string): Promise<boolean> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        toast.error("Ошибка обновления пароля", { description: formatAuthError(error) });
        return false;
      }

      toast.success("Пароль успешно обновлен");
      return true;
    } catch (error) {
      console.error("Update password error:", error);
      toast.error("Ошибка обновления пароля");
      return false;
    }
  },

  /**
   * Update user email
   */
  async updateEmail(newEmail: string): Promise<boolean> {
    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail,
      });

      if (error) {
        toast.error("Ошибка обновления email", { description: formatAuthError(error) });
        return false;
      }

      toast.success("Email успешно обновлен", {
        description: "Проверьте вашу электронную почту для подтверждения",
      });
      return true;
    } catch (error) {
      console.error("Update email error:", error);
      toast.error("Ошибка обновления email");
      return false;
    }
  },

  /**
   * Check if user has a specific role
   */
  async hasRole(
    role: 'admin' | 'editor' | 'user',
    user: any,
    userRoles: string[],
    setUserRoles: (roles: string[]) => void
  ): Promise<boolean> {
    // If roles already loaded, check them
    if (userRoles.length > 0) {
      return userRoles.includes(role);
    }

    // If no user, definitely not authorized
    if (!user) {
      return false;
    }

    try {
      // Get roles from the database
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error checking role:", error);
        return false;
      }

      // Update roles in state
      const roles = data.map((r) => r.role);
      setUserRoles(roles);

      return roles.includes(role);
    } catch (error) {
      console.error("Error checking user role:", error);
      return false;
    }
  }
};
