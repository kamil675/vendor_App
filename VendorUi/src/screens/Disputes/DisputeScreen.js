import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';

import api from '../../api/axios';
import { getToken } from '../../utils/storage';

export default function DisputeScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [disputes, setDisputes] = useState([]);

  const isFocused = useIsFocused();

  const loadDisputes = useCallback(async () => {
    try {
      setLoading(true);

      const token = await getToken();

      if (!token) {
        console.log('NO TOKEN FOUND');
        return;
      }

      const response = await api.get('/dispute-list', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('DISPUTES =>');
      console.log(response.data);

      setDisputes(response.data || []);
    } catch (error) {
      console.log(
        'DISPUTE LIST ERROR =>',
        error?.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      loadDisputes();
    }
  }, [isFocused]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDisputes();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading Disputes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate('AddDispute')}
      >
        <Text style={styles.btnText}>+ Create Dispute</Text>
      </TouchableOpacity>

      {disputes.length === 0 ? (
        <View style={styles.center}>
          <Text>No Disputes Found</Text>
        </View>
      ) : (
        <FlatList
          data={disputes}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate('DisputeDetails', {
                  disputeId: item.id,
                })
              }
            >
              <Text style={styles.title}>{item.title}</Text>

              <Text>Order ID : {item.order_id}</Text>

              <Text
                style={{
                  marginTop: 8,
                  fontWeight: 'bold',
                  color: item.status === 'RESOLVED' ? '#22C55E' : '#EF4444',
                }}
              >
                {item.status}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#F5F7FA',
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
    marginBottom: 12,
    borderRadius: 12,
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
