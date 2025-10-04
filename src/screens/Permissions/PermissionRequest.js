import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { requestAppPermissions } from '../../utils/permissions';
import { CommonActions } from '@react-navigation/native';

/**
 * Permission Request Screen
 * Requests necessary permissions before accessing dashboard
 */
const PermissionRequest = ({ route, navigation }) => {
  const { role } = route.params;
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState({
    camera: false,
    location: false,
    storage: false,
    notifications: false,
  });

  const roleColor = role === 'citizen' ? '#0066cc' : '#00a86b';

  const permissionsList = [
    {
      key: 'camera',
      icon: 'camera',
      title: 'Camera',
      description: 'To capture incident photos and videos',
    },
    {
      key: 'location',
      icon: 'map-marker',
      title: 'Location',
      description: 'To tag incident reports with your location',
    },
    {
      key: 'storage',
      icon: 'folder',
      title: 'Storage',
      description: 'To save and upload incident media',
    },
    {
      key: 'notifications',
      icon: 'bell',
      title: 'Notifications',
      description: 'To receive flood alerts and updates',
    },
  ];

  const handleRequestPermissions = async () => {
    setLoading(true);
    try {
      const result = await requestAppPermissions();
      
      if (result) {
        setPermissions(result);
        
        // Check if all permissions are granted
        const allGranted = Object.values(result).every(value => value === true);
        
        if (allGranted) {
          Alert.alert(
            'Success',
            'All permissions granted! You can now access the dashboard.',
            [
              {
                text: 'Continue',
                onPress: handleContinue,
              },
            ]
          );
        } else {
          Alert.alert(
            'Permissions Needed',
            'Some permissions were not granted. The app may not function properly.',
            [
              {
                text: 'Continue Anyway',
                onPress: handleContinue,
              },
              {
                text: 'Try Again',
                onPress: handleRequestPermissions,
              },
            ]
          );
        }
      } else {
        Alert.alert('Error', 'Failed to request permissions. Please try again.');
      }
    } catch (error) {
      console.error('Permission error:', error);
      Alert.alert('Error', 'An error occurred while requesting permissions.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    // Reset navigation to dashboard based on role
    // This forces a reload of RootNavigator which will check user status
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'IntroSlider' }],
      })
    );
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Permissions',
      'Are you sure you want to skip? Some features may not work properly.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Skip',
          onPress: handleContinue,
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="shield-check" size={80} color={roleColor} />
        <Text style={[styles.title, { color: roleColor }]}>
          Permissions Required
        </Text>
        <Text style={styles.subtitle}>
          FloodSafe needs the following permissions to work properly
        </Text>
      </View>

      <View style={styles.permissionsList}>
        {permissionsList.map((item) => (
          <View key={item.key} style={styles.permissionItem}>
            <View style={styles.permissionIcon}>
              <Icon name={item.icon} size={32} color={roleColor} />
            </View>
            <View style={styles.permissionContent}>
              <Text style={styles.permissionTitle}>{item.title}</Text>
              <Text style={styles.permissionDescription}>
                {item.description}
              </Text>
            </View>
            {permissions[item.key] && (
              <Icon name="check-circle" size={24} color="#00a86b" />
            )}
          </View>
        ))}
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: roleColor }]}
          onPress={handleRequestPermissions}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Icon name="lock-open" size={24} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Grant Permissions</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          disabled={loading}
        >
          <Text style={[styles.skipButtonText, { color: roleColor }]}>
            Skip for Now
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>
        You can change these permissions later in your device settings
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  permissionsList: {
    flex: 1,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  permissionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  permissionContent: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  permissionDescription: {
    fontSize: 14,
    color: '#666',
  },
  buttons: {
    marginTop: 20,
    marginBottom: 10,
  },
  button: {
    flexDirection: 'row',
    height: 55,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  skipButton: {
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default PermissionRequest;
