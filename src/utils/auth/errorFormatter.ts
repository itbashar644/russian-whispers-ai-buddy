
import { AuthError } from "@supabase/supabase-js";

/**
 * Format auth error messages for user display
 */
export function formatAuthError(error: AuthError | Error): string {
  const errorMessage = error.message || "Unknown error";
  
  if (errorMessage.includes("Email not confirmed")) {
    return "Пожалуйста, подтвердите вашу электронную почту. Проверьте почтовый ящик и перейдите по ссылке из письма для подтверждения регистрации.";
  } else if (errorMessage.includes("Invalid login credentials")) {
    return "Неправильный email или пароль";
  } else if (errorMessage.includes("User already registered")) {
    return "Пользователь с этим email уже зарегистрирован";
  } else if (errorMessage.includes("Password should be at least")) {
    return "Пароль должен содержать не менее 6 символов";
  } else if (errorMessage.includes("rate limit")) {
    return "Слишком много попыток. Пожалуйста, попробуйте позже.";
  }
  
  return "Произошла ошибка авторизации";
}
