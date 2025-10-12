import React, { useEffect } from 'react';
import { View } from 'react-native';
import { requestAppPermissions } from '../../utils/permissions';
import { CommonActions } from '@react-navigation/native';

/**
 * Permission Request Screen
 * Completely blank - only shows sequential permission dialogs
 */
const PermissionRequest = ({ route, navigation }) => {
  const { role } = route.params;

  useEffect(() => {
    const requestPermissionsAndNavigate = async () => {
      try {
        console.log('🔐 Starting automatic permission requests...');
        
        // Request all permissions sequentially
        const results = await requestAppPermissions();
        
        console.log('✅ All permissions completed:', results);
      } catch (error) {
        console.error('❌ Permission error:', error);
      } finally {
        // Always navigate to app regardless of permission results
        console.log('🚀 Navigating to main app...');
        navigateToApp();
      }
    };

    requestPermissionsAndNavigate();
  }, []);

  const navigateToApp = () => {
    if (role === 'citizen') {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'CitizenApp' }],
        })
      );
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'NgoApp' }],
        })
      );
    }
  };

  // Return completely empty transparent view
  return <View style={{ flex: 1, backgroundColor: 'transparent' }} />;
};

export default PermissionRequest;