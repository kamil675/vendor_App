import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';

import api from '../../api/axios';
import { getToken } from '../../utils/storage';

export default function DisputeDetailsScreen({ route, navigation }) {
  const { disputeId } = route.params;

  const [loading, setLoading] = useState(true);
  const [dispute, setDispute] = useState(null);

  useEffect(() => {
    loadDispute();
  }, []);

  const loadDispute = async () => {
    try {
      const token = await getToken();

      const response = await api.get(`/dispute/${disputeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDispute(response.data);
    } catch (error) {
      console.log(error?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const resolveDispute = async () => {
    try {
      const token = await getToken();

      await api.post(
        `/dispute-resolve/${disputeId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      Alert.alert('Success', 'Dispute Resolved');

      loadDispute();
    } catch (error) {
      console.log(error?.response?.data);
    }
  };

  const deleteDispute = async () => {
    try {
      const token = await getToken();

      await api.delete(`/dispute-delete/${disputeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert('Deleted');

      navigation.goBack();
    } catch (error) {
      console.log(error?.response?.data);
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
      <Text style={styles.title}>{dispute?.title}</Text>

      <Text>Order ID : {dispute?.order_id}</Text>

      <Text style={styles.description}>{dispute?.description}</Text>

      <Text>Status : {dispute?.status}</Text>

      {dispute?.status !== 'RESOLVED' && (
        <TouchableOpacity style={styles.resolveBtn} onPress={resolveDispute}>
          <Text style={styles.btnText}>Resolve Dispute</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.deleteBtn} onPress={deleteDispute}>
        <Text style={styles.btnText}>Delete Dispute</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  description: {
    marginVertical: 15,
    fontSize: 16,
  },

  resolveBtn: {
    backgroundColor: '#22C55E',
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
  },

  deleteBtn: {
    backgroundColor: '#DC2626',
    padding: 14,
    borderRadius: 10,
    marginTop: 15,
  },

  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
