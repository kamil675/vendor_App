import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';

import api from '../../api/axios';
import { getToken } from '../../utils/storage';

export default function ReviewsScreen({ navigation }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);

      const token = await getToken();

      const response = await api.get('/review-list', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReviews(response.data);
    } catch (error) {
      console.log(error?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async id => {
    Alert.alert('Delete Review', 'Are you sure?', [
      {
        text: 'Cancel',
      },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            const token = await getToken();

            await api.delete(`/review-delete/${id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            loadReviews();
          } catch (error) {
            console.log(error?.response?.data);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('ReviewDetails', { reviewId: item.id })
      }
    >
      <Text style={styles.title}>Review #{item.id}</Text>

      <Text>Order ID : {item.order_id}</Text>

      <Text>Rating : ⭐ {item.rating}/5</Text>

      <Text numberOfLines={2}>{item.comment}</Text>

      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => deleteReview(item.id)}
      >
        <Text style={styles.btnText}>Delete</Text>
      </TouchableOpacity>
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
      <Text style={styles.heading}>Reviews</Text>

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate('AddReview')}
      >
        <Text style={styles.btnText}>+ Add Review</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.refreshBtn} onPress={loadReviews}>
        <Text style={styles.btnText}>Refresh</Text>
      </TouchableOpacity>

      <FlatList
        data={reviews}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
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

  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
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
    marginBottom: 5,
  },

  addBtn: {
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

  deleteBtn: {
    backgroundColor: '#DC2626',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
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
