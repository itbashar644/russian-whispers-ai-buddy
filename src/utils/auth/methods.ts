
import { UserProfile } from "@/types/auth";
import { loadUserProfile } from "./profile";
import { 
  signInWithEmail, 
  signUpWithEmail, 
  signOut, 
  getSession 
} from "./authService";
import { 
  resetPassword, 
  updatePassword, 
  updateEmail 
} from "./passwordService";
import { 
  updateUserProfile, 
  checkUserRole 
} from "./profileService";

// Added export for the authMethods object with all required methods
export const authMethods = {
  // Authentication methods
  login: async (email: string, password: string): Promise<boolean> => {
    const { data, error } = await signInWithEmail(email, password);
    return !error && !!data;
  },
  
  register: async (email: string, password: string, name: string): Promise<boolean> => {
    const { data, error } = await signUpWithEmail(email, password);
    
    if (error) return false;
    
    if (data.user) {
      // Update profile with name after successful registration
      try {
        await updateUserProfile({ name }, data.user.id);
        return true;
      } catch (err) {
        console.error("Error updating profile:", err);
        return !!data.user; // Return true even if profile update fails
      }
    }
    
    return false;
  },
  
  logout: async (): Promise<void> => {
    await signOut();
    window.location.href = '/';
  },
  
  // Profile methods
  updateProfile: async (
    userData: Partial<UserProfile>,
    setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>,
    currentProfile: UserProfile | null
  ): Promise<boolean> => {
    if (!currentProfile?.id) return false;
    
    const success = await updateUserProfile(userData, currentProfile.id);
    
    if (success && setProfile && currentProfile) {
      // Update local state
      setProfile({
        ...currentProfile,
        ...userData
      });
    }
    
    return success;
  },
  
  // Password management
  resetPassword,
  updatePassword,
  
  // Email management
  updateEmail,
  
  // Role management
  hasRole: async (
    role: 'admin' | 'editor' | 'user',
    user: any,
    userRoles: string[],
    setUserRoles: React.Dispatch<React.SetStateAction<string[]>>
  ): Promise<boolean> => {
    // Check if we have the role in our local state first
    if (userRoles.includes(role)) {
      return true;
    }
    
    // If not, check from the database
    if (!user?.id) return false;
    
    const hasRole = await checkUserRole(user.id, role);
    
    // Update local cache if role found
    if (hasRole && !userRoles.includes(role)) {
      setUserRoles([...userRoles, role]);
    }
    
    return hasRole;
  }
};

// Re-export individual services for direct use
export * from "./authService";
export * from "./passwordService";
export * from "./profileService";
