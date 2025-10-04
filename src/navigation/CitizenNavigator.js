import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ReportIncident from '../screens/Citizen/ReportIncident';
import Alerts from '../screens/Citizen/Alerts';
import MyReports from '../screens/Citizen/MyReports';
import Profile from '../screens/Citizen/Profile';

const Tab = createBottomTabNavigator();

/**
 * Citizen Dashboard Navigator
 * Bottom tabs: Report Incident, Alerts, My Reports, Profile
 */
const CitizenNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'ReportIncident') {
            iconName = 'alert-circle';
          } else if (route.name === 'Alerts') {
            iconName = 'bell-alert';
          } else if (route.name === 'MyReports') {
            iconName = 'file-document';
          } else if (route.name === 'Profile') {
            iconName = 'account';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0066cc',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#0066cc',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="ReportIncident" 
        component={ReportIncident}
        options={{ 
          title: 'Report Incident',
          tabBarLabel: 'Report',
        }}
      />
      <Tab.Screen 
        name="Alerts" 
        component={Alerts}
        options={{ 
          title: 'Alerts',
        }}
      />
      <Tab.Screen 
        name="MyReports" 
        component={MyReports}
        options={{ 
          title: 'My Reports',
          tabBarLabel: 'Reports',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile}
        options={{ 
          title: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export default CitizenNavigator;
