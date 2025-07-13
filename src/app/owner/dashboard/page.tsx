'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Business, Offer } from '@/types';
import Navbar from '@/components/Navbar';

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [business, setBusiness] = useState<Business | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [showBusinessForm, setShowBusinessForm] = useState(false);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [businessForm, setBusinessForm] = useState({
    name: '',
    description: '',
    phone: '',
    address: '',
    website: '',
    whatsappLink: '',
    category: ''
  });

  // Function to generate WhatsApp link from phone number
  const generateWhatsAppLink = (phone: string) => {
    if (!phone) return '';
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    // Add country code if not present (assuming India +91)
    const phoneWithCountryCode = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    return `https://wa.me/${phoneWithCountryCode}`;
  };

  // Auto-generate WhatsApp link when phone changes
  const handlePhoneChange = (phone: string) => {
    setBusinessForm({
      ...businessForm, 
      phone: phone,
      whatsappLink: generateWhatsAppLink(phone)
    });
  };

  const [offerForm, setOfferForm] = useState({
    title: '',
    description: '',
    originalPrice: 0,
    discountedPrice: 0,
    validUntil: '',
    category: '',
    imageFile: null as File | null
  });

  const categories = [
    'Food & Dining',
    'Shopping',
    'Entertainment',
    'Health & Beauty',
    'Services',
    'Travel',
    'Electronics',
    'Fashion',
    'Home & Garden',
    'Sports & Fitness'
  ];

  useEffect(() => {
    if (user) {
      fetchBusinessAndOffers();
    }
  }, [user]);

  const fetchBusinessAndOffers = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch business
      const businessQuery = query(
        collection(db, 'businesses'),
        where('ownerId', '==', user.userId)
      );
      const businessSnapshot = await getDocs(businessQuery);

      if (!businessSnapshot.empty) {
        const businessData = businessSnapshot.docs[0].data() as Business;
        setBusiness({ ...businessData, id: businessSnapshot.docs[0].id });
        setBusinessForm({
          name: businessData.name || '',
          description: businessData.description || '',
          phone: businessData.phone || '',
          address: businessData.address || '',
          website: businessData.website || '',
          whatsappLink: businessData.whatsappLink || '',
          category: businessData.category || ''
        });
      } else {
        setShowBusinessForm(true);
      }

      // Fetch offers
      const offersQuery = query(
        collection(db, 'offers'),
        where('ownerId', '==', user.userId)
      );
      const offersSnapshot = await getDocs(offersQuery);
      const offersData = offersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Offer[];

      setOffers(offersData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBusinessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setUploading(true);

      const businessData = {
        ...businessForm,
        ownerId: user.userId,
        ownerName: user.name,
        location: user.city,
        updatedAt: new Date().toISOString()
      };

      if (business?.id) {
        await updateDoc(doc(db, 'businesses', business.id), businessData);
        setBusiness({ ...businessData, id: business.id });
      } else {
        const docRef = await addDoc(collection(db, 'businesses'), {
          ...businessData,
          createdAt: new Date().toISOString()
        });
        setBusiness({ ...businessData, id: docRef.id });
      }

      setShowBusinessForm(false);
      alert('Business details saved successfully!');
    } catch (error) {
      console.error('Error saving business:', error);
      alert('Error saving business details. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !business) return;

    try {
      setUploading(true);

      let imageUrl = '';
      if (offerForm.imageFile) {
        const imageRef = ref(storage, `offers/${Date.now()}_${offerForm.imageFile.name}`);
        const snapshot = await uploadBytes(imageRef, offerForm.imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const discount = Math.round(((offerForm.originalPrice - offerForm.discountedPrice) / offerForm.originalPrice) * 100);

      const offerData = {
        title: offerForm.title,
        description: offerForm.description,
        originalPrice: offerForm.originalPrice,
        discountedPrice: offerForm.discountedPrice,
        discount: Math.round(((offerForm.originalPrice - offerForm.discountedPrice) / offerForm.originalPrice) * 100),
        validUntil: offerForm.validUntil,
        category: offerForm.category,
        businessId: business.id,
        businessName: business.name,
        location: business.location || user.city,
        imageUrl: imageUrl || '',
        ownerId: user.userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        expiryDate: offerForm.validUntil
      };

      if (editingOffer?.id) {
        await updateDoc(doc(db, 'offers', editingOffer.id), offerData);
      } else {
        await addDoc(collection(db, 'offers'), {
          ...offerData,
          createdAt: new Date().toISOString()
        });
      }

      setOfferForm({
        title: '',
        description: '',
        originalPrice: 0,
        discountedPrice: 0,
        validUntil: '',
        category: '',
        imageFile: null
      });
      setEditingOffer(null);
      setShowOfferForm(false);
      fetchBusinessAndOffers();
      alert(editingOffer ? 'Offer updated successfully!' : 'Offer created successfully!');
    } catch (error) {
      console.error('Error saving offer:', error);
      alert('Error saving offer. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteOffer = async (offerId: string) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;

    try {
      await deleteDoc(doc(db, 'offers', offerId));
      fetchBusinessAndOffers();
      alert('Offer deleted successfully!');
    } catch (error) {
      console.error('Error deleting offer:', error);
      alert('Error deleting offer. Please try again.');
    }
  };

  if (!user || user.role !== 'owner') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need to be a business owner to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mobile-app">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Dashboard</h1>
          <p className="text-gray-600">Manage your business and offers</p>
        </div>

        {/* Business Details Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Business Details</h2>
            {business && !showBusinessForm && (
              <button
                onClick={() => setShowBusinessForm(true)}
                className="btn-secondary"
              >
                Edit Business
              </button>
            )}
          </div>

          {showBusinessForm ? (
            <div className="card max-w-2xl">
              <form onSubmit={handleBusinessSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                  <input
                    type="text"
                    required
                    value={businessForm.name}
                    onChange={(e) => setBusinessForm({...businessForm, name: e.target.value})}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    required
                    value={businessForm.description}
                    onChange={(e) => setBusinessForm({...businessForm, description: e.target.value})}
                    className="input-field"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile number"
                      value={businessForm.phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      className="input-field"
                    />
                    <p className="text-xs text-gray-500 mt-1">WhatsApp link will be auto-generated</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      required
                      value={businessForm.category}
                      onChange={(e) => setBusinessForm({...businessForm, category: e.target.value})}
                      className="select-field"
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    required
                    value={businessForm.address}
                    onChange={(e) => setBusinessForm({...businessForm, address: e.target.value})}
                    className="input-field"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website (Optional)</label>
                    <input
                      type="url"
                      value={businessForm.website}
                      onChange={(e) => setBusinessForm({...businessForm, website: e.target.value})}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Link</label>
                    <input
                      type="url"
                      value={businessForm.whatsappLink}
                      onChange={(e) => setBusinessForm({...businessForm, whatsappLink: e.target.value})}
                      className="input-field bg-gray-50"
                      placeholder="Auto-generated from phone number"
                      readOnly
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {businessForm.whatsappLink ? '✅ WhatsApp link ready' : 'Enter phone number to generate'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    type="submit" 
                    disabled={uploading}
                    className="btn-primary disabled:opacity-50"
                  >
                    {uploading ? 'Saving...' : business ? 'Update Business' : 'Save Business'}
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
          ) : business ? (
            <div className="card max-w-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{business.name}</h2>
                  <p className="text-gray-600 mt-1">{business.description}</p>
                  <div className="mt-3 space-y-1">
                    <p className="text-gray-600">📞 {business.phone}</p>
                    <p className="text-gray-600">📍 {business.address}</p>
                    <p className="text-gray-600">🏷️ {business.category}</p>
                    {business.website && (
                      <p className="text-gray-600">🌐 <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{business.website}</a></p>
                    )}
                    {business.whatsappLink && (
                      <p className="text-gray-600">💬 <a href={business.whatsappLink} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">WhatsApp</a></p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Offers Section */}
        {business && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Your Offers</h2>
              <button
                onClick={() => {
                  setEditingOffer(null);
                  setOfferForm({
                    title: '',
                    description: '',
                    originalPrice: 0,
                    discountedPrice: 0,
                    validUntil: '',
                    category: '',
                    imageFile: null
                  });
                  setShowOfferForm(true);
                }}
                className="btn-primary"
              >
                Add New Offer
              </button>
            </div>

            {/* Offer Form */}
            {showOfferForm && (
              <div className="card max-w-2xl mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  {editingOffer ? 'Edit Offer' : 'Create New Offer'}
                </h3>

                <form onSubmit={handleOfferSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Offer Title</label>
                    <input
                      type="text"
                      required
                      value={offerForm.title}
                      onChange={(e) => setOfferForm({...offerForm, title: e.target.value})}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      required
                      value={offerForm.description}
                      onChange={(e) => setOfferForm({...offerForm, description: e.target.value})}
                      className="input-field"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (₹)</label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={offerForm.originalPrice}
                        onChange={(e) => setOfferForm({...offerForm, originalPrice: parseFloat(e.target.value) || 0})}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Discounted Price (₹)</label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={offerForm.discountedPrice}
                        onChange={(e) => setOfferForm({...offerForm, discountedPrice: parseFloat(e.target.value) || 0})}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Discount %</label>
                      <input
                        type="text"
                        disabled
                        value={offerForm.originalPrice > 0 ? Math.round(((offerForm.originalPrice - offerForm.discountedPrice) / offerForm.originalPrice) * 100) : 0}
                        className="input-field bg-gray-100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
                      <input
                        type="date"
                        required
                        value={offerForm.validUntil}
                        onChange={(e) => setOfferForm({...offerForm, validUntil: e.target.value})}
                        className="input-field"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        required
                        value={offerForm.category}
                        onChange={(e) => setOfferForm({...offerForm, category: e.target.value})}
                        className="select-field"
                      >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Offer Image (Optional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setOfferForm({...offerForm, imageFile: e.target.files?.[0] || null})}
                      className="input-field"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button 
                      type="submit" 
                      disabled={uploading}
                      className="btn-primary disabled:opacity-50"
                    >
                      {uploading ? 'Saving...' : editingOffer ? 'Update Offer' : 'Create Offer'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowOfferForm(false);
                        setEditingOffer(null);
                      }}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Offers List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map((offer) => (
                <div key={offer.id} className="card">
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold">{offer.title}</h3>
                      <p className="text-gray-600 text-sm">{offer.description}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Original Price:</span>
                        <span className="line-through text-gray-500">₹{offer.originalPrice}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Discounted Price:</span>
                        <span className="text-green-600 font-semibold">₹{offer.discountedPrice}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Discount:</span>
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                          {offer.discount}% OFF
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Valid Until:</span>
                        <span className="text-sm">{new Date(offer.validUntil).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Category:</span>
                        <span className="text-sm">{offer.category}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-3 border-t">
                      <button
                        onClick={() => {
                          setEditingOffer(offer);
                          setOfferForm({
                            title: offer.title,
                            description: offer.description,
                            originalPrice: offer.originalPrice,
                            discountedPrice: offer.discountedPrice,
                            validUntil: offer.validUntil,
                            category: offer.category,
                            imageFile: null
                          });
                          setShowOfferForm(true);
                        }}
                        className="btn-secondary flex-1 text-sm py-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteOffer(offer.id)}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-3 rounded-md transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {offers.length === 0 && !showOfferForm && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📢</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No offers yet</h3>
                <p className="text-gray-600 mb-4">Create your first offer to start attracting customers!</p>
                <button
                  onClick={() => setShowOfferForm(true)}
                  className="btn-primary"
                >
                  Create Your First Offer
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}