import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

/**
 * Reusable Loading Spinner Component
 */
const LoadingSpinner = ({ message = 'Loading...', color = '#0066cc' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={color} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  message: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
});

export default LoadingSpinner;
