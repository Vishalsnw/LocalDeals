
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Offer } from '@/types';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiTag, FiClock } from 'react-icons/fi';

interface OfferCardProps {
  offer: Offer;
}

export default function OfferCard({ offer }: OfferCardProps) {
  const discount = Math.round(((offer.originalPrice - offer.discountedPrice) / offer.originalPrice) * 100);
  const expiryDate = offer.validUntil || offer.expiryDate;
  const isExpired = expiryDate ? new Date(expiryDate) < new Date() : false;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="card card-hover"
    >
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
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-green-600">₹{offer.discountedPrice}</span>
                <span className="text-sm text-gray-500 line-through">₹{offer.originalPrice}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <FiMapPin className="text-gray-400 text-sm" />
                <span className="text-sm text-gray-600">{offer.location}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <FiCalendar className="text-gray-400 text-sm" />
              <span className="text-sm text-gray-600">
                {isExpired ? 'Expired' : `Expires ${expiryDate ? new Date(expiryDate).toLocaleDateString() : 'N/A'}`}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <FiTag className="text-gray-400 text-sm" />
              <span className="text-sm text-gray-600">{offer.category}</span>
            </div>
          </div>

          {isExpired && (
            <div className="mt-2 p-2 bg-red-50 rounded-lg">
              <p className="text-red-600 text-sm font-medium">This offer has expired</p>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
