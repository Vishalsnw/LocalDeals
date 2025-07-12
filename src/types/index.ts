
export interface User {
  userId: string;
  name: string;
  email: string;
  role: 'user' | 'owner';
  city: string;
}

export interface Business {
  businessId: string;
  name: string;
  city: string;
  phone: string;
  website?: string;
  whatsappLink: string;
  ownerId: string;
}

export interface Offer {
  offerId: string;
  title: string;
  description: string;
  imageUrl: string;
  businessId: string;
  city: string;
  category: string;
  expiryDate: string;
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
  'Other'
];
