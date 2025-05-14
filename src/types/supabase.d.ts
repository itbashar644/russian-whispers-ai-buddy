
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
  interface Provider {
    'oauth': 'oauth';
  }
}

export {};
