import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import api from '../../api/axios';
import { saveToken } from '../../utils/storage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const loginVendor = async () => {
    try {
      setLoading(true);

      const response = await api.post('/login', {
        email,
        password,
      });

      const token = response.data.token;

      await saveToken(token);

      global.setLoggedIn(true);

      Alert.alert('Success', 'Login Successful');
    } catch (error) {
      console.log(error?.response?.data);

      Alert.alert(
        'Error',
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          'Login Failed',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vendor Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={loginVendor}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>LOGIN</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerBtn}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.registerText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
  },

  button: {
    backgroundColor: '#1976D2',
    padding: 15,
    borderRadius: 10,
  },

  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  registerBtn: {
    marginTop: 20,
  },

  registerText: {
    textAlign: 'center',
    color: '#1976D2',
    fontWeight: 'bold',
  },
});
