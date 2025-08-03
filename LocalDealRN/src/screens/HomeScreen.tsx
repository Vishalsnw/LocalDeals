
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  FlatList,
  Alert,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useAuth} from '../contexts/AuthContext';
import OfferCard from '../components/OfferCard';
import {CATEGORIES, INDIAN_CITIES} from '../types';
import firestore from '@react-native-firebase/firestore';

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
  imageUrl?: string;
  businessName?: string;
  whatsappNumber?: string;
  phoneNumber?: string;
}

export default function HomeScreen({navigation}: any) {
  const {user} = useAuth();
  const [selectedCity, setSelectedCity] = useState(user?.city || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    {label: 'All Categories', value: ''},
    ...CATEGORIES.map(cat => ({label: cat, value: cat}))
  ];

  const fetchOffers = async () => {
    if (!selectedCity) return;
    
    setLoading(true);
    try {
      let query = firestore()
        .collection('offers')
        .where('location', '==', selectedCity)
        .orderBy('createdAt', 'desc');

      if (selectedCategory) {
        query = query.where('category', '==', selectedCategory);
      }

      const snapshot = await query.get();
      const offersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Offer[];

      setOffers(offersData);
    } catch (error) {
      console.error('Error fetching offers:', error);
      // Use demo data if Firebase fails
      setOffers([
        {
          id: '1',
          title: '50% Off Pizza',
          description: 'Delicious Italian pizza with fresh ingredients',
          originalPrice: 500,
          discountedPrice: 250,
          discount: 50,
          category: 'Food & Dining',
          location: selectedCity,
          validUntil: '2024-12-31',
          businessName: 'Mario\'s Pizzeria',
          phoneNumber: '+91 9876543210'
        },
        {
          id: '2',
          title: '30% Off Gym Membership',
          description: 'Get fit with our state-of-the-art equipment',
          originalPrice: 2000,
          discountedPrice: 1400,
          discount: 30,
          category: 'Fitness & Health',
          location: selectedCity,
          validUntil: '2024-12-31',
          businessName: 'FitZone Gym',
          phoneNumber: '+91 9876543211'
        }
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (selectedCity) {
      fetchOffers();
    }
  }, [selectedCity, selectedCategory]);

  const filteredOffers = offers.filter(offer =>
    offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.businessName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!selectedCity) {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#4F46E5" barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>LocalDeal</Text>
          <Text style={styles.headerSubtitle}>Choose Your City</Text>
        </View>
        
        <View style={styles.citySelector}>
          <Text style={styles.sectionTitle}>Select your city to find local deals</Text>
          <Picker
            selectedValue={selectedCity}
            onValueChange={(value) => setSelectedCity(value)}
            style={styles.picker}>
            <Picker.Item label="Choose a city..." value="" />
            {INDIAN_CITIES.map((city, index) => (
              <Picker.Item
                key={index}
                label={`${city.name}, ${city.state}`}
                value={city.name}
              />
            ))}
          </Picker>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#4F46E5" barStyle="light-content" />
      
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>LocalDeal</Text>
          <TouchableOpacity onPress={() => setSelectedCity('')}>
            <Text style={styles.cityText}>{selectedCity}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search deals, businesses..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
        
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(value) => setSelectedCategory(value)}
          style={styles.categoryPicker}>
          {categories.map((category) => (
            <Picker.Item key={category.value} label={category.label} value={category.value} />
          ))}
        </Picker>
      </View>

      <FlatList
        data={filteredOffers}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <OfferCard
            offer={item}
            onPress={() => navigation.navigate('OfferDetail', {offerId: item.id})}
          />
        )}
        contentContainerStyle={styles.offersList}
        refreshing={loading}
        onRefresh={fetchOffers}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="local-offer" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No deals found</Text>
            <Text style={styles.emptySubtext}>
              Check back later for new offers in {selectedCity}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#4F46E5',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
  },
  cityText: {
    color: 'white',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  citySelector: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  picker: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 10,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  categoryPicker: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  offersList: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
});
