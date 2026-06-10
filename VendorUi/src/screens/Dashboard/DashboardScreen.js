import React, { useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import {
  requestLocationPermission,
  getCurrentLocation,
} from '../../utils/location';

import api from '../../api/axios';
import { getToken, removeToken } from '../../utils/storage';

export default function DashboardScreen() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ✅ SAFE API CALL
  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);

      const token = await getToken();

      if (!token) return;

      const response = await api.get('/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(response.data);
    } catch (error) {
      console.log('DASHBOARD ERROR =>', error?.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ SCREEN FOCUS REFRESH
  const isFocused = useIsFocused();

  useEffect(() => {
    let interval;

    const startGPS = async () => {
      if (!isFocused) return;

      await sendLocation();

      interval = setInterval(() => {
        sendLocation();
      }, 60000);
    };

    startGPS();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isFocused]);

  // ✅ PULL TO REFRESH
  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboard();
    setRefreshing(false);
  };

  const sendLocation = async () => {
    try {
      const permission = await requestLocationPermission();
      if (!permission) return;

      const coords = await getCurrentLocation();

      if (!coords?.latitude || !coords?.longitude) return;

      await api.post('/vendor-location', {
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      console.log('GPS SENT:', coords);
    } catch (err) {
      console.log('GPS ERROR:', err.message);
    }
  };

  const logout = async () => {
    try {
      await removeToken();
      global.setLoggedIn(false);
    } catch (error) {
      console.log('LOGOUT ERROR =>', error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      loadDashboard();
    }
  }, [isFocused, loadDashboard]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={{ marginTop: 10 }}>Loading Dashboard...</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.loaderContainer}>
        <Text>Unable to load dashboard data</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.heading}>Vendor Dashboard</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Cards */}
      <View style={styles.card}>
        <Text style={styles.title}>Vendor Name</Text>
        <Text style={styles.value}>{data?.vendor_name ?? 'N/A'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Total Products</Text>
        <Text style={styles.value}>{data?.total_products ?? 0}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Active Products</Text>
        <Text style={styles.value}>{data?.active_products ?? 0}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Out of Stock Products</Text>
        <Text style={styles.value}>{data?.out_of_stock_products ?? 0}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Total Orders</Text>
        <Text style={styles.value}>{data?.total_orders ?? 0}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Pending Orders</Text>
        <Text style={styles.value}>{data?.pending_orders ?? 0}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Completed Orders</Text>
        <Text style={styles.value}>{data?.completed_orders ?? 0}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Total Revenue</Text>
        <Text style={styles.value}>₹ {data?.total_revenue ?? 0}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Total Reviews</Text>
        <Text style={styles.value}>{data?.total_reviews ?? 0}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Average Rating</Text>
        <Text style={styles.value}>{data?.average_rating ?? 0}</Text>
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
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  logoutButton: {
    backgroundColor: '#EF4444',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },

  logoutText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },

  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },

  title: {
    fontSize: 14,
    color: '#666',
  },

  value: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 6,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
