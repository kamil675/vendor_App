import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DispatchScreen from '../screens/Dispatch/DispatchScreen';
import AddDispatchScreen from '../screens/Dispatch/AddDispatchScreen';
import DispatchDetailsScreen from '../screens/Dispatch/DispatchDetailsScreen';

const Stack = createNativeStackNavigator();

export default function DispatchStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DispatchList"
        component={DispatchScreen}
        options={{ title: 'Dispatch History' }}
      />

      <Stack.Screen
        name="AddDispatch"
        component={AddDispatchScreen}
        options={{ title: 'Add Dispatch' }}
      />

      <Stack.Screen
        name="DispatchDetails"
        component={DispatchDetailsScreen}
        options={{ title: 'Dispatch Details' }}
      />
    </Stack.Navigator>
  );
}
