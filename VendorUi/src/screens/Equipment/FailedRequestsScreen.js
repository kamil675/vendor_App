import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import api from '../../api/axios';
import { getToken } from '../../utils/storage';

export default function FailedRequestsScreen() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    loadFailedRequests();
  }, []);

  const loadFailedRequests = async () => {
    try {
      const token = await getToken();

      const response = await api.get('/failed-requests', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRequests(response.data);
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
    <View style={styles.container}>
      <FlatList
        data={requests}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No Failed Requests Found
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>
              {item.equipment_name}
            </Text>

            <Text>Qty : {item.quantity}</Text>

            <Text style={styles.status}>
              {item.status}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#F5F7FA',
  },

  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  status: {
    color: '#EF4444',
    marginTop: 8,
    fontWeight: 'bold',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  empty: {
    textAlign: 'center',
    marginTop: 40,
  },
});