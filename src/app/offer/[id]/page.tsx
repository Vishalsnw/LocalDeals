'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Offer, Business } from '@/types';
import Navbar from '@/components/Navbar';
import Image from 'next/image';

export default function OfferDetails() {
  const params = useParams();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOfferDetails();
  }, [params.id]);

  const fetchOfferDetails = async () => {
    try {
      const offerDoc = await getDoc(doc(db, 'offers', params.id as string));

      if (offerDoc.exists()) {
        const offerData = { id: offerDoc.id, ...offerDoc.data() } as Offer;
        setOffer(offerData);

        // Fetch business details
        if (offerData.businessId) {
          const businessDoc = await getDoc(doc(db, 'businesses', offerData.businessId));
          if (businessDoc.exists()) {
            setBusiness({ id: businessDoc.id, ...businessDoc.data() } as Business);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching offer details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppClick = (whatsappNumber: string) => {
    if (whatsappNumber) {
      const cleanNumber = whatsappNumber.replace(/\D/g, '');
      const message = encodeURIComponent(`Hi! I'm interested in your offer: ${offer?.title}`);
      const whatsappUrl = `https://wa.me/${cleanNumber}?text=${message}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Offer Not Found</h1>
            <p className="text-gray-600">The offer you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const expiryDate = offer.validUntil || offer.expiryDate;
  const isExpired = expiryDate ? new Date(expiryDate) < new Date() : false;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {offer.imageUrl && (
            <div className="relative h-64 w-full">
              <Image
                src={offer.imageUrl}
                alt={offer.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{offer.title}</h1>
              {offer.discount && (
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-lg font-medium">
                  {offer.discount}% OFF
                </span>
              )}
            </div>

            <p className="text-gray-600 mb-6 text-lg">{offer.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Pricing</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Original Price:</span>
                    <span className="line-through text-gray-500">₹{offer.originalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discounted Price:</span>
                    <span className="text-green-600 font-bold text-xl">₹{offer.discountedPrice}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Details</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Valid Until:</span> {expiryDate ? new Date(expiryDate).toLocaleDateString() : 'N/A'}</p>
                  <p><span className="font-medium">Category:</span> {offer.category}</p>
                  <p><span className="font-medium">Location:</span> {offer.location}</p>
                  {isExpired && (
                    <p className="text-red-600 font-medium">⚠️ This offer has expired</p>
                  )}
                </div>
              </div>
            </div>

            {business && (
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Business Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p><span className="font-medium">Business Name:</span> {business.name}</p>
                    <p><span className="font-medium">Address:</span> {business.address}</p>
                    <p><span className="font-medium">City:</span> {business.city}</p>
                  </div>
                  <div>
                    {business.phone && (
                      <p><span className="font-medium">Phone:</span> {business.phone}</p>
                    )}
                    {business.email && (
                      <p><span className="font-medium">Email:</span> {business.email}</p>
                    )}
                  </div>
                </div>

                {business.whatsappNumber && (
                  <div className="mt-4">
                    <button
                      onClick={() => handleWhatsAppClick(business.whatsappNumber!)}
                      className="whatsapp-btn"
                    >
                      <span>📱</span>
                      Contact via WhatsApp
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}