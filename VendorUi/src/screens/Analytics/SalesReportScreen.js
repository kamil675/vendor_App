import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import api from '../../api/axios';
import { getToken } from '../../utils/storage';

export default function SalesReportScreen() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadReport = async () => {
    try {
      setLoading(true);

      const token = await getToken();

      const response = await api.get('/sales-report', {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('SALES REPORT =>', response.data);

      setData(response.data?.data || response.data || null);
    } catch (error) {
      console.log('ERROR =>', error?.response?.data || error.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Sales Report</Text>

      <View style={styles.card}>
        <Text>Total Orders: {data?.total_orders ?? 0}</Text>
      </View>

      <View style={styles.card}>
        <Text>Items Sold: {data?.total_items_sold ?? 0}</Text>
      </View>

      <View style={styles.card}>
        <Text>Total Sales: ₹ {data?.total_sales ?? 0}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },

  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
