import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import api from '../../api/axios';
import { getToken } from '../../utils/storage';

export default function AuditScreen() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);

      const token = await getToken();

      const response = await api.get('/audit-logs', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLogs(response.data);
    } catch (error) {
      console.log('AUDIT ERROR');
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
      <TouchableOpacity style={styles.refreshBtn} onPress={loadLogs}>
        <Text style={styles.btnText}>Refresh Logs</Text>
      </TouchableOpacity>

      <FlatList
        data={logs}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.action}>{item.action}</Text>

            <Text style={styles.description}>{item.description}</Text>

            <Text style={styles.date}>{item.created_at}</Text>
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

  refreshBtn: {
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

  action: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563EB',
  },

  description: {
    marginTop: 5,
    fontSize: 15,
  },

  date: {
    marginTop: 8,
    color: '#666',
    fontSize: 12,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
