import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ReportIncident from '../screens/Citizen/ReportIncident';
import Alerts from '../screens/Citizen/Alerts';
import MyReports from '../screens/Citizen/MyReports';
import Profile from '../screens/Citizen/Profile';
import LottieTabIcon from '../components/LottieTabIcon';
import { useAuth } from '../contexts/AuthContext';
import { getAlerts } from '../api/incidentApi';

const Tab = createBottomTabNavigator();

const CitizenNavigator = () => {
  const { user } = useAuth();
  const [activeAlertsCount, setActiveAlertsCount] = useState(0);

  useEffect(() => {
    const fetchActiveAlerts = async () => {
      try {
        const alerts = await getAlerts();
        const count = alerts.filter(alert => 
          alert.severity === 'critical' || alert.severity === 'high'
        ).length;
        setActiveAlertsCount(count);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      }
    };

    fetchActiveAlerts();
    const interval = setInterval(fetchActiveAlerts, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'ReportIncident') {
            return (
              <LottieTabIcon
                focused={focused}
                animation={require('../assets/lottie/incident.json')}
                size={28}
                fallbackIcon="alert-circle"
              />
            );
          } else if (route.name === 'Alerts') {
            return (
              <LottieTabIcon
                focused={focused}
                animation={require('../assets/lottie/alert.json')}
                size={28}
                fallbackIcon="bell"
              />
            );
          } else if (route.name === 'MyReports') {
            return (
              <LottieTabIcon
                focused={focused}
                animation={require('../assets/lottie/log.json')}
                size={28}
                fallbackIcon="file-document"
              />
            );
          } else if (route.name === 'Profile') {
            return (
              <LottieTabIcon
                focused={focused}
                animation={require('../assets/lottie/profile.json')}
                size={28}
                fallbackIcon="account"
              />
            );
          }
        },
        tabBarActiveTintColor: '#2C3E50',
        tabBarInactiveTintColor: '#95A5A6',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#ECF0F1',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: '#2C3E50',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
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
          title: 'Flood Alerts',
          tabBarLabel: 'Alerts',
          tabBarBadge: activeAlertsCount > 0 ? activeAlertsCount : null,
          tabBarBadgeStyle: {
            backgroundColor: '#E74C3C',
            color: '#FFFFFF',
            fontSize: 10,
            fontWeight: '700',
            minWidth: 18,
            height: 18,
          },
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
          title: 'Account',
          tabBarLabel: 'Account',
        }}
      />
    </Tab.Navigator>
  );
};

export default CitizenNavigator;