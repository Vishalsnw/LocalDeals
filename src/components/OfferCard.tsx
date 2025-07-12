'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Offer } from '@/types';

interface OfferCardProps {
  offer: Offer;
}

export default function OfferCard({ offer }: OfferCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="card hover:shadow-lg transition-all duration-300 animate-fadeIn">
      <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
        {offer.imageUrl ? (
          <Image
            src={offer.imageUrl}
            alt={offer.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <span className="text-6xl">🏪</span>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
          {offer.discount}% OFF
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{offer.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{offer.description}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>🏢</span>
            <span className="font-medium">{offer.businessName}</span>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>📍</span>
            <span>{offer.location}</span>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>📅</span>
            <span>Valid until {formatDate(offer.validUntil)}</span>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>⏰</span>
            <span>Posted at {formatTime(offer.createdAt)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center space-x-1">
            <span>🏷️</span>
            <span className="text-sm font-medium text-blue-600">{offer.category}</span>
          </div>

          <Link 
            href={`/offer/${offer.id}`}
            className="btn-primary text-sm py-2 px-4"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}