import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';

import api from '../../api/axios';
import { getToken } from '../../utils/storage';

export default function FeaturedProductsScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const token = await getToken();

      const response = await api.get('/featured-products', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts(response.data);
    } catch (error) {
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
    <FlatList
      data={products}
      contentContainerStyle={{
        padding: 15,
      }}
      keyExtractor={item => item.id.toString()}
      ListEmptyComponent={() => (
        <View style={styles.center}>
          <Text>No Featured Products Found</Text>
        </View>
      )}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            navigation.navigate('ProductDetails', {
              productId: item.id,
            })
          }
        >
          {item?.image_urls?.[0] ? (
            <Image
              source={{
                uri: item.image_urls[0],
              }}
              style={styles.image}
            />
          ) : null}

          <Text style={styles.title}>{item.product_name}</Text>

          <Text>₹ {item.price}</Text>

          <Text>Stock : {item.stock_qty}</Text>

          <Text>Status : {item.status}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 3,
  },

  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
