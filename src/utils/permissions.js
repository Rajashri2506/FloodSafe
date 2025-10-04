import { Platform, PermissionsAndroid, Alert } from 'react-native';
import { PERMISSIONS, request, requestMultiple, RESULTS } from 'react-native-permissions';

/**
 * Request multiple permissions for Android and iOS
 * @returns {Promise<Object>} Object with permission statuses
 */
export const requestAppPermissions = async () => {
  if (Platform.OS === 'android') {
    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      ];

      const granted = await PermissionsAndroid.requestMultiple(permissions);

      return {
        camera: granted[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED,
        location: granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED,
        storage: granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED,
        notifications: granted[PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS] === PermissionsAndroid.RESULTS.GRANTED,
      };
    } catch (err) {
      console.warn(err);
      return null;
    }
  } else {
    try {
      const permissions = [
        PERMISSIONS.IOS.CAMERA,
        PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        PERMISSIONS.IOS.PHOTO_LIBRARY,
        PERMISSIONS.IOS.NOTIFICATIONS,
      ];

      const statuses = await requestMultiple(permissions);

      return {
        camera: statuses[PERMISSIONS.IOS.CAMERA] === RESULTS.GRANTED,
        location: statuses[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] === RESULTS.GRANTED,
        storage: statuses[PERMISSIONS.IOS.PHOTO_LIBRARY] === RESULTS.GRANTED,
        notifications: statuses[PERMISSIONS.IOS.NOTIFICATIONS] === RESULTS.GRANTED,
      };
    } catch (err) {
      console.warn(err);
      return null;
    }
  }
};

/**
 * Request camera permission
 */
export const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera Permission',
        message: 'FloodSafe needs access to your camera to capture incident photos.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } else {
    const result = await request(PERMISSIONS.IOS.CAMERA);
    return result === RESULTS.GRANTED;
  }
};

/**
 * Request location permission
 */
export const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'FloodSafe needs access to your location to tag incident reports.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } else {
    const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    return result === RESULTS.GRANTED;
  }
};
