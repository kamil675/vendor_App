import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';

import api from '../../api/axios';
import { getToken } from '../../utils/storage';

export default function DispatchScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [dispatches, setDispatches] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    loadDispatches();
  }, [isFocused]);

  const loadDispatches = async () => {
    try {
      setLoading(true);

      const token = await getToken();

      const response = await api.get('/dispatch-list', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDispatches(response.data || []);
    } catch (error) {
      console.log('DISPATCH ERROR =>', error?.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDispatches();
    setRefreshing(false);
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
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate('AddDispatch')}
      >
        <Text style={styles.btnText}>+ Add Dispatch</Text>
      </TouchableOpacity>

      <FlatList
        data={dispatches}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={() => (
          <View style={styles.center}>
            <Text>No Dispatch History Found</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('DispatchDetails', {
                dispatchId: item.id,
              })
            }
          >
            <Text style={styles.title}>{item.action}</Text>

            <Text>Equipment Request :{item.equipment_request_id}</Text>

            <Text>Vendor :{item.vendor?.name || 'N/A'}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 15,
  },

  addBtn: {
    backgroundColor: '#2563EB',
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
  },

  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
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
    marginBottom: 6,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
