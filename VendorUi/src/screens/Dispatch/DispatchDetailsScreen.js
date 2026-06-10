import React, { useState, useEffect } from 'react';
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

export default function DispatchDetailsScreen({ route, navigation }) {
  const { dispatchId } = route.params;

  const [loading, setLoading] = useState(true);
  const [dispatch, setDispatch] = useState(null);

  useEffect(() => {
    loadDispatch();
  }, []);

  const loadDispatch = async () => {
    try {
      const token = await getToken();

      const response = await api.get(`/dispatch/${dispatchId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDispatch(response.data);
    } catch (error) {
      console.log(error?.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteDispatch = async () => {
    Alert.alert('Delete Dispatch', 'Are you sure?', [
      {
        text: 'Cancel',
      },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            const token = await getToken();

            await api.delete(`/dispatch-delete/${dispatchId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            Alert.alert('Success', 'Dispatch Deleted');

            navigation.goBack();
          } catch (error) {
            console.log(error?.response?.data || error.message);
          }
        },
      },
    ]);
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
      <Text style={styles.title}>{dispatch?.action}</Text>

      <Text>Equipment Request ID :{dispatch?.equipment_request_id}</Text>

      <Text>Vendor :{dispatch?.vendor?.name}</Text>

      <Text>Created :{dispatch?.created_at}</Text>

      <TouchableOpacity style={styles.deleteBtn} onPress={deleteDispatch}>
        <Text style={styles.btnText}>Delete Dispatch</Text>
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
    marginBottom: 15,
  },

  deleteBtn: {
    backgroundColor: '#DC2626',
    padding: 15,
    borderRadius: 10,
    marginTop: 25,
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
