export interface User {
  userId: string;
  name: string;
  email: string;
  role: 'user' | 'owner';
  city: string;
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
  whatsappLink?: string;
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
  validUntil: string;
  category: string;
  location: string;
  imageUrl?: string;
  whatsappNumber?: string;
  businessId: string;
  createdAt: string;
  expiryDate?: string;
}

export interface City {
  id: string;
  name: string;
  state: string;
  isCustom?: boolean;
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
  { name: 'Surat', state: 'Gujarat' },
  { name: 'Jaipur', state: 'Rajasthan' },
  { name: 'Lucknow', state: 'Uttar Pradesh' },
  { name: 'Kanpur', state: 'Uttar Pradesh' },
  { name: 'Nagpur', state: 'Maharashtra' },
  { name: 'Indore', state: 'Madhya Pradesh' },
  { name: 'Thane', state: 'Maharashtra' },
  { name: 'Bhopal', state: 'Madhya Pradesh' },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh' },
  { name: 'Vadodara', state: 'Gujarat' },
  { name: 'Firozabad', state: 'Uttar Pradesh' },
  { name: 'Ludhiana', state: 'Punjab' },
  { name: 'Rajkot', state: 'Gujarat' },
  { name: 'Agra', state: 'Uttar Pradesh' },
  { name: 'Siliguri', state: 'West Bengal' },
  { name: 'Nashik', state: 'Maharashtra' },
  { name: 'Faridabad', state: 'Haryana' },
  { name: 'Patiala', state: 'Punjab' },
  { name: 'Ghaziabad', state: 'Uttar Pradesh' },
  { name: 'Ludhiana', state: 'Punjab' },
  { name: 'Coimbatore', state: 'Tamil Nadu' },
  { name: 'Madurai', state: 'Tamil Nadu' },
  { name: 'Jabalpur', state: 'Madhya Pradesh' },
  { name: 'Kochi', state: 'Kerala' },
  { name: 'Jodhpur', state: 'Rajasthan' },
  { name: 'Guwahati', state: 'Assam' },
  { name: 'Chandigarh', state: 'Chandigarh' },
  { name: 'Thiruvananthapuram', state: 'Kerala' },
  { name: 'Solapur', state: 'Maharashtra' },
  { name: 'Hubballi-Dharwad', state: 'Karnataka' },
  { name: 'Bareilly', state: 'Uttar Pradesh' },
  { name: 'Moradabad', state: 'Uttar Pradesh' },
  { name: 'Mysore', state: 'Karnataka' },
  { name: 'Gurgaon', state: 'Haryana' },
  { name: 'Aligarh', state: 'Uttar Pradesh' },
  { name: 'Jalandhar', state: 'Punjab' },
  { name: 'Tiruchirappalli', state: 'Tamil Nadu' },
  { name: 'Bhubaneswar', state: 'Odisha' },
  { name: 'Salem', state: 'Tamil Nadu' },
  { name: 'Warangal', state: 'Telangana' },
  { name: 'Mira-Bhayandar', state: 'Maharashtra' },
  { name: 'Guntur', state: 'Andhra Pradesh' }
];