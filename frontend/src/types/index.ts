export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'support_worker';
  is_active: boolean;
  created_at: Date;
}

export interface Participant {
  id: string;
  ndis_number: string;
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  email?: string;
  phone_number?: string;
  address_street?: string;
  address_suburb?: string;
  address_state?: string;
  address_postcode?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  status: 'active' | 'inactive' | 'suspended';
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ServiceAgreement {
  id: string;
  participant_id: string;
  template_id: string;
  status: 'draft' | 'pending_review' | 'approved' | 'executed' | 'archived';
  start_date: string;
  end_date?: string;
  approval_date?: string;
  approved_by?: string;
  document_path?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
