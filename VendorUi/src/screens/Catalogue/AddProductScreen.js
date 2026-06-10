import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';

import { launchImageLibrary } from 'react-native-image-picker';

import api from '../../api/axios';
import { getToken } from '../../utils/storage';

export default function AddProductScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  const [product_name, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [stock_qty, setStockQty] = useState('');
  const [min_order_qty, setMinOrderQty] = useState('');

  const [delivery_option, setDeliveryOption] = useState('both');

  const [status, setStatus] = useState('active');

  const [images, setImages] = useState([]);

  const pickImages = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 5,
    });

    if (!result.didCancel && result.assets) {
      setImages(result.assets);
    }
  };

  const saveProduct = async () => {
    try {
      if (!product_name) {
        return Alert.alert('Validation', 'Product Name Required');
      }

      if (!price) {
        return Alert.alert('Validation', 'Price Required');
      }

      setLoading(true);

      const token = await getToken();

      const formData = new FormData();

      formData.append('product_name', product_name);

      formData.append('price', price);

      formData.append('description', description);

      formData.append('category', category);

      formData.append('stock_qty', stock_qty || 0);

      formData.append('min_order_qty', min_order_qty || 1);

      formData.append('delivery_option', delivery_option);

      formData.append('status', status);

      images.forEach(image => {
        formData.append('images[]', {
          uri: image.uri,
          type: image.type,
          name: image.fileName || `image_${Date.now()}.jpg`,
        });
      });

      const response = await api.post('/catalogue-add', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);

      Alert.alert('Success', 'Product Added Successfully');

      navigation.goBack();
    } catch (error) {
      console.log(error?.response?.data);

      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Product Create Failed',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Add Product</Text>

      <TextInput
        placeholder="Product Name"
        style={styles.input}
        value={product_name}
        onChangeText={setProductName}
      />

      <TextInput
        placeholder="Price"
        style={styles.input}
        value={price}
        keyboardType="numeric"
        onChangeText={setPrice}
      />

      <TextInput
        placeholder="Description"
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />

      <TextInput
        placeholder="Category"
        style={styles.input}
        value={category}
        onChangeText={setCategory}
      />

      <TextInput
        placeholder="Stock Qty"
        style={styles.input}
        keyboardType="numeric"
        value={stock_qty}
        onChangeText={setStockQty}
      />

      <TextInput
        placeholder="Min Order Qty"
        style={styles.input}
        keyboardType="numeric"
        value={min_order_qty}
        onChangeText={setMinOrderQty}
      />

      <TouchableOpacity style={styles.imageBtn} onPress={pickImages}>
        <Text style={styles.imageBtnText}>
          Select Images ({images.length}/5)
        </Text>
      </TouchableOpacity>

      {images.map((item, index) => (
        <Image key={index} source={{ uri: item.uri }} style={styles.preview} />
      ))}

      <TouchableOpacity
        style={styles.button}
        disabled={loading}
        onPress={saveProduct}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Save Product</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },

  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 12,
    padding: 12,
  },

  imageBtn: {
    backgroundColor: '#2563EB',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  imageBtnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  preview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },

  button: {
    backgroundColor: '#22C55E',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 30,
  },

  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
