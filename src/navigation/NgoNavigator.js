import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ReliefManagement from '../screens/NGO/ReliefManagement';
import ReliefTracking from '../screens/NGO/ReliefTracking';
import NgoAlerts from '../screens/NGO/NgoAlerts';
import NgoProfile from '../screens/NGO/NgoProfile';

const Tab = createBottomTabNavigator();

/**
 * NGO Dashboard Navigator
 * Bottom tabs: Relief Management, Relief Tracking, Alerts, Profile
 */
const NgoNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'ReliefManagement') {
            iconName = 'package-variant';
          } else if (route.name === 'ReliefTracking') {
            iconName = 'map-marker-path';
          } else if (route.name === 'NgoAlerts') {
            iconName = 'bell-alert';
          } else if (route.name === 'NgoProfile') {
            iconName = 'account';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#00a86b',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#00a86b',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="ReliefManagement" 
        component={ReliefManagement}
        options={{ 
          title: 'Relief Management',
          tabBarLabel: 'Relief',
        }}
      />
      <Tab.Screen 
        name="ReliefTracking" 
        component={ReliefTracking}
        options={{ 
          title: 'Relief Tracking',
          tabBarLabel: 'Tracking',
        }}
      />
      <Tab.Screen 
        name="NgoAlerts" 
        component={NgoAlerts}
        options={{ 
          title: 'Alerts',
        }}
      />
      <Tab.Screen 
        name="NgoProfile" 
        component={NgoProfile}
        options={{ 
          title: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export default NgoNavigator;
