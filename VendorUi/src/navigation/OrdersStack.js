import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import OrdersScreen from '../screens/Orders/OrdersScreen';
import AddOrderScreen from '../screens/Orders/AddOrderScreen';
import OrderDetailsScreen from '../screens/Orders/OrderDetailsScreen';
import OrderHistoryScreen from '../screens/Orders/OrderHistoryScreen';
const Stack = createNativeStackNavigator();

export default function OrdersStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="OrdersList"
        component={OrdersScreen}
        options={{
          title: 'Orders',
        }}
      />

      <Stack.Screen
        name="AddOrder"
        component={AddOrderScreen}
        options={{
          title: 'Create Order',
        }}
      />

      <Stack.Screen
        name="OrderDetails"
        component={OrderDetailsScreen}
        options={{
          title: 'Order Details',
        }}
      />

      <Stack.Screen
        name="OrderHistory"
        component={OrderHistoryScreen}
        options={{
          title: 'Order History',
        }}
      />
    </Stack.Navigator>
  );
}
