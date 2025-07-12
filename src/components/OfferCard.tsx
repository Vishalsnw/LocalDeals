
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Offer } from '@/types';

interface OfferCardProps {
  offer: Offer;
}

export default function OfferCard({ offer }: OfferCardProps) {
  const isExpired = new Date(offer.expiryDate) < new Date();
  
  return (
    <div className={`card ${isExpired ? 'opacity-60' : ''}`}>
      {offer.imageUrl && (
        <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
          <Image
            src={offer.imageUrl}
            alt={offer.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-900">{offer.title}</h3>
        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
          {offer.category}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-3">{offer.description}</p>
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Expires: {new Date(offer.expiryDate).toLocaleDateString()}
        </div>
        <Link
          href={`/offer/${offer.offerId}`}
          className="btn-primary text-sm"
        >
          View Details
        </Link>
      </div>
      
      {isExpired && (
        <div className="mt-2 text-red-500 text-sm font-medium">
          This offer has expired
        </div>
      )}
    </div>
  );
}
