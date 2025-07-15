
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Offer } from '@/types';

interface OfferCardProps {
  offer: Offer;
}

export default function OfferCard({ offer }: OfferCardProps) {
  const [imageError, setImageError] = useState(false);

  const discountPercentage = Math.round(
    ((offer.originalPrice - offer.discountedPrice) / offer.originalPrice) * 100
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Link href={`/offer/${offer.id}`} className="block group touch-manipulation">
      <div className="mobile-card mobile-card-interactive group-active:shadow-lg group-active:border-blue-200 transition-all duration-200">
        <div className="relative h-48 bg-gradient-to-br from-blue-50 to-purple-50">
          {offer.imageUrl && !imageError ? (
            <img
              src={offer.imageUrl}
              alt={offer.title}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-5xl">🎯</div>
            </div>
          )}

          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-2 rounded-full text-sm font-bold shadow-lg">
            {discountPercentage}% OFF
          </div>

          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-2 rounded-full text-xs font-medium">
            {offer.category}
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-bold text-mobile-lg text-gray-900 mb-3 line-clamp-2 group-active:text-blue-600 transition-colors">
            {offer.title}
          </h3>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {offer.description}
          </p>

          <div className="flex items-center mb-4 text-sm text-gray-500">
            <span className="mr-2">🏪</span>
            <span className="font-medium">{offer.businessName}</span>
            <span className="mx-2">•</span>
            <span>{offer.businessCity}</span>
          </div>

          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-3">
              <span className="text-2xl font-bold text-green-600">
                ₹{offer.discountedPrice.toLocaleString()}
              </span>
              <span className="text-gray-400 line-through text-base">
                ₹{offer.originalPrice.toLocaleString()}
              </span>
            </div>
            <div className="text-xs text-green-700 bg-green-50 px-3 py-2 rounded-lg font-medium">
              Save ₹{(offer.originalPrice - offer.discountedPrice).toLocaleString()}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg flex items-center">
              <span className="mr-1">⏰</span>
              Valid until {formatDate(offer.validUntil)}
            </div>
            <div className="text-blue-600 text-sm font-medium group-active:underline">
              View Details →
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
