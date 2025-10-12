import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import IntroSlider from '../screens/Intro/IntroSlider';
import RoleSelection from '../screens/Auth/RoleSelection';
import Login from '../screens/Auth/Login';
import CitizenRegister from '../screens/Auth/CitizenRegister';
import NgoRegister from '../screens/Auth/NgoRegister';
import PermissionRequest from '../screens/Permissions/PermissionRequest';

const Stack = createStackNavigator();

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
      <Stack.Screen name="CitizenRegister" component={CitizenRegister} />
      <Stack.Screen name="NgoRegister" component={NgoRegister} />
      <Stack.Screen name="PermissionRequest" component={PermissionRequest} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;