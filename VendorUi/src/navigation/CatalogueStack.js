import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CatalogueScreen from '../screens/Catalogue/CatalogueScreen';
import AddProductScreen from '../screens/Catalogue/AddProductScreen';
import ProductDetailsScreen from '../screens/Catalogue/ProductDetailsScreen';
import EditProductScreen from '../screens/Catalogue/EditProductScreen';
import LowStockScreen from '../screens/Catalogue/LowStockScreen';
import OutOfStockScreen from '../screens/Catalogue/OutOfStockScreen';
import FeaturedProductsScreen from '../screens/Catalogue/FeaturedProductsScreen';
import MyProductsScreen from '../screens/Catalogue/MyProductsScreen';

const Stack = createNativeStackNavigator();

export default function CatalogueStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CatalogueList"
        component={CatalogueScreen}
        options={{
          title: 'Product Catalogue',
        }}
      />

      <Stack.Screen
        name="AddProduct"
        component={AddProductScreen}
        options={{
          title: 'Add Product',
        }}
      />

      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{
          title: 'Product Details',
        }}
      />

      <Stack.Screen
        name="EditProduct"
        component={EditProductScreen}
        options={{ title: 'Edit Product' }}
      />

      <Stack.Screen
        name="LowStockProducts"
        component={LowStockScreen}
        options={{ title: 'Low Stock Products' }}
      />

      <Stack.Screen
        name="OutOfStockProducts"
        component={OutOfStockScreen}
        options={{ title: 'Out Of Stock Products' }}
      />

      <Stack.Screen
        name="FeaturedProducts"
        component={FeaturedProductsScreen}
        options={{
          title: 'Featured Products',
        }}
      />

      <Stack.Screen
        name="MyProducts"
        component={MyProductsScreen}
        options={{
          title: 'My Products',
        }}
      />
    </Stack.Navigator>
  );
}
