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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';
import { submitIncidentReport } from '../../api/incidentApi';

/**
 * Report Incident Screen (Citizen)
 * Allows citizens to report flood incidents with text, photo, and location
 */
const ReportIncident = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [location, setLocation] = useState(null);
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.log('Location error:', error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const handleTakePhoto = () => {
    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.8,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled camera');
        } else if (response.errorCode) {
          console.log('Camera Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
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
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          setMedia(response.assets[0]);
        }
      }
    );
  };

  const handleSubmit = async () => {
    if (!title || !description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const incidentData = {
        title,
        description,
        severity,
        location,
        media: media ? media.uri : null,
        timestamp: new Date().toISOString(),
      };

      const result = await submitIncidentReport(incidentData);

      if (result.success) {
        Alert.alert('Success', 'Incident reported successfully!', [
          {
            text: 'OK',
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
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit incident report');
    } finally {
      setLoading(false);
    }
  };

  const severityOptions = [
    { value: 'low', label: 'Low', color: '#ffa500', icon: 'alert-circle-outline' },
    { value: 'medium', label: 'Medium', color: '#ff6b6b', icon: 'alert' },
    { value: 'high', label: 'High', color: '#dc143c', icon: 'alert-octagon' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.infoCard}>
          <Icon name="information" size={24} color="#0066cc" />
          <Text style={styles.infoText}>
            Report flood incidents in your area to help authorities respond quickly
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Incident Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Heavy flooding on Main Street"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe the incident in detail..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Severity Level</Text>
          <View style={styles.severityContainer}>
            {severityOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.severityButton,
                  severity === option.value && {
                    backgroundColor: option.color,
                    borderColor: option.color,
                  },
                ]}
                onPress={() => setSeverity(option.value)}
              >
                <Icon
                  name={option.icon}
                  size={24}
                  color={severity === option.value ? '#fff' : option.color}
                />
                <Text
                  style={[
                    styles.severityText,
                    severity === option.value && styles.severityTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Location</Text>
          <View style={styles.locationCard}>
            <Icon name="map-marker" size={24} color="#0066cc" />
            <Text style={styles.locationText}>
              {location
                ? `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`
                : 'Fetching location...'}
            </Text>
            <TouchableOpacity onPress={getCurrentLocation}>
              <Icon name="refresh" size={24} color="#0066cc" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Add Photo/Video</Text>
          <View style={styles.mediaButtons}>
            <TouchableOpacity
              style={styles.mediaButton}
              onPress={handleTakePhoto}
            >
              <Icon name="camera" size={32} color="#0066cc" />
              <Text style={styles.mediaButtonText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.mediaButton}
              onPress={handleChoosePhoto}
            >
              <Icon name="image" size={32} color="#0066cc" />
              <Text style={styles.mediaButtonText}>Choose Photo</Text>
            </TouchableOpacity>
          </View>
          {media && (
            <View style={styles.mediaPreview}>
              <Image source={{ uri: media.uri }} style={styles.previewImage} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => setMedia(null)}
              >
                <Icon name="close-circle" size={32} color="#ff6b6b" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Icon name="send" size={24} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.submitButtonText}>Submit Report</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 15,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#0066cc',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  severityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  severityButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 10,
    marginHorizontal: 5,
    backgroundColor: '#fff',
  },
  severityText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  severityTextActive: {
    color: '#fff',
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  locationText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
  },
  mediaButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mediaButton: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  mediaButtonText: {
    marginTop: 8,
    fontSize: 14,
    color: '#0066cc',
    fontWeight: 'bold',
  },
  mediaPreview: {
    marginTop: 15,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#0066cc',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  buttonIcon: {
    marginRight: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ReportIncident;
