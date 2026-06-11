import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from 'react-native';

import api from '../../api/axios';

export default function RegisterScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [shopName, setShopName] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');

  const registerVendor = async () => {
    try {
      if (!name || !email || !phone || !shopName || !address || !password) {
        Alert.alert('Error', 'Please fill all fields');
        return;
      }

      setLoading(true);

      const response = await api.post('/register', {
        name,
        email,
        phone,
        password,
        shop_name: shopName,
        address,
      });

      console.log(response.data);

      Alert.alert('Success', 'Registration Successful', [
        {
          text: 'Login Now',
          onPress: () => navigation.navigate('Login'),
        },
      ]);
    } catch (error) {
      console.log('Register Error:', error?.response?.data);

      Alert.alert(
        'Error',
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          'Registration Failed',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        padding: 20,
      }}
    >
      <Text style={styles.title}>Vendor Registration</Text>

      <TextInput
        placeholder="Vendor Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
        keyboardType="phone-pad"
      />

      <TextInput
        placeholder="Shop Name"
        value={shopName}
        onChangeText={setShopName}
        style={styles.input}
      />

      <TextInput
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={registerVendor}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>REGISTER</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.loginText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 40,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
  },

  button: {
    backgroundColor: '#22C55E',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },

  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  loginBtn: {
    marginTop: 20,
    marginBottom: 40,
  },

  loginText: {
    textAlign: 'center',
    color: '#1976D2',
    fontWeight: 'bold',
  },
});
