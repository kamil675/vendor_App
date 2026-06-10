import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';

import api from '../../api/axios';
import { getToken } from '../../utils/storage';

export default function AddReviewScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    loadCompletedOrders();
  }, []);

  const loadCompletedOrders = async () => {
    try {
      const token = await getToken();

      const response = await api.get('/completed-orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(response.data);
    } catch (error) {
      console.log(error?.response?.data);
    }
  };

  const submitReview = async () => {
    try {
      if (!selectedOrder) {
        Alert.alert('Error', 'Please select an order');
        return;
      }

      if (!rating) {
        Alert.alert('Error', 'Please enter rating');
        return;
      }

      if (!comment) {
        Alert.alert('Error', 'Please enter comment');
        return;
      }

      const token = await getToken();

      await api.post(
        '/review-add',
        {
          vendor_id: selectedOrder.vendor_id,
          order_id: selectedOrder.id,
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      Alert.alert('Success', 'Review Added Successfully');

      navigation.goBack();
    } catch (error) {
      console.log(error?.response?.data);

      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Review Add Failed',
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Add Review</Text>

      <Text style={styles.label}>Select Completed Order</Text>

      {orders.map(item => (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.orderCard,
            selectedOrder?.id === item.id && styles.selectedCard,
          ]}
          onPress={() => setSelectedOrder(item)}
        >
          <Text style={styles.orderTitle}>Order #{item.id}</Text>

          <Text>Product ID : {item.catalogue_id}</Text>

          <Text>Amount : ₹ {item.total_price}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.label}>Rating (1-5)</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Rating"
        keyboardType="numeric"
        value={rating}
        onChangeText={setRating}
      />

      <Text style={styles.label}>Comment</Text>

      <TextInput
        style={[styles.input, styles.commentBox]}
        placeholder="Write Review"
        multiline
        value={comment}
        onChangeText={setComment}
      />

      <TouchableOpacity style={styles.submitBtn} onPress={submitReview}>
        <Text style={styles.btnText}>Submit Review</Text>
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

  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },

  orderCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },

  selectedCard: {
    borderWidth: 2,
    borderColor: '#2563EB',
  },

  orderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
  },

  commentBox: {
    height: 120,
    textAlignVertical: 'top',
  },

  submitBtn: {
    backgroundColor: '#22C55E',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 30,
  },

  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
