import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ReviewsScreen from '../screens/Reviews/ReviewsScreen';
import AddReviewScreen from '../screens/Reviews/AddReviewScreen';
import ReviewDetailsScreen from '../screens/Reviews/ReviewDetailsScreen';

const Stack = createNativeStackNavigator();

export default function ReviewsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ReviewsList"
        component={ReviewsScreen}
        options={{
          title: 'Reviews',
        }}
      />

      <Stack.Screen
        name="AddReview"
        component={AddReviewScreen}
        options={{
          title: 'Add Review',
        }}
      />

      <Stack.Screen
        name="ReviewDetails"
        component={ReviewDetailsScreen}
        options={{
          title: 'Review Details',
        }}
      />
    </Stack.Navigator>
  );
}
