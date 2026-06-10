import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import VendorListScreen from '../screens/Vendors/VendorListScreen';
import VendorDetailsScreen from '../screens/Vendors/VendorDetailsScreen';
import TopRatedVendorScreen from '../screens/Vendors/TopRatedVendorScreen';
import SearchVendorScreen from '../screens/Vendors/SearchVendorScreen';
import VendorProductsScreen from '../screens/Vendors/VendorProductsScreen';

const Stack = createNativeStackNavigator();

export default function VendorStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="VendorList"
        component={VendorListScreen}
        options={{ title: 'Nearby Vendors' }}
      />

      <Stack.Screen name="VendorDetails" component={VendorDetailsScreen} />

      <Stack.Screen name="VendorProducts" component={VendorProductsScreen} />

      <Stack.Screen name="TopRatedVendors" component={TopRatedVendorScreen} />

      <Stack.Screen name="SearchVendor" component={SearchVendorScreen} />
    </Stack.Navigator>
  );
}
