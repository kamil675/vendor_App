import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import api from '../../api/axios';
import { getToken } from '../../utils/storage';

export default function AnalyticsScreen({ navigation }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    try {
      setLoading(true);

      const token = await getToken();

      const response = await api.get('/analytics', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(response.data);
    } catch (error) {
      console.log('ANALYTICS ERROR =>', error?.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
        <Text>Loading Analytics...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Analytics Dashboard</Text>

      {/* SUMMARY CARDS */}

      <View style={styles.card}>
        <Text>Total Revenue</Text>
        <Text style={styles.value}>₹ {data?.total_revenue ?? 0}</Text>
      </View>

      <View style={styles.card}>
        <Text>Total Orders</Text>
        <Text style={styles.value}>{data?.total_orders ?? 0}</Text>
      </View>

      <View style={styles.card}>
        <Text>Total Products Sold</Text>
        <Text style={styles.value}>{data?.total_sold ?? 0}</Text>
      </View>

      <View style={styles.card}>
        <Text>Average Order Value</Text>
        <Text style={styles.value}>₹ {data?.avg_order_value ?? 0}</Text>
      </View>

      {/* NAVIGATION BUTTONS */}

      <TouchableOpacity
        style={styles.btn}
        onPress={() =>
          navigation.navigate('Analytics', {
            screen: 'SalesReport',
          })
        }
      >
        <Text style={styles.btnText}>View Sales Report</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={() =>
          navigation.navigate('Analytics', {
            screen: 'Earnings',
          })
        }
      >
        <Text style={styles.btnText}>Monthly Earnings</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={() =>
          navigation.navigate('Analytics', {
            screen: 'TopProducts',
          })
        }
      >
        <Text style={styles.btnText}>Top Selling Products</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#F5F7FA' },

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
  },

  value: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },

  btn: {
    backgroundColor: '#111827',
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },

  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
