import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getCurrentUser, logoutUser } from '../../api/authApi';
import { CommonActions } from '@react-navigation/native';

/**
 * Profile Screen (NGO)
 * Displays NGO profile and settings
 */
const NgoProfile = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoAllocate, setAutoAllocate] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logoutUser();
            // Reset navigation to IntroSlider
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'IntroSlider' }],
              })
            );
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      id: 'edit',
      icon: 'account-edit',
      title: 'Edit Profile',
      onPress: () => Alert.alert('Coming Soon', 'Profile editing feature'),
    },
    {
      id: 'organization',
      icon: 'domain',
      title: 'Organization Details',
      onPress: () => Alert.alert('Coming Soon', 'Organization management'),
    },
    {
      id: 'reports',
      icon: 'chart-line',
      title: 'Analytics & Reports',
      onPress: () => Alert.alert('Coming Soon', 'Detailed analytics'),
    },
    {
      id: 'team',
      icon: 'account-group',
      title: 'Team Management',
      onPress: () => Alert.alert('Coming Soon', 'Team management feature'),
    },
    {
      id: 'blockchain',
      icon: 'link-variant',
      title: 'Blockchain Settings',
      onPress: () => Alert.alert('Coming Soon', 'Blockchain configuration'),
    },
    {
      id: 'help',
      icon: 'help-circle',
      title: 'Help & Support',
      onPress: () => Alert.alert('Help', 'Contact support at ngo@floodsafe.com'),
    },
    {
      id: 'about',
      icon: 'information',
      title: 'About FloodSafe',
      onPress: () => Alert.alert('About', 'FloodSafe v1.0.0\nDisaster Management App'),
    },
  ];

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Icon name="domain" size={100} color="#00a86b" />
        </View>
        <Text style={styles.name}>{user.username}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <View style={styles.roleBadge}>
          <Icon name="hands-pray" size={16} color="#00a86b" />
          <Text style={styles.roleText}>NGO Partner</Text>
        </View>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Icon name="package-variant" size={32} color="#00a86b" />
          <Text style={styles.statNumber}>4</Text>
          <Text style={styles.statLabel}>Resources</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Icon name="truck-delivery" size={32} color="#00a86b" />
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Deliveries</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Icon name="account-group" size={32} color="#00a86b" />
          <Text style={styles.statNumber}>250+</Text>
          <Text style={styles.statLabel}>People Helped</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Icon name="bell" size={24} color="#00a86b" />
            <Text style={styles.settingText}>Push Notifications</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#ddd', true: '#00a86b80' }}
            thumbColor={notificationsEnabled ? '#00a86b' : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Icon name="robot" size={24} color="#00a86b" />
            <Text style={styles.settingText}>Auto-Allocate Resources</Text>
          </View>
          <Switch
            value={autoAllocate}
            onValueChange={setAutoAllocate}
            trackColor={{ false: '#ddd', true: '#00a86b80' }}
            thumbColor={autoAllocate ? '#00a86b' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Menu</Text>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <Icon name={item.icon} size={24} color="#666" />
            <Text style={styles.menuText}>{item.title}</Text>
            <Icon name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="logout" size={24} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Version 1.0.0</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 10,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  roleText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#00a86b',
    fontWeight: 'bold',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 10,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#999',
    paddingHorizontal: 15,
    paddingVertical: 10,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#ff6b6b',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    marginBottom: 30,
  },
});

export default NgoProfile;
