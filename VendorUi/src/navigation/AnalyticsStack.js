import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AnalyticsScreen from '../screens/Analytics/AnalyticsScreen';
import SalesReportScreen from '../screens/Analytics/SalesReportScreen';
import EarningsScreen from '../screens/Analytics/EarningsScreen';
import TopProductsScreen from '../screens/Analytics/TopProductsScreen';

const Stack = createNativeStackNavigator();

export default function AnalyticsStack() {
  return (
    <Stack.Navigator initialRouteName="AnalyticsHome">
      <Stack.Screen
        name="AnalyticsHome"
        component={AnalyticsScreen}
        options={{ title: 'Analytics' }}
      />

      <Stack.Screen name="SalesReport" component={SalesReportScreen} />
      <Stack.Screen name="Earnings" component={EarningsScreen} />
      <Stack.Screen name="TopProducts" component={TopProductsScreen} />
    </Stack.Navigator>
  );
}
