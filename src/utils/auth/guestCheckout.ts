
import { supabase } from "@/integrations/supabase/client";
import { generatePassword } from "./passwordUtils";
import { toast } from "sonner";

// Helper to wait until the profile record is created after sign up
async function waitForProfileCreation(userId: string, attempts = 10, delayMs = 500) {
  for (let i = 0; i < attempts; i++) {
    const { data } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single();
    if (data) {
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  return false;
}

// Function to register a guest user and place an order
export async function handleGuestCheckout(email: string, name: string): Promise<{
  success: boolean;
  userId?: string;
  password?: string;
  error?: any;
}> {
  try {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();
    
    // If user exists, return early
    if (existingUser) {
      return {
        success: true,
        userId: existingUser.id,
      };
    }

    // Generate a secure random password
    const password = generatePassword();
    
    // Create a new user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      }
    });

    if (error) {
      console.error("Error registering guest user:", error);
      return {
        success: false,
        error,
      };
    }

    const newUserId = data.user?.id;

    if (newUserId) {
      // Wait until the profile row is available to satisfy FK constraints
      await waitForProfileCreation(newUserId);
      
      // Sign the newly created user in so that subsequent requests
      // (like stock updates) are performed under an authenticated session
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        console.error('Error signing in guest user:', signInError);
      }
    }

    // Send welcome email with password
    await sendWelcomeEmail(email, name, password);
    
    return {
      success: true,
         userId: newUserId,
      password,
    };
  } catch (error) {
    console.error("Unexpected error registering guest user:", error);
    return {
      success: false,
      error,
    };
  }
}

// Function to send welcome email to guest users
async function sendWelcomeEmail(email: string, name: string, password: string): Promise<void> {
  // In a real application, you would use an email service like SendGrid, Mailgun, etc.
  // For now, we'll just log the message
  console.log(`Welcome email would be sent to ${email} with password ${password}`);
  
  // Placeholder for email sending functionality
  // This would be replaced with actual email sending code
  toast("Письмо с данными для входа отправлено на указанную почту");
}
