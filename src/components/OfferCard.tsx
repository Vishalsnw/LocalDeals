
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Offer } from '@/types';

interface OfferCardProps {
  offer: Offer;
}

export default function OfferCard({ offer }: OfferCardProps) {
  const isExpired = offer.validUntil ? new Date(offer.validUntil) < new Date() : false;

  const handleWhatsAppClick = (whatsappNumber: string) => {
    if (whatsappNumber) {
      // Remove any non-numeric characters and format for WhatsApp
      const cleanNumber = whatsappNumber.replace(/\D/g, '');
      const message = encodeURIComponent(`Hi! I'm interested in your offer: ${offer.title} - Original Price: ₹${offer.originalPrice}, Discounted Price: ₹${offer.discountedPrice}`);
      const whatsappUrl = `https://wa.me/${cleanNumber}?text=${message}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: offer.title,
      text: `Check out this amazing deal: ${offer.title} - ${offer.discount}% OFF! Original Price: ₹${offer.originalPrice}, Now: ₹${offer.discountedPrice}`,
      url: `${window.location.origin}/offer/${offer.id}`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
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

  return (
    <div className="card card-hover">
      <div className="space-y-4">
        {offer.imageUrl && (
          <div className="relative h-48 w-full rounded-lg overflow-hidden">
            <Image
              src={offer.imageUrl}
              alt={offer.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
              {offer.title}
            </h3>
            {offer.discount && (
              <span className="offer-badge">
                {offer.discount}% OFF
              </span>
            )}
          </div>

          <p className="text-gray-600 text-sm line-clamp-3">
            {offer.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-green-600">
                ₹{offer.discountedPrice}
              </span>
              {offer.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{offer.originalPrice}
                </span>
              )}
            </div>
            <span className="city-badge">
              {offer.location}
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <span>📅</span>
            <span className="ml-1">
              Valid until: {offer.validUntil ? new Date(offer.validUntil).toLocaleDateString() : 'N/A'}
            </span>
          </div>

          {isExpired && (
            <div className="text-red-600 text-sm font-medium">
              ⚠️ This offer has expired
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Link
            href={`/offer/${offer.id}`}
            className="btn-primary flex-1 text-center text-sm py-2"
          >
            View Details
          </Link>
          
          {offer.whatsappNumber && (
            <button
              onClick={() => handleWhatsAppClick(offer.whatsappNumber!)}
              className="whatsapp-btn flex-1 text-sm py-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              WhatsApp
            </button>
          )}

          <button
            onClick={handleShare}
            className="share-btn flex-1 text-sm py-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
            </svg>
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
