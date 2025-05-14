
import { type SupabaseClient } from '@supabase/supabase-js';

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

export {};
