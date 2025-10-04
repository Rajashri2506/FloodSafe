import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import IntroSlider from '../screens/Intro/IntroSlider';
import RoleSelection from '../screens/Auth/RoleSelection';
import Login from '../screens/Auth/Login';
import Register from '../screens/Auth/Register';
import PermissionRequest from '../screens/Permissions/PermissionRequest';

const Stack = createStackNavigator();

/**
 * Authentication Navigator
 * Handles intro, role selection, login, register, and permissions
 */
const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="IntroSlider" component={IntroSlider} />
      <Stack.Screen name="RoleSelection" component={RoleSelection} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="PermissionRequest" component={PermissionRequest} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
