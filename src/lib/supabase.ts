import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase credentials - database features will not work');
}

// Client for browser (anon key)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder_key'
);

// Client for server (service role key)
export const supabaseServer = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseServiceKey || supabaseAnonKey || 'placeholder_key'
);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          auth0_id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          plan: string;
          stripe_customer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          auth0_id: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          plan?: string;
          stripe_customer_id?: string | null;
        };
        Update: {
          name?: string | null;
          avatar_url?: string | null;
          plan?: string;
          stripe_customer_id?: string | null;
          updated_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_subscription_id: string | null;
          plan: string;
          status: string;
          current_period_start: string | null;
          current_period_end: string | null;
          canceled_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          stripe_subscription_id?: string | null;
          plan: string;
          status: string;
          current_period_start?: string | null;
          current_period_end?: string | null;
        };
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          name: string;
          description: string | null;
          config: Record<string, any>;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          type: string;
          name: string;
          description?: string | null;
          config?: Record<string, any>;
          status?: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          resource_type: string | null;
          resource_id: string | null;
          details: Record<string, any>;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          user_id?: string | null;
          action: string;
          resource_type?: string | null;
          resource_id?: string | null;
          details?: Record<string, any>;
          ip_address?: string | null;
          user_agent?: string | null;
        };
      };
    };
  };
};
