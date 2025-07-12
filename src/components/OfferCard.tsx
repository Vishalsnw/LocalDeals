
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Offer } from '@/types';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiTag, FiClock } from 'react-icons/fi';

interface OfferCardProps {
  offer: Offer;
  index?: number;
}

export default function OfferCard({ offer, index = 0 }: OfferCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const isExpiringSoon = () => {
    const expiryDate = new Date(offer.expiryDate);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays > 0;
  };

  const isExpired = () => {
    const expiryDate = new Date(offer.expiryDate);
    const today = new Date();
    return expiryDate < today;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group"
    >
      <Link href={`/offer/${offer.offerId}`}>
        <div className="floating-card card-hover relative overflow-hidden">
          {/* Status badges */}
          <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
            {isExpired() && (
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                Expired
              </span>
            )}
            {isExpiringSoon() && !isExpired() && (
              <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium animate-pulse">
                Expires Soon
              </span>
            )}
          </div>

          {/* Image container */}
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={offer.imageUrl || '/placeholder-offer.jpg'}
              alt={offer.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                {offer.title}
              </h3>
              <div className="category-badge ml-2 flex-shrink-0">
                <FiTag className="w-3 h-3 mr-1" />
                {offer.category}
              </div>
            </div>

            <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
              {offer.description}
            </p>

            {/* Footer info */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <FiMapPin className="w-4 h-4 text-blue-600" />
                  <span>{offer.city}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FiCalendar className="w-4 h-4 text-green-600" />
                  <span>Until {formatDate(offer.expiryDate)}</span>
                </div>
              </div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="offer-badge"
              >
                View Deal
              </motion.div>
            </div>
          </div>

          {/* Hover effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>
      </Link>
    </motion.div>
  );
}
