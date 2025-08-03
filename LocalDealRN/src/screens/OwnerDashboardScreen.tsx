
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, StatusBar} from 'react-native';
import {useAuth} from '../contexts/AuthContext';

export default function OwnerDashboardScreen() {
  const {signOut} = useAuth();

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#4F46E5" barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Business Dashboard</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Welcome to your dashboard!</Text>
        <Text style={styles.subtitle}>
          Here you can manage your business and create offers.
        </Text>
        
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Add New Offer</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Manage Business</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.signOutButton]} onPress={signOut}>
          <Text style={[styles.buttonText, styles.signOutButtonText]}>Sign Out</Text>
        </TouchableOpacity>
      </View>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  signOutButton: {
    backgroundColor: '#ef4444',
    marginTop: 30,
  },
  signOutButtonText: {
    color: 'white',
  },
});
