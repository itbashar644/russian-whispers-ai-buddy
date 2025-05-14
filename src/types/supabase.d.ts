
import { type SupabaseClient, Provider } from '@supabase/supabase-js';

declare module '@supabase/supabase-js' {
  interface SupabaseAuthClient {
    signInWithIdToken(options: {
      provider: 'yandex';
      token: string;
    }): Promise<{
      data: { user: User | null; session: Session | null };
      error: Error | null;
    }>;
  }
}

// Add 'oauth' as a valid Provider type
declare module '@supabase/supabase-js' {
  export interface AuthOptions {
    authorizationUrl?: string;
  }

  // Extend Provider type with 'oauth'
  export type Provider = 
    | 'apple' 
    | 'azure' 
    | 'bitbucket' 
    | 'discord' 
    | 'facebook' 
    | 'github' 
    | 'gitlab' 
    | 'google' 
    | 'keycloak' 
    | 'linkedin' 
    | 'notion' 
    | 'slack' 
    | 'spotify' 
    | 'twitch' 
    | 'twitter' 
    | 'workos'
    | 'zoom'
    | 'oauth'
    | 'yandex';
}

export {};
