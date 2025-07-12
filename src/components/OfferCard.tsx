
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Offer } from '@/types';

interface OfferCardProps {
  offer: Offer;
}

export default function OfferCard({ offer }: OfferCardProps) {
  const isExpired = new Date(offer.expiryDate) < new Date();
  const discount = offer.originalPrice > 0 
    ? Math.round(((offer.originalPrice - offer.discountedPrice) / offer.originalPrice) * 100)
    : 0;

  return (
    <div className="card hover:shadow-lg transition-all duration-300">
      <Link href={`/offer/${offer.id}`}>
        <div className="relative">
          {offer.imageUrl && (
            <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
              <Image
                src={offer.imageUrl}
                alt={offer.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          
          {discount > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
              {discount}% OFF
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
            {offer.title}
          </h3>
          
          <p className="text-gray-600 text-sm line-clamp-2">
            {offer.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-green-600">
                ₹{offer.discountedPrice}
              </span>
              {offer.originalPrice > offer.discountedPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{offer.originalPrice}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <span>📍</span>
              <span>{offer.city}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>⏰</span>
              <span>
                {isExpired ? 'Expired' : `Until ${new Date(offer.expiryDate).toLocaleDateString()}`}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {offer.category}
            </span>
            {isExpired && (
              <span className="text-red-500 text-xs font-medium">Expired</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
