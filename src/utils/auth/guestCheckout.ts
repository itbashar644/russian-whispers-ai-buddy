
import { supabase } from "@/integrations/supabase/client";
import { generatePassword } from "./passwordUtils";
import { toast } from "sonner";

// Function to register a guest user and place an order
export async function registerGuestUser(email: string, name: string): Promise<{
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

    // Wait a short time to ensure the user is created in the database
    await new Promise(resolve => setTimeout(resolve, 500));

    // Send welcome email with password
    await sendWelcomeEmail(email, name, password);
    
    return {
      success: true,
      userId: data.user?.id,
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
