import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DisputeScreen from '../screens/Disputes/DisputeScreen';
import AddDisputeScreen from '../screens/Disputes/AddDisputeScreen';
import DisputeDetailsScreen from '../screens/Disputes/DisputeDetailsScreen';

const Stack = createNativeStackNavigator();

export default function DisputeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DisputeList"
        component={DisputeScreen}
        options={{
          title: 'Disputes',
        }}
      />

      <Stack.Screen
        name="AddDispute"
        component={AddDisputeScreen}
        options={{
          title: 'Create Dispute',
        }}
      />

      <Stack.Screen
        name="DisputeDetails"
        component={DisputeDetailsScreen}
        options={{
          title: 'Dispute Details',
        }}
      />
    </Stack.Navigator>
  );
}
