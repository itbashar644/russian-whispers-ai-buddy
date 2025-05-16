
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { formatAuthError } from "./errorFormatter";
import { hashPassword, verifyPassword } from "./passwordUtils";
import { createUserProfile, updateUserProfile } from "./profile";
import { handleGuestCheckout } from "./guestCheckout";

/**
 * Register a new user
 */
export async function register(email: string, password: string, name?: string) {
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
}

export { formatAuthError } from "./errorFormatter";
export { hashPassword, verifyPassword } from "./passwordUtils";
export { createUserProfile, updateUserProfile } from "./profile";
export { handleGuestCheckout } from "./guestCheckout";
