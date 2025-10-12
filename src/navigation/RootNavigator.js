import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native'; // Added Text import
import AuthNavigator from './AuthNavigator';
import CitizenNavigator from './CitizenNavigator';
import NgoNavigator from './NgoNavigator';
import PermissionRequest from '../screens/Permissions/PermissionRequest';
import { useAuth } from '../contexts/AuthContext';

const Stack = createStackNavigator();

/**
 * Root Navigator - Determines which navigation stack to show
 * based on user authentication status and role
 */
const RootNavigator = () => {
  const { user, isLoading } = useAuth();

  console.log('RootNavigator - Current user:', user);
  console.log('RootNavigator - Loading state:', isLoading);

  // Show loading indicator while checking auth state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        // User is not logged in - show auth flow
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        // User is logged in - check if permissions are granted
        // For now, directly show the main app based on role
        // You can add permission check logic here if needed
        user.role === 'citizen' ? (
          <Stack.Screen name="CitizenApp" component={CitizenNavigator} />
        ) : (
          <Stack.Screen name="NgoApp" component={NgoNavigator} />
        )
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
});

export default RootNavigator;