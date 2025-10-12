import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

/**
 * Reusable Empty State Component
 */
const EmptyState = ({ 
  icon = 'inbox-outline', 
  title = 'No Data', 
  message = 'Nothing to show here',
  iconSize = 80,
  iconColor = '#ccc',
}) => {
  return (
    <View style={styles.container}>
      <Icon name={icon} size={iconSize} color={iconColor} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 20,
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

export default EmptyState;
