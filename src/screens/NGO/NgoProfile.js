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
import { getCurrentUser, logoutUser } from '../../api/authApi';
import { useAuth } from '../../contexts/AuthContext';

const NgoProfile = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoAllocate, setAutoAllocate] = useState(false);
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
      'Are you sure you want to sign out of your organization account?',
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
      title: 'Organization Profile',
      onPress: () => Alert.alert('Profile Management', 'Organization profile editing coming soon.'),
    },
    {
      id: 'organization',
      title: 'Team Management',
      onPress: () => Alert.alert('Team Management', 'Team coordination features coming soon.'),
    },
    {
      id: 'reports',
      title: 'Analytics Dashboard',
      onPress: () => Alert.alert('Analytics', 'Comprehensive analytics dashboard coming soon.'),
    },
    {
      id: 'help',
      title: 'Emergency Support',
      onPress: () => Alert.alert('Support', 'Emergency support: support@floodsafe.gov'),
    },
    {
      id: 'about',
      title: 'System Information',
      onPress: () => Alert.alert(
        'FloodSafe Platform',
        'Version 2.0.0\nNational Disaster Management System'
      ),
    },
  ];

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2C3E50" />
        <Text style={styles.loadingText}>Loading organization profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.profileHeader}>
        <Text style={styles.organizationName}>{user.username}</Text>
        <Text style={styles.organizationEmail}>{user.email}</Text>
        <View style={styles.roleContainer}>
          <Text style={styles.roleText}>Verified NGO Partner</Text>
        </View>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>4</Text>
          <Text style={styles.statLabel}>Active Resources</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Ongoing Deliveries</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>250+</Text>
          <Text style={styles.statLabel}>People Assisted</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>OPERATIONAL SETTINGS</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingTexts}>
            <Text style={styles.settingTitle}>Emergency Notifications</Text>
            <Text style={styles.settingSubtitle}>Receive critical flood alerts</Text>
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
            <Text style={styles.settingTitle}>Auto Resource Allocation</Text>
            <Text style={styles.settingSubtitle}>Automatically assign resources to emergencies</Text>
          </View>
          <Switch
            value={autoAllocate}
            onValueChange={setAutoAllocate}
            trackColor={{ false: '#BDC3C7', true: '#3498DB80' }}
            thumbColor={autoAllocate ? '#3498DB' : '#ECF0F1'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ORGANIZATION MANAGEMENT</Text>
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
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sign Out Organization</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.versionText}>FloodSafe Platform v2.0.0</Text>
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
  organizationName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 4,
  },
  organizationEmail: {
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
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
  },
  statLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 4,
    fontWeight: '500',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#ECF0F1',
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
  menuArrow: {
    fontSize: 18,
    color: '#BDC3C7',
    fontWeight: '700',
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

export default NgoProfile;