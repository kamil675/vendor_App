import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet,
} from 'react-native';

import api from '../../api/axios';
import { getToken } from '../../utils/storage';

export default function AddDisputeScreen({ navigation }) {
  const [orderId, setOrderId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const submitDispute = async () => {
    try {
      const token = await getToken();

      await api.post(
        '/dispute-add',
        {
          order_id: orderId,
          title,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      Alert.alert('Success', 'Dispute Created');

      navigation.goBack();
    } catch (error) {
      console.log(error?.response?.data);

      Alert.alert('Error', 'Unable To Create Dispute');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Order ID"
        style={styles.input}
        value={orderId}
        onChangeText={setOrderId}
        keyboardType="numeric"
      />

      <TextInput
        placeholder="Title"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        placeholder="Description"
        style={[styles.input, { height: 120 }]}
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity style={styles.btn} onPress={submitDispute}>
        <Text style={styles.btnText}>Submit Dispute</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },

  btn: {
    backgroundColor: '#2563EB',
    padding: 15,
    borderRadius: 10,
  },

  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
