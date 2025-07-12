
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Offer } from '@/types';

interface OfferCardProps {
  offer: Offer;
}

export default function OfferCard({ offer }: OfferCardProps) {
  const discount = Math.round(((offer.originalPrice - offer.discountedPrice) / offer.originalPrice) * 100);
  const expiryDate = offer.validUntil || offer.expiryDate;
  const isExpired = expiryDate ? new Date(expiryDate) < new Date() : false;

  return (
    <div className="card card-hover">
      <Link href={`/offer/${offer.id}`} className="block">
        <div className="space-y-4">
          <div className="relative">
            {offer.imageUrl ? (
              <Image
                src={offer.imageUrl}
                alt={offer.title}
                width={400}
                height={200}
                className="w-full h-48 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-4xl">🏪</span>
              </div>
            )}

          {discount > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
              {discount}% OFF
            </div>
          )}
          </div>

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
              <span>{offer.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>⏰</span>
              <span>
                {isExpired ? 'Expired' : expiryDate ? `Until ${new Date(expiryDate).toLocaleDateString()}` : 'No expiry'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {offer.category}
            </span>
            <div className="flex items-center space-x-2">
              {isExpired && (
                <span className="text-red-500 text-xs font-medium">Expired</span>
              )}
              <span className="text-green-600 text-xs flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                WhatsApp
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
