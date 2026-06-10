import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import api from '../../api/axios';
import { getToken } from '../../utils/storage';

export default function OrdersScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);

      const token = await getToken();

      const response = await api.get('/order-list', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(response.data);
    } catch (error) {
      console.log(error?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = await getToken();

      await api.post(
        `/order-status/${id}`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      loadOrders();
    } catch (error) {
      console.log(error?.response?.data);
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case 'PENDING':
        return '#F59E0B';

      case 'PROCESSING':
        return '#2563EB';

      case 'COMPLETED':
        return '#22C55E';

      default:
        return '#9CA3AF';
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('OrderDetails', {
          orderId: item.id,
        })
      }
    >
      <View style={styles.topRow}>
        <Text style={styles.title}>Order #{item.id}</Text>

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

      <Text style={styles.text}>Product ID : {item.catalogue_id}</Text>

      <Text style={styles.text}>Quantity : {item.quantity}</Text>

      <Text style={styles.text}>Total Amount : ₹ {item.total_price}</Text>

      {item.status === 'PENDING' && (
        <TouchableOpacity
          style={styles.processingBtn}
          onPress={() => updateStatus(item.id, 'PROCESSING')}
        >
          <Text style={styles.btnText}>Start Processing</Text>
        </TouchableOpacity>
      )}

      {item.status === 'PROCESSING' && (
        <TouchableOpacity
          style={styles.completeBtn}
          onPress={() => updateStatus(item.id, 'COMPLETED')}
        >
          <Text style={styles.btnText}>Mark Completed</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Orders Management</Text>

      <TouchableOpacity
        style={styles.createBtn}
        onPress={() => navigation.navigate('AddOrder')}
      >
        <Text style={styles.buttonText}>+ Create Order</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.refreshBtn} onPress={loadOrders}>
        <Text style={styles.buttonText}>Refresh Orders</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: '#7C3AED',
          padding: 12,
          borderRadius: 10,
          marginBottom: 10,
        }}
        onPress={() => navigation.navigate('OrderHistory')}
      >
        <Text
          style={{
            color: '#fff',
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          Order History
        </Text>
      </TouchableOpacity>

      {orders.length > 0 ? (
        <FlatList
          data={orders}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
        />
      ) : (
        <View style={styles.center}>
          <Text>No Orders Found</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    padding: 15,
  },

  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  createBtn: {
    backgroundColor: '#22C55E',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  refreshBtn: {
    backgroundColor: '#2563EB',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },

  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },

  text: {
    fontSize: 15,
    marginBottom: 5,
  },

  processingBtn: {
    backgroundColor: '#F59E0B',
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
  },

  completeBtn: {
    backgroundColor: '#22C55E',
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
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
