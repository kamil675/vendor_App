import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';

import api from '../../api/axios';
import { getToken } from '../../utils/storage';

export default function ProductDetailsScreen({ route, navigation }) {
  const { productId } = route.params;

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    console.log('====================');
    console.log('ROUTE PRODUCT ID =>', productId);

    loadProduct();
  }, []);

  const loadProduct = async () => {
    try {
      const token = await getToken();

      console.log('LOAD PRODUCT =>', productId);

      const response = await api.get(`/catalogue/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('PRODUCT DETAILS RESPONSE =>');
      console.log(JSON.stringify(response.data, null, 2));

      setProduct(response.data);
    } catch (error) {
      console.log('LOAD PRODUCT ERROR =>');
      console.log(error?.response?.data);
      console.log(error?.message);
    } finally {
      setLoading(false);
    }
  };

  const increaseStock = async () => {
    try {
      setActionLoading(true);

      const token = await getToken();

      const response = await api.post(
        `/stock-increase/${product.id}`,
        {
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log('INCREASE RESPONSE =>');
      console.log(response.data);

      await loadProduct();

      Alert.alert('Success', 'Stock increased successfully');
    } catch (error) {
      console.log('INCREASE ERROR =>');
      console.log(error?.response?.data);
      console.log(error?.message);

      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Failed to increase stock',
      );
    } finally {
      setActionLoading(false);
    }
  };

  const decreaseStock = async () => {
    try {
      setActionLoading(true);

      const token = await getToken();

      const response = await api.post(
        `/stock-decrease/${product.id}`,
        {
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log('DECREASE RESPONSE =>');
      console.log(response.data);

      await loadProduct();

      Alert.alert('Success', 'Stock decreased successfully');
    } catch (error) {
      console.log('DECREASE ERROR =>');
      console.log(error?.response?.data);
      console.log(error?.message);

      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Failed to decrease stock',
      );
    } finally {
      setActionLoading(false);
    }
  };

  const updateStatus = async status => {
    try {
      setActionLoading(true);

      const token = await getToken();

      await api.post(
        `/catalogue-status/${product.id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await loadProduct();

      Alert.alert('Success', 'Status Updated');
    } catch (error) {
      console.log(error?.response?.data);

      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Status update failed',
      );
    } finally {
      setActionLoading(false);
    }
  };

  const deleteProduct = async () => {
    Alert.alert('Delete Product', 'Are you sure?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            setActionLoading(true);

            const token = await getToken();

            console.log('DELETE PRODUCT =>', product.id);

            const response = await api.delete(
              `/catalogue-delete/${product.id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );

            console.log('DELETE RESPONSE =>');
            console.log(response.data);

            Alert.alert('Success', 'Product deleted successfully');

            navigation.goBack();
          } catch (error) {
            console.log('DELETE ERROR =>');
            console.log(error?.response?.data);
            console.log(error?.message);

            Alert.alert(
              'Error',
              error?.response?.data?.message || 'Delete failed',
            );
          } finally {
            setActionLoading(false);
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
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        {product?.image_urls?.length > 0 ? (
          <Image
            source={{
              uri: product.image_urls[0],
            }}
            style={styles.productImage}
            resizeMode="cover"
            onError={e => console.log('DETAIL IMAGE ERROR', e.nativeEvent)}
          />
        ) : (
          <View style={styles.noImage}>
            <Text>No Image</Text>
          </View>
        )}
        <Text style={styles.title}>{product?.product_name}</Text>

        <Text>Category : {product?.category}</Text>

        <Text>Price : ₹ {product?.price}</Text>

        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
          Stock : {product?.stock_qty}
        </Text>

        <Text>Status : {product?.status}</Text>

        <Text>Description : {product?.description}</Text>
      </View>

      <TouchableOpacity
        disabled={actionLoading}
        style={[styles.btn, styles.green]}
        onPress={increaseStock}
      >
        <Text style={styles.btnText}>
          {actionLoading ? 'Processing...' : '+ Increase Stock'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        disabled={actionLoading}
        style={[styles.btn, styles.orange]}
        onPress={decreaseStock}
      >
        <Text style={styles.btnText}>
          {actionLoading ? 'Processing...' : '- Decrease Stock'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, styles.blue]}
        onPress={() =>
          navigation.navigate('EditProduct', {
            product,
          })
        }
      >
        <Text style={styles.btnText}>Edit Product</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, { backgroundColor: '#22C55E' }]}
        onPress={() => updateStatus('ACTIVE')}
      >
        <Text style={styles.btnText}>Set Active</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, { backgroundColor: '#EF4444' }]}
        onPress={() => updateStatus('OUT_OF_STOCK')}
      >
        <Text style={styles.btnText}>Out Of Stock</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, { backgroundColor: '#F59E0B' }]}
        onPress={() => updateStatus('INACTIVE')}
      >
        <Text style={styles.btnText}>Inactive</Text>
      </TouchableOpacity>

      <TouchableOpacity
        disabled={actionLoading}
        style={[styles.btn, styles.red]}
        onPress={deleteProduct}
      >
        <Text style={styles.btnText}>Delete Product</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },

  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 3,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  btn: {
    padding: 14,
    borderRadius: 10,
    marginTop: 12,
  },

  green: {
    backgroundColor: '#22C55E',
  },

  orange: {
    backgroundColor: '#F59E0B',
  },

  blue: {
    backgroundColor: '#2563EB',
  },

  red: {
    backgroundColor: '#EF4444',
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
  productImage: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginBottom: 15,
  },

  noImage: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
});
