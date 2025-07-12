
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
      const message = encodeURIComponent(`Hi! I'm interested in your offer: ${offer.title}`);
      const whatsappUrl = `https://wa.me/${cleanNumber}?text=${message}`;
      window.open(whatsappUrl, '_blank');
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
            className="btn-primary flex-1 text-center"
          >
            View Details
          </Link>
          
          {offer.whatsappNumber && (
            <button
              onClick={() => handleWhatsAppClick(offer.whatsappNumber!)}
              className="whatsapp-btn flex-1"
            >
              <span>📱</span>
              WhatsApp
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
