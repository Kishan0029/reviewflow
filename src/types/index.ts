export interface Profile {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface Business {
  id: string;
  owner_id: string;
  name: string;
  plan: 'free' | 'pro';
  created_at: string;
}

export interface Location {
  id: string;
  business_id: string;
  name: string;
  google_place_id: string;
  qr_slug: string;
  created_at: string;
}

export interface Feedback {
  id: string;
  location_id: string;
  rating: number;
  comment: string | null;
  issues: string[] | null;
  customer_phone: string | null;
  resolved: boolean;
  created_at: string;
  // joined field
  locations?: { name: string; business_id: string };
}
