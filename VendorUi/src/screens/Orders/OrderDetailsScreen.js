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

export default function OrderDetailsScreen({ route }) {
  const { orderId } = route.params;

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    loadOrder();
  }, []);

  const loadOrder = async () => {
    try {
      const token = await getToken();

      const response = await api.get(`/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('ORDER DETAILS');
      console.log(response.data);

      setOrder(response.data);
    } catch (error) {
      console.log(error?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case 'PENDING':
        return '#F59E0B';

      case 'PROCESSING':
        return '#2563EB';

      case 'COMPLETED':
        return '#22C55E';

      default:
        return '#9CA3AF';
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
      <Text style={styles.heading}>Order Details</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Order ID</Text>

        <Text style={styles.value}>#{order?.id}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Product ID</Text>

        <Text style={styles.value}>{order?.catalogue_id}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Quantity</Text>

        <Text style={styles.value}>{order?.quantity}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Total Price</Text>

        <Text style={styles.value}>₹ {order?.total_price}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Status</Text>

        <Text
          style={[
            styles.status,
            {
              color: getStatusColor(order?.status),
            },
          ]}
        >
          {order?.status}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Vendor ID</Text>

        <Text style={styles.value}>{order?.vendor_id}</Text>
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
    marginBottom: 15,
  },

  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },

  label: {
    color: '#666',
    fontSize: 14,
  },

  value: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },

  status: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
