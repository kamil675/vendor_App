import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProfileScreen from '../screens/Profile/ProfileScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';
import NotificationScreen from '../screens/Notifications/NotificationScreen';

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileView"
        component={ProfileScreen}
        options={{
          title: 'Profile',
        }}
      />

      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          title: 'Edit Profile',
        }}
      />

      <Stack.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{
          title: 'Notifications',
        }}
      />
    </Stack.Navigator>
  );
}
