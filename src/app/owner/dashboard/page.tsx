
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, doc, getDoc, setDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Business, Offer, CATEGORIES } from '@/types';
import Navbar from '@/components/Navbar';

export default function OwnerDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [business, setBusiness] = useState<Business | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [showBusinessForm, setShowBusinessForm] = useState(false);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Business form state
  const [businessForm, setBusinessForm] = useState({
    name: '',
    phone: '',
    website: '',
    whatsappNumber: '',
  });

  // Offer form state
  const [offerForm, setOfferForm] = useState({
    title: '',
    description: '',
    category: '',
    expiryDate: '',
    image: null as File | null,
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (user.role !== 'owner') {
      router.push('/');
      return;
    }

    fetchBusinessData();
  }, [user, router]);

  const fetchBusinessData = async () => {
    if (!user) return;

    try {
      // Fetch business
      const businessDoc = await getDoc(doc(db, 'businesses', user.userId));
      if (businessDoc.exists()) {
        setBusiness(businessDoc.data() as Business);
      } else {
        setShowBusinessForm(true);
      }

      // Fetch offers
      const offersQuery = query(
        collection(db, 'offers'),
        where('businessId', '==', user.userId)
      );
      const offersSnapshot = await getDocs(offersQuery);
      const offersData = offersSnapshot.docs.map(doc => ({
        offerId: doc.id,
        ...doc.data()
      } as Offer));
      setOffers(offersData);
    } catch (error) {
      console.error('Error fetching business data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBusinessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const whatsappLink = businessForm.whatsappNumber 
        ? `https://wa.me/${businessForm.whatsappNumber.replace(/\D/g, '')}?text=Hi%2C%20I%20saw%20your%20deal%20on%20LocalDeal`
        : '';

      const businessData: Business = {
        businessId: user.userId,
        name: businessForm.name,
        city: user.city,
        phone: businessForm.phone,
        website: businessForm.website || undefined,
        whatsappLink,
        ownerId: user.userId,
      };

      await setDoc(doc(db, 'businesses', user.userId), businessData);
      setBusiness(businessData);
      setShowBusinessForm(false);
    } catch (error) {
      console.error('Error saving business:', error);
    }
  };

  const handleOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !business) return;

    try {
      let imageUrl = '';
      
      if (offerForm.image) {
        const imageRef = ref(storage, `offers/${Date.now()}_${offerForm.image.name}`);
        await uploadBytes(imageRef, offerForm.image);
        imageUrl = await getDownloadURL(imageRef);
      }

      const offerData = {
        title: offerForm.title,
        description: offerForm.description,
        imageUrl,
        businessId: user.userId,
        city: user.city,
        category: offerForm.category,
        expiryDate: offerForm.expiryDate,
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'offers'), offerData);
      setShowOfferForm(false);
      setOfferForm({
        title: '',
        description: '',
        category: '',
        expiryDate: '',
        image: null,
      });
      fetchBusinessData();
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  };

  const handleDeleteOffer = async (offerId: string) => {
    if (confirm('Are you sure you want to delete this offer?')) {
      try {
        await deleteDoc(doc(db, 'offers', offerId));
        fetchBusinessData();
      } catch (error) {
        console.error('Error deleting offer:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Business Dashboard</h1>
          
          {!business || showBusinessForm ? (
            <div className="card max-w-2xl">
              <h2 className="text-xl font-semibold mb-4">
                {business ? 'Edit Business Profile' : 'Set Up Your Business Profile'}
              </h2>
              
              <form onSubmit={handleBusinessSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={businessForm.name}
                    onChange={(e) => setBusinessForm({...businessForm, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={businessForm.phone}
                    onChange={(e) => setBusinessForm({...businessForm, phone: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website (optional)
                  </label>
                  <input
                    type="url"
                    value={businessForm.website}
                    onChange={(e) => setBusinessForm({...businessForm, website: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp Number (optional)
                  </label>
                  <input
                    type="tel"
                    value={businessForm.whatsappNumber}
                    onChange={(e) => setBusinessForm({...businessForm, whatsappNumber: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., +1234567890"
                  />
                </div>
                
                <div className="flex gap-4">
                  <button type="submit" className="btn-primary">
                    {business ? 'Update Business' : 'Save Business'}
                  </button>
                  {business && (
                    <button
                      type="button"
                      onClick={() => setShowBusinessForm(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          ) : (
            <div className="card max-w-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{business.name}</h2>
                  <p className="text-gray-600">📞 {business.phone}</p>
                  {business.website && (
                    <p className="text-gray-600">🌐 {business.website}</p>
                  )}
                  {business.whatsappLink && (
                    <p className="text-gray-600">💬 WhatsApp enabled</p>
                  )}
                </div>
                <button
                  onClick={() => setShowBusinessForm(true)}
                  className="btn-secondary"
                >
                  Edit
                </button>
              </div>
            </div>
          )}
        </div>

        {business && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Offers</h2>
              <button
                onClick={() => setShowOfferForm(true)}
                className="btn-primary"
              >
                Add New Offer
              </button>
            </div>

            {showOfferForm && (
              <div className="card max-w-2xl mb-8">
                <h3 className="text-xl font-semibold mb-4">Create New Offer</h3>
                
                <form onSubmit={handleOfferSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={offerForm.title}
                      onChange={(e) => setOfferForm({...offerForm, title: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={offerForm.description}
                      onChange={(e) => setOfferForm({...offerForm, description: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={offerForm.category}
                      onChange={(e) => setOfferForm({...offerForm, category: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a category</option>
                      {CATEGORIES.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={offerForm.expiryDate}
                      onChange={(e) => setOfferForm({...offerForm, expiryDate: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image (optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setOfferForm({...offerForm, image: e.target.files?.[0] || null})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <button type="submit" className="btn-primary">
                      Create Offer
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowOfferForm(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map(offer => (
                <div key={offer.offerId} className="card">
                  <h3 className="text-lg font-semibold mb-2">{offer.title}</h3>
                  <p className="text-gray-600 mb-2">{offer.description}</p>
                  <div className="text-sm text-gray-500 mb-4">
                    Category: {offer.category} | Expires: {new Date(offer.expiryDate).toLocaleDateString()}
                  </div>
                  <button
                    onClick={() => handleDeleteOffer(offer.offerId)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>

            {offers.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No offers yet. Create your first offer to get started!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
