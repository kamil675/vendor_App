import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import api from '../../api/axios';
import { getToken } from '../../utils/storage';

export default function EquipmentScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [equipment, setEquipment] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadEquipment();
    }, []),
  );

  const loadEquipment = async () => {
    try {
      setLoading(true);

      const token = await getToken();

      const response = await api.get('/equipment-list', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEquipment(response.data);
    } catch (error) {
      console.log(error?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEquipment();
    setRefreshing(false);
  };

  const getStatusColor = status => {
    const s = status?.toLowerCase();

    switch (s) {
      case 'pending':
        return '#F59E0B';

      case 'accepted':
        return '#22C55E';

      case 'in progress':
        return '#2563EB';

      case 'completed':
        return '#8B5CF6';

      case 'declined':
        return '#EF4444';

      case 'cancelled':
        return '#6B7280';

      default:
        return '#9CA3AF';
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('EquipmentDetails', {
          equipmentId: item.id,
        })
      }
    >
      <View style={styles.topRow}>
        <Text style={styles.title}>Request #{item.id}</Text>

        <View
          style={[
            styles.badge,
            {
              backgroundColor: getStatusColor(item.status),
            },
          ]}
        >
          <Text style={styles.badgeText}>{item.status}</Text>
        </View>
      </View>

      <Text>Equipment : {item.equipment_name}</Text>

      <Text>Quantity : {item.quantity}</Text>

      <Text style={styles.viewText}>Tap to view details →</Text>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Equipment Requests</Text>

      <TouchableOpacity
        style={styles.failedBtn}
        onPress={() => navigation.navigate('FailedRequests')}
      >
        <Text style={styles.failedText}>View Failed Requests</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate('AddEquipment')}
      >
        <Text style={styles.addBtnText}>+ New Equipment Request</Text>
      </TouchableOpacity>

      <FlatList
        data={equipment}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#F5F7FA' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  addBtn: {
    backgroundColor: '#22C55E',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  addBtnText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  failedBtn: {
    backgroundColor: '#EF4444',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  failedText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between' },
  title: { fontWeight: 'bold', fontSize: 18 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { color: '#fff', fontWeight: 'bold' },
  viewText: { marginTop: 10, color: '#2563EB' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
