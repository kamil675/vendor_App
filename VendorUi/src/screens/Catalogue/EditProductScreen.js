import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';

import { launchImageLibrary } from 'react-native-image-picker';

import api from '../../api/axios';
import { getToken } from '../../utils/storage';

export default function EditProductScreen({ route, navigation }) {
  const { product } = route.params;

  const [loading, setLoading] = useState(false);

  const [productName, setProductName] = useState(product?.product_name || '');

  const [price, setPrice] = useState(String(product?.price || ''));

  const [description, setDescription] = useState(product?.description || '');

  const [category, setCategory] = useState(product?.category || '');

  const [stockQty, setStockQty] = useState(String(product?.stock_qty || 0));

  const [minOrderQty, setMinOrderQty] = useState(
    String(product?.min_order_qty || 1),
  );

  const [deliveryOption, setDeliveryOption] = useState(
    product?.delivery_option || 'BOTH',
  );

  const [status, setStatus] = useState(product?.status || 'ACTIVE');

  const [images, setImages] = useState([]);

  const pickImages = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 5,
      quality: 0.8,
    });

    if (result.didCancel) return;

    if (result.assets?.length > 0) {
      setImages(result.assets);
    }
  };

  const updateProduct = async () => {
    try {
      setLoading(true);

      const token = await getToken();

      const formData = new FormData();

      formData.append('product_name', productName);
      formData.append('price', price);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('stock_qty', stockQty);
      formData.append('min_order_qty', minOrderQty);
      formData.append('delivery_option', deliveryOption);
      formData.append('status', status);

      images.forEach((img, index) => {
        formData.append('images[]', {
          uri: img.uri,
          type: img.type || 'image/jpeg',
          name: img.fileName || `image_${index}.jpg`,
        });
      });

      await api.post(`/catalogue-update/${product.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Success', 'Product Updated Successfully');

      navigation.goBack();
    } catch (error) {
      console.log(error?.response?.data);

      Alert.alert('Error', error?.response?.data?.message || 'Update Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.heading}>Edit Product</Text>

      <Text style={styles.label}>Product Name</Text>

      <TextInput
        style={styles.input}
        value={productName}
        onChangeText={setProductName}
      />

      <Text style={styles.label}>Price</Text>

      <TextInput
        style={styles.input}
        value={price}
        keyboardType="numeric"
        onChangeText={setPrice}
      />

      <Text style={styles.label}>Description</Text>

      <TextInput
        style={[styles.input, styles.textArea]}
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Category</Text>

      <TextInput
        style={styles.input}
        value={category}
        onChangeText={setCategory}
      />

      <Text style={styles.label}>Stock Quantity</Text>

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={stockQty}
        onChangeText={setStockQty}
      />

      <Text style={styles.label}>Min Order Qty</Text>

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={minOrderQty}
        onChangeText={setMinOrderQty}
      />

      <Text style={styles.label}>Delivery Option</Text>

      <View style={styles.optionRow}>
        <TouchableOpacity
          style={[
            styles.optionBtn,
            deliveryOption === 'BOTH' && styles.activeOption,
          ]}
          onPress={() => setDeliveryOption('BOTH')}
        >
          <Text>BOTH</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionBtn,
            deliveryOption === 'SELF_PICKUP' && styles.activeOption,
          ]}
          onPress={() => setDeliveryOption('SELF_PICKUP')}
        >
          <Text>PICKUP</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionBtn,
            deliveryOption === 'LOCAL_DELIVERY' && styles.activeOption,
          ]}
          onPress={() => setDeliveryOption('LOCAL_DELIVERY')}
        >
          <Text>DELIVERY</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Product Status</Text>

      <View style={styles.optionRow}>
        <TouchableOpacity
          style={[styles.optionBtn, status === 'ACTIVE' && styles.activeOption]}
          onPress={() => setStatus('ACTIVE')}
        >
          <Text>ACTIVE</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionBtn,
            status === 'INACTIVE' && styles.activeOption,
          ]}
          onPress={() => setStatus('INACTIVE')}
        >
          <Text>INACTIVE</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionBtn,
            status === 'OUT_OF_STOCK' && styles.activeOption,
          ]}
          onPress={() => setStatus('OUT_OF_STOCK')}
        >
          <Text>OUT OF STOCK</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Current Images</Text>

      <View style={styles.imageContainer}>
        {images.length === 0 &&
          product?.image_urls?.map((img, index) => (
            <Image key={index} source={{ uri: img }} style={styles.image} />
          ))}
      </View>

      <TouchableOpacity style={styles.imageButton} onPress={pickImages}>
        <Text style={styles.buttonText}>Select New Images</Text>
      </TouchableOpacity>

      {images.length > 0 && (
        <>
          <Text style={styles.label}>New Images</Text>

          <View style={styles.imageContainer}>
            {images.map((img, index) => (
              <Image
                key={index}
                source={{
                  uri: img.uri,
                }}
                style={styles.image}
              />
            ))}
          </View>
        </>
      )}

      <TouchableOpacity
        style={styles.updateButton}
        onPress={updateProduct}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Update Product</Text>
        )}
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
    color: '#111827',
  },

  label: {
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 12,
    color: '#374151',
  },

  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },

  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  optionBtn: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },

  activeOption: {
    backgroundColor: '#DBEAFE',
    borderColor: '#2563EB',
  },

  imageButton: {
    backgroundColor: '#22C55E',
    padding: 14,
    borderRadius: 10,
    marginTop: 15,
  },

  updateButton: {
    backgroundColor: '#2563EB',
    padding: 15,
    borderRadius: 10,
    marginTop: 25,
    marginBottom: 40,
  },

  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
    margin: 5,
  },
});
