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
      const message = encodeURIComponent(`Hi! I'm interested in your offer: ${offer?.title} - Original Price: ₹${offer?.originalPrice}, Discounted Price: ₹${offer?.discountedPrice}`);
      const whatsappUrl = `https://wa.me/${cleanNumber}?text=${message}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleShare = async () => {
    if (!offer) return;
    
    const shareData = {
      title: offer.title,
      text: `Check out this amazing deal: ${offer.title} - ${offer.discount}% OFF! Original Price: ₹${offer.originalPrice}, Now: ₹${offer.discountedPrice}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(`${shareData.text} - ${shareData.url}`);
          alert('Deal copied to clipboard!');
        } catch (err) {
          console.log('Error copying to clipboard:', err);
        }
      }
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

                <div className="mt-4 flex gap-4">
                  {business.whatsappNumber && (
                    <button
                      onClick={() => handleWhatsAppClick(business.whatsappNumber!)}
                      className="whatsapp-btn"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                      Contact via WhatsApp
                    </button>
                  )}
                  
                  <button
                    onClick={handleShare}
                    className="share-btn"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31-2.92-2.92z"/>
                    </svg>
                    Share Deal
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}