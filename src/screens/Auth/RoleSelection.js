import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

/**
 * Role Selection Screen
 * User selects between Citizen or NGO role
 */
const RoleSelection = ({ navigation }) => {
  const handleRoleSelect = (role) => {
    navigation.navigate('Login', { role });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Role</Text>
      <Text style={styles.subtitle}>Select how you want to use FloodSafe</Text>

      <View style={styles.rolesContainer}>
        <TouchableOpacity
          style={[styles.roleCard, styles.citizenCard]}
          onPress={() => handleRoleSelect('citizen')}
        >
          <Icon name="account" size={80} color="#0066cc" />
          <Text style={styles.roleTitle}>Citizen</Text>
          <Text style={styles.roleDescription}>
            Report incidents, receive alerts, and track relief resources
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.roleCard, styles.ngoCard]}
          onPress={() => handleRoleSelect('ngo')}
        >
          <Icon name="hands-pray" size={80} color="#00a86b" />
          <Text style={styles.roleTitle}>NGO</Text>
          <Text style={styles.roleDescription}>
            Manage relief operations, track resources, and coordinate response
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>
        Your selection will determine the features available to you
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  rolesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  roleCard: {
    width: width * 0.42,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  citizenCard: {
    borderColor: '#0066cc',
    borderWidth: 2,
  },
  ngoCard: {
    borderColor: '#00a86b',
    borderWidth: 2,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
  },
  roleDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
  footer: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default RoleSelection;
