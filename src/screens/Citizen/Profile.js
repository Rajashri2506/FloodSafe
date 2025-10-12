import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getCurrentUser, logoutUser } from '../../api/authApi';
import { useAuth } from '../../contexts/AuthContext';

const Profile = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await logoutUser();
            await logout();
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      id: 'edit',
      title: 'Edit Profile',
      onPress: () => Alert.alert('Profile Management', 'Profile editing features coming soon.'),
    },
    {
      id: 'history',
      title: 'Report History',
      onPress: () => Alert.alert('Report History', 'Complete incident history available soon.'),
    },
    {
      id: 'help',
      title: 'Help & Support',
      onPress: () => Alert.alert('Support', 'Contact: support@floodsafe.gov\nEmergency: 911'),
    },
    {
      id: 'about',
      title: 'About FloodSafe',
      onPress: () => Alert.alert(
        'FloodSafe',
        'Version 2.0.0\nNational Disaster Management Platform'
      ),
    },
  ];

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2C3E50" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.profileHeader}>
        <Text style={styles.userName}>{user.username}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        <View style={styles.roleContainer}>
          <Text style={styles.roleText}>Citizen Account</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>NOTIFICATION SETTINGS</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingTexts}>
            <Text style={styles.settingTitle}>Emergency Alerts</Text>
            <Text style={styles.settingSubtitle}>Receive critical flood warnings</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#BDC3C7', true: '#3498DB80' }}
            thumbColor={notificationsEnabled ? '#3498DB' : '#ECF0F1'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingTexts}>
            <Text style={styles.settingTitle}>Location Services</Text>
            <Text style={styles.settingSubtitle}>Enable automatic location detection</Text>
          </View>
          <Switch
            value={locationEnabled}
            onValueChange={setLocationEnabled}
            trackColor={{ false: '#BDC3C7', true: '#3498DB80' }}
            thumbColor={locationEnabled ? '#3498DB' : '#ECF0F1'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ACCOUNT MANAGEMENT</Text>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.menuItem,
              index === menuItems.length - 1 && styles.menuItemLast,
            ]}
            onPress={item.onPress}
          >
            <Text style={styles.menuTitle}>{item.title}</Text>
            <Icon name="chevron-right" size={20} color="#BDC3C7" />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.versionText}>FloodSafe v2.0.0</Text>
        <Text style={styles.copyrightText}>National Disaster Management Authority</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECF0F1',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ECF0F1',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#7F8C8D',
  },
  profileHeader: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 12,
  },
  roleContainer: {
    backgroundColor: '#E8F4FD',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  roleText: {
    fontSize: 14,
    color: '#3498DB',
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7F8C8D',
    paddingHorizontal: 20,
    paddingVertical: 16,
    letterSpacing: 0.5,
    backgroundColor: '#F8F9FA',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  settingTexts: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  logoutButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDEDED',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E74C3C',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  versionText: {
    fontSize: 14,
    color: '#95A5A6',
    fontWeight: '600',
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 12,
    color: '#BDC3C7',
    textAlign: 'center',
  },
});

export default Profile;