import { Platform, PermissionsAndroid } from 'react-native';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';

/**
 * Helper function to add delay between permission requests
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Request individual permission and return boolean
 */
export const requestIndividualPermissionBoolean = async (permissionType) => {
  try {
    if (Platform.OS === 'android') {
      let permission;
      let rationale = {};

      switch (permissionType) {
        case 'location':
          permission = PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;
          rationale = {
            title: 'Location Access',
            message: 'WaveAlert needs location access to tag incident locations accurately',
            buttonPositive: 'Allow',
            buttonNegative: 'Deny',
          };
          break;

        case 'camera':
          permission = PermissionsAndroid.PERMISSIONS.CAMERA;
          rationale = {
            title: 'Camera Access',
            message: 'WaveAlert needs camera access to capture photos of flood incidents',
            buttonPositive: 'Allow',
            buttonNegative: 'Deny',
          };
          break;

        case 'storage':
          if (Platform.Version >= 33) {
            // Android 13+ - request media permissions
            const imageResult = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
              {
                title: 'Media Access',
                message: 'WaveAlert needs access to your photos for incident reporting',
                buttonPositive: 'Allow',
                buttonNegative: 'Deny',
              }
            );
            
            await delay(300);
            
            const videoResult = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
              {
                title: 'Media Access',
                message: 'WaveAlert needs access to your videos for incident reporting',
                buttonPositive: 'Allow',
                buttonNegative: 'Deny',
              }
            );
            
            return (
              imageResult === PermissionsAndroid.RESULTS.GRANTED &&
              videoResult === PermissionsAndroid.RESULTS.GRANTED
            );
          } else {
            // Android < 13 - request storage permission
            permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
            rationale = {
              title: 'Storage Access',
              message: 'WaveAlert needs storage access to save and upload incident photos',
              buttonPositive: 'Allow',
              buttonNegative: 'Deny',
            };
          }
          break;

        case 'notifications':
          if (Platform.Version >= 33) {
            permission = PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS;
            rationale = {
              title: 'Notifications',
              message: 'Receive flood alerts and emergency updates',
              buttonPositive: 'Allow',
              buttonNegative: 'Deny',
            };
          } else {
            // Auto-granted on older Android
            return true;
          }
          break;

        default:
          return false;
      }

      if (!permission) return false;

      const result = await PermissionsAndroid.request(permission, rationale);
      return result === PermissionsAndroid.RESULTS.GRANTED;

    } else {
      // iOS permissions
      let permission;
      
      switch (permissionType) {
        case 'location':
          permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
          break;
        case 'camera':
          permission = PERMISSIONS.IOS.CAMERA;
          break;
        case 'storage':
          permission = PERMISSIONS.IOS.PHOTO_LIBRARY;
          break;
        case 'notifications':
          permission = PERMISSIONS.IOS.NOTIFICATIONS;
          break;
        default:
          return false;
      }

      const result = await request(permission);
      return result === RESULTS.GRANTED;
    }
  } catch (error) {
    console.error(`❌ Error requesting ${permissionType}:`, error);
    return false;
  }
};

/**
 * Request multiple permissions ONE AT A TIME with delays
 * Returns object with permission statuses
 */
export const requestAppPermissions = async () => {
  try {
    const permissionOrder = ['location', 'camera', 'storage', 'notifications'];
    const results = {};

    for (const permType of permissionOrder) {
      console.log(`🔐 Requesting ${permType} permission...`);
      
      const granted = await requestIndividualPermissionBoolean(permType);
      results[permType] = granted;
      
      console.log(`📋 ${permType} permission: ${granted ? 'GRANTED ✅' : 'DENIED ❌'}`);
      
      // Add delay between permission requests to ensure proper dialog display
      await delay(500);
    }

    console.log('🎯 All permission results:', results);
    return results;
    
  } catch (err) {
    console.error('💥 Error in requestAppPermissions:', err);
    return null;
  }
};

/**
 * Individual permission functions for backward compatibility
 */
export const requestCameraPermission = async () => {
  return requestIndividualPermissionBoolean('camera');
};

export const requestLocationPermission = async () => {
  return requestIndividualPermissionBoolean('location');
};

export const requestStoragePermission = async () => {
  return requestIndividualPermissionBoolean('storage');
};

export const requestNotificationPermission = async () => {
  return requestIndividualPermissionBoolean('notifications');
};