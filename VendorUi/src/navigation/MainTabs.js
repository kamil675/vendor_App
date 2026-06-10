import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import DashboardScreen from '../screens/Dashboard/DashboardScreen';

import ProfileStack from './ProfileStack';
import EquipmentStack from './EquipmentStack';
import CatalogueStack from './CatalogueStack';
import OrdersStack from './OrdersStack';
import ReviewsStack from './ReviewsStack';
import AnalyticsStack from './AnalyticsStack';
import NotificationStack from './NotificationStack';
import DisputeStack from './DisputeStack';
import DispatchStack from './DispatchStack';
import AuditStack from './AuditStack';
import VendorStack from './VendorStack';

import ScrollableTabBar from '../components/ScrollableTabBar';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <ScrollableTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />

      <Tab.Screen name="Analytics" component={AnalyticsStack} />

      <Tab.Screen name="Equipment" component={EquipmentStack} />

      <Tab.Screen name="Catalogue" component={CatalogueStack} />

      <Tab.Screen name="Orders" component={OrdersStack} />

      <Tab.Screen name="Reviews" component={ReviewsStack} />

      <Tab.Screen name="Disputes" component={DisputeStack} />

      <Tab.Screen name="Dispatch" component={DispatchStack} />

      <Tab.Screen name="Notifications" component={NotificationStack} />

      <Tab.Screen name="Audit" component={AuditStack} />

      <Tab.Screen name="Vendors" component={VendorStack} />

      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}
