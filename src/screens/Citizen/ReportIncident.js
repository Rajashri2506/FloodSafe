import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  PermissionsAndroid,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';
import { submitIncidentReport } from '../../api/incidentApi';

const ReportIncident = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [location, setLocation] = useState(null);
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission Required',
          message: 'This app needs access to your location to accurately report flood incidents.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setHasLocationPermission(true);
        getCurrentLocation();
      } else {
        Alert.alert(
          'Permission Required',
          'Location access is needed to report incidents. Please enable location permissions in settings.',
          [{ text: 'OK' }]
        );
      }
    } catch (err) {
      console.warn('Permission error:', err);
    }
  };

  const getCurrentLocation = () => {
    if (!hasLocationPermission) {
      requestLocationPermission();
      return;
    }

    setLocationLoading(true);
    
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setLocation({
          latitude,
          longitude,
          accuracy,
        });
        setLocationLoading(false);
      },
      (error) => {
        console.log('Location error:', error);
        setLocationLoading(false);
        
        let errorMessage = 'Unable to retrieve your current location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission was denied. Please enable it in settings.';
            setHasLocationPermission(false);
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable. Please check your GPS and network connection.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            break;
        }
        
        Alert.alert('Location Error', errorMessage);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 15000, 
        maximumAge: 10000 
      }
    );
  };

  const handleTakePhoto = () => {
    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1024,
        maxHeight: 1024,
      },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert('Error', 'Failed to capture photo');
          return;
        }
        if (response.assets && response.assets.length > 0) {
          setMedia(response.assets[0]);
        }
      }
    );
  };

  const handleChoosePhoto = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1024,
        maxHeight: 1024,
      },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert('Error', 'Failed to select photo');
          return;
        }
        if (response.assets && response.assets.length > 0) {
          setMedia(response.assets[0]);
        }
      }
    );
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Required Information', 'Please provide incident title and description');
      return;
    }

    if (!location) {
      Alert.alert('Location Required', 'Please wait for location to be fetched or try refreshing.');
      return;
    }

    setLoading(true);
    try {
      const incidentData = {
        title: title.trim(),
        description: description.trim(),
        severity,
        location,
        media: media ? media.uri : null,
        timestamp: new Date().toISOString(),
      };

      const result = await submitIncidentReport(incidentData);

      if (result.success) {
        Alert.alert('Report Submitted', 'Incident report has been submitted to authorities.', [
          {
            text: 'Continue',
            onPress: () => {
              setTitle('');
              setDescription('');
              setSeverity('medium');
              setMedia(null);
              getCurrentLocation();
            },
          },
        ]);
      } else {
        Alert.alert('Submission Failed', result.error || 'Please try again');
      }
    } catch (error) {
      Alert.alert('Connection Error', 'Unable to submit report. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const severityOptions = [
    { value: 'low', label: 'Low', color: '#F39C12' },
    { value: 'medium', label: 'Medium', color: '#E67E22' },
    { value: 'high', label: 'High', color: '#E74C3C' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Report Flood Incident</Text>
          <Text style={styles.headerSubtitle}>
            Provide detailed information to help emergency response
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>INCIDENT INFORMATION</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Incident Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="Brief description of the flood situation"
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Detailed Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Provide comprehensive details about water levels, affected areas, and immediate risks..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={500}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SEVERITY ASSESSMENT</Text>
          <View style={styles.severityContainer}>
            {severityOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.severityOption,
                  severity === option.value && {
                    backgroundColor: option.color,
                    borderColor: option.color,
                  },
                ]}
                onPress={() => setSeverity(option.value)}
              >
                <Text
                  style={[
                    styles.severityLabel,
                    severity === option.value && styles.severityLabelActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>LOCATION DATA</Text>
          <View style={styles.locationCard}>
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationLabel}>Current Coordinates</Text>
              {locationLoading ? (
                <View style={styles.locationLoading}>
                  <ActivityIndicator size="small" color="#3498DB" />
                  <Text style={styles.locationLoadingText}>Acquiring location...</Text>
                </View>
              ) : location ? (
                <View>
                  <Text style={styles.locationText}>
                    {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                  </Text>
                  {location.accuracy && (
                    <Text style={styles.locationAccuracy}>
                      Accuracy: ±{Math.round(location.accuracy)} meters
                    </Text>
                  )}
                </View>
              ) : (
                <Text style={styles.locationError}>
                  Location not available
                </Text>
              )}
            </View>
            <TouchableOpacity 
              style={[
                styles.refreshButton,
                (!hasLocationPermission || locationLoading) && styles.refreshButtonDisabled
              ]}
              onPress={getCurrentLocation}
              disabled={!hasLocationPermission || locationLoading}
            >
              {locationLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.refreshText}>Refresh</Text>
              )}
            </TouchableOpacity>
          </View>
          
          {!hasLocationPermission && (
            <TouchableOpacity 
              style={styles.permissionButton}
              onPress={requestLocationPermission}
            >
              <Text style={styles.permissionText}>Grant Location Permission</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>MEDIA EVIDENCE</Text>
          <View style={styles.mediaButtons}>
            <TouchableOpacity
              style={styles.mediaButton}
              onPress={handleTakePhoto}
            >
              <Text style={styles.mediaButtonText}>Capture Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.mediaButton}
              onPress={handleChoosePhoto}
            >
              <Text style={styles.mediaButtonText}>Select Photo</Text>
            </TouchableOpacity>
          </View>
          
          {media && (
            <View style={styles.mediaPreview}>
              <Image source={{ uri: media.uri }} style={styles.previewImage} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => setMedia(null)}
              >
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton, 
            (loading || !location) && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={loading || !title.trim() || !description.trim() || !location}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Incident Report</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECF0F1',
  },
  content: {
    padding: 20,
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 18,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7F8C8D',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#2C3E50',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  severityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  severityOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  severityLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  severityLabelActive: {
    color: '#FFFFFF',
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  locationTextContainer: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 8,
    fontWeight: '500',
  },
  locationLoading: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationLoadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#7F8C8D',
  },
  locationText: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '500',
    marginBottom: 4,
  },
  locationAccuracy: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  locationError: {
    fontSize: 14,
    color: '#E74C3C',
    fontStyle: 'italic',
  },
  refreshButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#3498DB',
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  refreshButtonDisabled: {
    backgroundColor: '#BDC3C7',
  },
  refreshText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  permissionButton: {
    backgroundColor: '#E74C3C',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  permissionText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  mediaButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  mediaButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#3498DB',
    padding: 12,
    borderRadius: 8,
  },
  mediaButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  mediaPreview: {
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#E74C3C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  removeText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  submitButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2C3E50',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 30,
  },
  submitButtonDisabled: {
    backgroundColor: '#BDC3C7',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default ReportIncident;