import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import EquipmentScreen from '../screens/Equipment/EquipmentScreen';
import AddEquipmentScreen from '../screens/Equipment/AddEquipmentScreen';
import EquipmentDetailsScreen from '../screens/Equipment/EquipmentDetailsScreen';
import FailedRequestsScreen from '../screens/Equipment/FailedRequestsScreen';

const Stack = createNativeStackNavigator();

export default function EquipmentStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="EquipmentList"
        component={EquipmentScreen}
        options={{
          title: 'Equipment Requests',
        }}
      />

      <Stack.Screen
        name="AddEquipment"
        component={AddEquipmentScreen}
        options={{
          title: 'New Request',
        }}
      />

      <Stack.Screen
        name="EquipmentDetails"
        component={EquipmentDetailsScreen}
        options={{
          title: 'Request Details',
        }}
      />

      <Stack.Screen
        name="FailedRequests"
        component={FailedRequestsScreen}
        options={{
          title: 'Failed Requests',
        }}
      />
    </Stack.Navigator>
  );
}
