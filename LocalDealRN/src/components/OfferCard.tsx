
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Offer {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  discount?: number;
  category: string;
  location: string;
  validUntil: string;
  businessName?: string;
  whatsappNumber?: string;
  phoneNumber?: string;
}

interface OfferCardProps {
  offer: Offer;
  onPress: () => void;
}

export default function OfferCard({offer, onPress}: OfferCardProps) {
  const handleWhatsApp = () => {
    if (offer.whatsappNumber) {
      const url = `whatsapp://send?phone=${offer.whatsappNumber}&text=Hi, I'm interested in your offer: ${offer.title}`;
      Linking.openURL(url).catch(() => {
        Alert.alert('Error', 'WhatsApp is not installed on your device');
      });
    }
  };

  const handleCall = () => {
    if (offer.phoneNumber) {
      Linking.openURL(`tel:${offer.phoneNumber}`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN');
  };

  const discountPercentage = offer.discount || 
    Math.round(((offer.originalPrice - offer.discountedPrice) / offer.originalPrice) * 100);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{discountPercentage}% OFF</Text>
        </View>
        <Text style={styles.category}>{offer.category}</Text>
      </View>

      <Text style={styles.title}>{offer.title}</Text>
      <Text style={styles.description} numberOfLines={2}>{offer.description}</Text>
      
      {offer.businessName && (
        <Text style={styles.businessName}>📍 {offer.businessName}</Text>
      )}

      <View style={styles.priceContainer}>
        <Text style={styles.originalPrice}>₹{offer.originalPrice}</Text>
        <Text style={styles.discountedPrice}>₹{offer.discountedPrice}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.validUntil}>Valid until {formatDate(offer.validUntil)}</Text>
        
        <View style={styles.actionButtons}>
          {offer.whatsappNumber && (
            <TouchableOpacity style={styles.whatsappButton} onPress={handleWhatsApp}>
              <Icon name="chat" size={16} color="white" />
            </TouchableOpacity>
          )}
          {offer.phoneNumber && (
            <TouchableOpacity style={styles.callButton} onPress={handleCall}>
              <Icon name="phone" size={16} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  discountBadge: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  category: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  businessName: {
    fontSize: 14,
    color: '#4f46e5',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  originalPrice: {
    fontSize: 14,
    color: '#9ca3af',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  discountedPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#059669',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  validUntil: {
    fontSize: 12,
    color: '#6b7280',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  whatsappButton: {
    backgroundColor: '#25d366',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callButton: {
    backgroundColor: '#3b82f6',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
