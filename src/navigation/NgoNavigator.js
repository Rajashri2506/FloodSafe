import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LottieView from 'lottie-react-native';
import ReliefManagement from '../screens/NGO/ReliefManagement';
import ReliefTracking from '../screens/NGO/ReliefTracking';
import NgoAlerts from '../screens/NGO/NgoAlerts';
import NgoProfile from '../screens/NGO/NgoProfile';

const Tab = createBottomTabNavigator();

/**
 * NGO Dashboard Navigator with Lottie Animations
 */
const NgoNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let animationSource;

          if (route.name === 'ReliefManagement') {
            animationSource = require('../assets/lottie/relief.json');
          } else if (route.name === 'ReliefTracking') {
            animationSource = require('../assets/lottie/ngo.json');
          } else if (route.name === 'NgoAlerts') {
            animationSource = require('../assets/lottie/alert.json');
          } else if (route.name === 'NgoProfile') {
            animationSource = require('../assets/lottie/profile.json');
          }

          return (
            <LottieView
              source={animationSource}
              autoPlay={focused}
              loop={focused}
              style={{
                width: 28,
                height: 28,
                opacity: focused ? 1 : 0.6,
              }}
            />
          );
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