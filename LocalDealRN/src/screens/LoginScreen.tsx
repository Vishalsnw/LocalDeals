
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useAuth} from '../contexts/AuthContext';
import {INDIAN_CITIES} from '../types';

export default function LoginScreen() {
  const {signInAnonymously, updateUserRole} = useAuth();
  const [selectedRole, setSelectedRole] = useState<'user' | 'owner'>('user');
  const [selectedCity, setSelectedCity] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGetStarted = async () => {
    if (!selectedCity) {
      Alert.alert('Error', 'Please select your city');
      return;
    }

    setLoading(true);
    try {
      await signInAnonymously();
      await updateUserRole(selectedRole, selectedCity, 'User');
    } catch (error) {
      console.error('Error during setup:', error);
      Alert.alert('Error', 'Failed to set up your account. Please try again.');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#4F46E5" barStyle="light-content" />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.emoji}>🏪</Text>
          <Text style={styles.title}>LocalDeal</Text>
          <Text style={styles.subtitle}>Discover Amazing Local Deals</Text>
          <Text style={styles.description}>
            Connect with trusted businesses in your neighborhood
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>I am a:</Text>
          <View style={styles.roleButtons}>
            <TouchableOpacity
              style={[styles.roleButton, selectedRole === 'user' && styles.roleButtonActive]}
              onPress={() => setSelectedRole('user')}>
              <Text style={[styles.roleButtonText, selectedRole === 'user' && styles.roleButtonTextActive]}>
                🛍️ Customer
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleButton, selectedRole === 'owner' && styles.roleButtonActive]}
              onPress={() => setSelectedRole('owner')}>
              <Text style={[styles.roleButtonText, selectedRole === 'owner' && styles.roleButtonTextActive]}>
                🏢 Business Owner
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Select Your City:</Text>
          <Picker
            selectedValue={selectedCity}
            onValueChange={(value) => setSelectedCity(value)}
            style={styles.picker}>
            <Picker.Item label="Choose your city..." value="" />
            {INDIAN_CITIES.map((city, index) => (
              <Picker.Item
                key={index}
                label={`${city.name}, ${city.state}`}
                value={city.name}
              />
            ))}
          </Picker>

          <TouchableOpacity
            style={[styles.getStartedButton, loading && styles.buttonDisabled]}
            onPress={handleGetStarted}
            disabled={loading}>
            <Text style={styles.getStartedButtonText}>
              {loading ? 'Setting up...' : '🚀 Get Started'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            Start discovering deals in your city
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4F46E5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: 'white',
    opacity: 0.9,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: 'white',
    opacity: 0.8,
    textAlign: 'center',
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  roleButtonActive: {
    borderColor: '#4F46E5',
    backgroundColor: '#4F46E5',
  },
  roleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  roleButtonTextActive: {
    color: 'white',
  },
  picker: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginBottom: 24,
  },
  getStartedButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  getStartedButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerText: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 14,
  },
});
