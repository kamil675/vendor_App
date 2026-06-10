import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import api from '../../api/axios';
import { getToken } from '../../utils/storage';

export default function OrderHistoryScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const token = await getToken();

      const response = await api.get(
        '/order-history',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setOrders(response.data);
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
    <FlatList
      data={orders}
      keyExtractor={item =>
        item.id.toString()
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text>
            Order #{item.id}
          </Text>

          <Text>
            Product ID :
            {item.catalogue_id}
          </Text>

          <Text>
            Qty : {item.quantity}
          </Text>

          <Text>
            ₹ {item.total_price}
          </Text>

          <Text>
            Status :
            {item.status}
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    backgroundColor: '#fff',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    elevation: 3,
  },
});