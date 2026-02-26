export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      submissions: {
        Row: {
          id: string;
          name: string;
          lastname: string;
          email: string;
          answer: string;
          created_at: string;
          immediate_email_sent_at: string | null;
          results_email_sent_at: string | null;
          reminder_email_sent_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          lastname: string;
          email: string;
          answer: string;
          created_at?: string;
          immediate_email_sent_at?: string | null;
          results_email_sent_at?: string | null;
          reminder_email_sent_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          lastname?: string;
          email?: string;
          answer?: string;
          created_at?: string;
          immediate_email_sent_at?: string | null;
          results_email_sent_at?: string | null;
          reminder_email_sent_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
