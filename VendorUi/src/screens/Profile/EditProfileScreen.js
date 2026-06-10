import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';

import { launchImageLibrary } from 'react-native-image-picker';

import api from '../../api/axios';
import { getToken } from '../../utils/storage';

export default function EditProfileScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [shopName, setShopName] = useState('');
  const [address, setAddress] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const token = await getToken();

      const response = await api.get('/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const vendor = response.data;

      setName(vendor?.name || '');
      setPhone(vendor?.phone || '');
      setShopName(vendor?.shop_name || '');
      setAddress(vendor?.address || '');

      if (vendor?.image_url) {
        setImage({
          uri: vendor.image_url,
        });
      }
      console.log('FULL RESPONSE');
      console.log(JSON.stringify(response.data, null, 2));

      console.log('IMAGE URL');
      console.log(response.data.image_url);
    } catch (error) {
      console.log('PROFILE ERROR');
      console.log(error?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const selectImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
      },
      response => {
        if (response.didCancel) {
          return;
        }

        if (response.errorCode) {
          Alert.alert('Error', response.errorMessage);
          return;
        }

        if (response.assets?.length > 0) {
          setImage(response.assets[0]);
        }
      },
    );
  };

  const updateProfile = async () => {
    try {
      setLoading(true);

      const token = await getToken();

      const formData = new FormData();

      formData.append('name', name);
      formData.append('phone', phone);
      formData.append('shop_name', shopName);
      formData.append('address', address);

      if (image?.uri && image?.fileName) {
        formData.append('image', {
          uri: image.uri,
          type: image.type || 'image/jpeg',
          name: image.fileName,
        });
      }

      const response = await api.post('/vendor-update', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);

      if (response.data.image_url) {
        setImage({
          uri: response.data.image_url + '?t=' + Date.now(),
        });
      }

      console.log('UPDATE RESPONSE');
      console.log(response.data);

      Alert.alert('Success', 'Profile Updated Successfully');

      navigation.goBack();
    } catch (error) {
      console.log('UPDATE ERROR');
      console.log(error?.response?.data);

      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Failed To Update Profile',
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && !name) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity style={styles.imagePicker} onPress={selectImage}>
        <Image
          source={
            image?.uri ? { uri: image.uri } : require('../../assets/13.jpg')
          }
          style={styles.avatar}
          resizeMode="cover"
          onLoad={() => {
            console.log('IMAGE LOADED');
          }}
          onError={e => {
            console.log('IMAGE ERROR');
            console.log(e.nativeEvent);
          }}
        />

        <Text style={styles.changeText}>Change Profile Photo</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Vendor Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <TextInput
        style={styles.input}
        placeholder="Shop Name"
        value={shopName}
        onChangeText={setShopName}
      />

      <TextInput
        style={[styles.input, styles.addressInput]}
        placeholder="Shop Address"
        multiline
        value={address}
        onChangeText={setAddress}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={updateProfile}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Updating...' : 'Update Profile'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 16,
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  imagePicker: {
    alignItems: 'center',
    marginBottom: 25,
  },

  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: '#2563EB',
  },

  changeText: {
    marginTop: 12,
    color: '#2563EB',
    fontWeight: '600',
    fontSize: 15,
  },

  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 16,
  },

  addressInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },

  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 10,
    elevation: 3,
  },

  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
