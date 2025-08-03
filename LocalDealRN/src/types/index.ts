
export interface User {
  userId: string;
  name: string;
  email: string;
  role: 'user' | 'owner';
  city: string;
  createdAt: Date;
}

export interface Business {
  id: string;
  name: string;
  description: string;
  address: string;
  city?: string;
  location?: string;
  phone?: string;
  email?: string;
  website?: string;
  whatsappNumber?: string;
  category?: string;
  imageUrl?: string;
  ownerId: string;
  ownerName?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  discount?: number;
  category: string;
  location: string;
  validUntil: string;
  imageUrl?: string;
  businessId: string;
  businessName?: string;
  whatsappNumber?: string;
  phoneNumber?: string;
  createdAt: string;
}

export const CATEGORIES = [
  'Food & Dining',
  'Fitness & Health',
  'Shopping',
  'Entertainment',
  'Services',
  'Beauty & Spa',
  'Automotive',
  'Education',
  'Healthcare',
  'Fashion',
  'Electronics',
  'Travel & Tourism',
  'Real Estate',
  'Other'
];

export const INDIAN_CITIES = [
  { name: 'Mumbai', state: 'Maharashtra' },
  { name: 'Delhi', state: 'Delhi' },
  { name: 'Bangalore', state: 'Karnataka' },
  { name: 'Hyderabad', state: 'Telangana' },
  { name: 'Chennai', state: 'Tamil Nadu' },
  { name: 'Kolkata', state: 'West Bengal' },
  { name: 'Pune', state: 'Maharashtra' },
  { name: 'Ahmedabad', state: 'Gujarat' },
  { name: 'Jaipur', state: 'Rajasthan' },
  { name: 'Surat', state: 'Gujarat' },
  { name: 'Lucknow', state: 'Uttar Pradesh' },
  { name: 'Kanpur', state: 'Uttar Pradesh' },
  { name: 'Nagpur', state: 'Maharashtra' },
  { name: 'Indore', state: 'Madhya Pradesh' },
  { name: 'Bhopal', state: 'Madhya Pradesh' },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh' },
  { name: 'Vadodara', state: 'Gujarat' },
  { name: 'Ludhiana', state: 'Punjab' },
  { name: 'Agra', state: 'Uttar Pradesh' },
  { name: 'Nashik', state: 'Maharashtra' },
  { name: 'Faridabad', state: 'Haryana' },
  { name: 'Ghaziabad', state: 'Uttar Pradesh' },
  { name: 'Coimbatore', state: 'Tamil Nadu' },
  { name: 'Madurai', state: 'Tamil Nadu' },
  { name: 'Kochi', state: 'Kerala' },
  { name: 'Jodhpur', state: 'Rajasthan' },
  { name: 'Guwahati', state: 'Assam' },
  { name: 'Chandigarh', state: 'Chandigarh' },
  { name: 'Thiruvananthapuram', state: 'Kerala' },
  { name: 'Mysore', state: 'Karnataka' },
  { name: 'Gurgaon', state: 'Haryana' },
  { name: 'Jalandhar', state: 'Punjab' },
  { name: 'Bhubaneswar', state: 'Odisha' },
  { name: 'Salem', state: 'Tamil Nadu' }
];
