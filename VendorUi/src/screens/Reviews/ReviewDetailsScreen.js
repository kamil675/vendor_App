import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

import api from '../../api/axios';
import { getToken } from '../../utils/storage';

export default function ReviewDetailsScreen({ route }) {
  const { reviewId } = route.params;

  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReview();
  }, []);


  const loadReview = async () => {
    try {
      const token = await getToken();

      const response = await api.get(`/review/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReview(response.data);
    } catch (error) {
      console.log(error?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Review Details</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Review ID</Text>

        <Text style={styles.value}>#{review?.id}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Order ID</Text>

        <Text style={styles.value}>#{review?.order_id}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Vendor ID</Text>

        <Text style={styles.value}>{review?.vendor_id}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Rating</Text>

        <Text style={styles.rating}>⭐ {review?.rating}/5</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Review Comment</Text>

        <Text style={styles.comment}>{review?.comment}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Created At</Text>

        <Text style={styles.value}>{review?.created_at}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Updated At</Text>

        <Text style={styles.value}>{review?.updated_at}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 15,
  },

  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 3,
  },

  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },

  value: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  rating: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#F59E0B',
  },

  comment: {
    fontSize: 16,
    lineHeight: 24,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
