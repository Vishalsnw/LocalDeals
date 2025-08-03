
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {AuthProvider} from './src/contexts/AuthContext';
import HomeScreen from './src/screens/HomeScreen';
import OwnerDashboardScreen from './src/screens/OwnerDashboardScreen';
import LoginScreen from './src/screens/LoginScreen';
import OfferDetailScreen from './src/screens/OfferDetailScreen';
import {useAuth} from './src/contexts/AuthContext';
import {View, ActivityIndicator} from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function LoadingScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" color="#4F46E5" />
    </View>
  );
}

function MainTabs() {
  const {user} = useAuth();
  
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
          let iconName = 'home';
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Dashboard') iconName = 'business';
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      {user?.role === 'owner' && (
        <Tab.Screen name="Dashboard" component={OwnerDashboardScreen} />
      )}
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const {user, loading} = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {!user ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="OfferDetail" component={OfferDetailScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
