
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { formatAuthError } from "./errorFormatter";
import { authMethods } from "./authMethods";

// Re-export the auth methods
export const register = authMethods.signupWithEmail;
export const login = authMethods.loginWithEmail;
export const logout = authMethods.logout;
export const updatePassword = authMethods.updatePassword;
export const resetPassword = authMethods.resetPassword;
export const sendPasswordResetEmail = authMethods.sendPasswordResetEmail;

// Re-export from other files
export { formatAuthError } from "./errorFormatter";
export { hashPassword, verifyPassword, generatePassword } from "./passwordUtils";
export { createUserProfile, updateUserProfile } from "./profile";
export { handleGuestCheckout } from "./guestCheckout";
