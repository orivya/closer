// Database types for Supabase tables

export interface DatabaseService {
  id: string;
  engineer_id: string;
  name: string;
  slug: string;
  description: string;
  base_price: number;
  turnaround_days: number;
  revision_count: number;
  extra_revision_price: number;
  features: string[]; // JSONB array
  delivery_formats: string[]; // JSONB array
  requirements: string | null;
  terms_conditions: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseServiceAddon {
  id: string;
  service_id: string;
  name: string;
  description: string | null;
  price: number;
  created_at: string;
}

export interface DatabaseTurnaroundOption {
  id: string;
  service_id: string;
  name: string;
  days: number;
  price_multiplier: number;
  is_default: boolean;
  created_at: string;
}

export interface DatabaseOrder {
  id: string;
  order_number: string;
  engineer_id: string;
  client_id: string;
  service_id: string;
  base_price: number;
  addons_total: number;
  platform_fee: number;
  total: number;
  engineer_payout: number;
  status: 'pending' | 'paid' | 'in_progress' | 'completed' | 'cancelled' | 'refunded';
  turnaround_option_id: string | null;
  selected_addons: string[] | null; // Array of addon IDs
  client_name: string;
  client_email: string;
  project_details: string | null;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

// Composite types for frontend use
export interface ServiceWithDetails extends DatabaseService {
  addons: DatabaseServiceAddon[];
  turnaround_options: DatabaseTurnaroundOption[];
}
