import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuditScreen from '../screens/Audit/AuditScreen';

const Stack = createNativeStackNavigator();

export default function AuditStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AuditLogs"
        component={AuditScreen}
        options={{
          title: 'Audit Logs',
        }}
      />
    </Stack.Navigator>
  );
}
