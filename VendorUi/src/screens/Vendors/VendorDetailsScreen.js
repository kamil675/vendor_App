import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import {
  requestLocationPermission,
  getCurrentLocation,
} from '../../utils/location';

import { getDistanceKm } from '../../utils/distance';

import api from '../../api/axios';
import { getToken } from '../../utils/storage';
import { useIsFocused } from '@react-navigation/native';

export default function VendorDetailsScreen({ route, navigation }) {
  const { vendorId } = route.params;

  const [vendor, setVendor] = useState(null);
  const [ratingData, setRatingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [distance, setDistance] = useState(null);

  const isFocused = useIsFocused();

  const loadVendor = useCallback(async () => {
    try {
      const token = await getToken();

      const [detailRes, ratingRes] = await Promise.all([
        api.get(`/vendor-details/${vendorId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        api.get(`/vendor-rating/${vendorId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      console.log('VENDOR DETAILS =>');
      console.log(detailRes.data);

      setVendor(detailRes.data);
      setRatingData(ratingRes.data);
      console.log(JSON.stringify(detailRes.data, null, 2));
      console.log(JSON.stringify(ratingRes.data, null, 2));

      try {
        const permission = await requestLocationPermission();

        if (permission) {
          const coords = await getCurrentLocation();

          if (detailRes.data?.latitude && detailRes.data?.longitude) {
            const km = getDistanceKm(
              coords.latitude,
              coords.longitude,
              parseFloat(detailRes.data.latitude),
              parseFloat(detailRes.data.longitude),
            );

            setDistance(km.toFixed(2));
          }
        }
      } catch (e) {
        console.log('DISTANCE ERROR =>', e);
      }
    } catch (error) {
      console.log(
        'VENDOR DETAIL ERROR =>',
        error?.response?.data || error.message,
      );
      console.log('=================');
      console.log(error?.response?.status);
      console.log(error?.response?.data);
      console.log('=================');
    } finally {
      setLoading(false);
    }
  }, [vendorId]);

  // Screen Focus Refresh
  useEffect(() => {
    if (isFocused) {
      loadVendor();
    }
  }, [isFocused, loadVendor]);

  if (loading && !vendor) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Vendor Information</Text>

        <Text>Name : {vendor?.name || 'N/A'}</Text>

        <Text>Email : {vendor?.email || 'N/A'}</Text>

        <Text>Shop : {vendor?.shop_name || 'N/A'}</Text>

        <Text>Phone : {vendor?.phone || 'N/A'}</Text>

        <Text>Address : {vendor?.address || 'N/A'}</Text>

        <Text>Status :{vendor?.is_online ? ' 🟢 Online' : ' 🔴 Offline'}</Text>

        <Text>Rating :{vendor?.rating || 0}</Text>

        {distance !== null && (
          <Text
            style={{
              color: '#059669',
              fontWeight: 'bold',
              marginTop: 5,
            }}
          >
            Distance : {distance} KM
          </Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Ratings</Text>

        <Text>Average Rating :{ratingData?.average_rating || 0}</Text>

        <Text>Total Reviews :{ratingData?.total_reviews || 0}</Text>
      </View>

      <TouchableOpacity
        style={styles.productsBtn}
        onPress={() =>
          navigation.navigate('VendorProducts', {
            vendorId: vendor?.id,
          })
        }
      >
        <Text style={styles.productsBtnText}>View Vendor Products</Text>
      </TouchableOpacity>

      {ratingData?.reviews?.map(review => (
        <View key={review.id} style={styles.card}>
          <Text>Rating : {review.rating}</Text>
          <Text>{review.comment}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#F5F7FA',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  productsBtn: {
    backgroundColor: '#2563EB',
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
  },

  productsBtnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
