import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';

import api from '../../api/axios';
import { getToken } from '../../utils/storage';

export default function EquipmentDetailsScreen({ route, navigation }) {
  const { equipmentId } = route.params;

  const [loading, setLoading] = useState(true);
  const [equipment, setEquipment] = useState(null);

  useEffect(() => {
    loadEquipment();
  }, []);

  const loadEquipment = async () => {
    try {
      const token = await getToken();

      const response = await api.get(`/equipment/${equipmentId}`, {
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

  const updateStatus = async endpoint => {
    try {
      const token = await getToken();

      await api.post(
        endpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      Alert.alert('Success', 'Status Updated Successfully');

      loadEquipment();
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
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>Equipment Request</Text>

        <Text style={styles.item}>ID : {equipment.id}</Text>

        <Text style={styles.item}>Equipment : {equipment.equipment_name}</Text>

        <Text style={styles.item}>Quantity : {equipment.quantity}</Text>

        <View
          style={{
            backgroundColor:
              equipment.status === 'Pending'
                ? '#F59E0B'
                : equipment.status === 'Accepted'
                ? '#22C55E'
                : equipment.status === 'In Progress'
                ? '#2563EB'
                : equipment.status === 'Completed'
                ? '#8B5CF6'
                : equipment.status === 'Declined'
                ? '#EF4444'
                : '#6B7280',

            paddingVertical: 8,
            borderRadius: 20,
            marginTop: 10,
          }}
        >
          <Text
            style={{
              color: '#fff',
              textAlign: 'center',
              fontWeight: 'bold',
            }}
          >
            {equipment.status}
          </Text>
        </View>
      </View>

      {/* Pending */}

      {equipment.status === 'Pending' && (
        <>
          <TouchableOpacity
            style={[styles.btn, styles.accept]}
            onPress={() => updateStatus(`/request-accept/${equipment.id}`)}
          >
            <Text style={styles.btnText}>Accept Request</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.decline]}
            onPress={() => updateStatus(`/request-decline/${equipment.id}`)}
          >
            <Text style={styles.btnText}>Decline Request</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.btn,
              {
                backgroundColor: '#6B7280',
              },
            ]}
            onPress={() => updateStatus(`/request-cancel/${equipment.id}`)}
          >
            <Text style={styles.btnText}>Cancel Request</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Accepted */}

      {equipment.status === 'Accepted' && (
        <TouchableOpacity
          style={[styles.btn, styles.progress]}
          onPress={() => updateStatus(`/request-progress/${equipment.id}`)}
        >
          <Text style={styles.btnText}>Mark In Progress</Text>
        </TouchableOpacity>
      )}

      {/* In Progress */}

      {equipment.status === 'In Progress' && (
        <TouchableOpacity
          style={[styles.btn, styles.complete]}
          onPress={() => updateStatus(`/request-complete/${equipment.id}`)}
        >
          <Text style={styles.btnText}>Mark Complete</Text>
        </TouchableOpacity>
      )}

      {/* Final States */}

      {['Completed', 'Declined', 'Cancelled'].includes(equipment.status) && (
        <View
          style={{
            backgroundColor: '#E5E7EB',
            padding: 15,
            borderRadius: 10,
          }}
        >
          <Text
            style={{
              textAlign: 'center',
              fontWeight: '600',
            }}
          >
            No Further Actions Available
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.btn,
          {
            backgroundColor: '#EF4444',
          },
        ]}
        onPress={async () => {
          try {
            const token = await getToken();

            await api.delete(`/equipment-delete/${equipment.id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            Alert.alert('Success', 'Request Deleted');

            navigation.goBack();
          } catch (error) {
            console.log(error?.response?.data);
          }
        }}
      >
        <Text style={styles.btnText}>Delete Request</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 15,
  },

  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },

  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  item: {
    fontSize: 16,
    marginBottom: 8,
  },

  btn: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },

  accept: {
    backgroundColor: '#22C55E',
  },

  decline: {
    backgroundColor: '#EF4444',
  },

  progress: {
    backgroundColor: '#2563EB',
  },

  complete: {
    backgroundColor: '#8B5CF6',
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
