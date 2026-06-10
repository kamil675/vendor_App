import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import NotificationScreen from '../screens/Notifications/NotificationScreen';

const Stack = createNativeStackNavigator();

export default function NotificationStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
    </Stack.Navigator>
  );
}
