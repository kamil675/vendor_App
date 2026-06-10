import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';

import api from '../../api/axios';
import { getToken } from '../../utils/storage';

export default function AddOrderScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const token = await getToken();

      const response = await api.get('/catalogue-list', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('CATALOGUE PRODUCTS');
      console.log(response.data);

      setProducts(response.data);
    } catch (error) {
      console.log(error?.response?.data);
    }
  };

  const submitOrder = async () => {
    try {
      if (!selectedProduct) {
        Alert.alert('Error', 'Please select a product');
        return;
      }

      if (!quantity) {
        Alert.alert('Error', 'Enter quantity');
        return;
      }

      const token = await getToken();

      await api.post(
        '/order-add',
        {
          catalogue_id: selectedProduct.id,
          quantity: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      Alert.alert('Success', 'Order Created');

      navigation.goBack();
    } catch (error) {
      console.log(error?.response?.data);

      Alert.alert('Error', 'Order Create Failed');
    }
  };

  const total =
    selectedProduct && quantity
      ? selectedProduct.price * Number(quantity)
      : 0;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Create Order</Text>

      <Text style={styles.label}>Select Product</Text>

      {products.map(item => (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.productCard,
            selectedProduct?.id === item.id &&
              styles.selectedCard,
          ]}
          onPress={() => setSelectedProduct(item)}
        >
          <Text style={styles.productName}>
            {item.product_name}
          </Text>

          <Text>₹ {item.price}</Text>

          <Text>Stock : {item.stock_qty}</Text>
        </TouchableOpacity>
      ))}

      {selectedProduct && (
        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            Product : {selectedProduct.product_name}
          </Text>

          <Text style={styles.summaryText}>
            Price : ₹ {selectedProduct.price}
          </Text>
        </View>
      )}

      <TextInput
        placeholder="Quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.total}>
        Total : ₹ {total}
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={submitOrder}
      >
        <Text style={styles.buttonText}>
          Create Order
        </Text>
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  productCard: {
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

  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  summary: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 15,
  },

  summaryText: {
    fontSize: 16,
    marginBottom: 5,
  },

  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },

  total: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  button: {
    backgroundColor: '#2563EB',
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
  },

  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});