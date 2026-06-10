import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';

import api from '../../api/axios';
import { getToken } from '../../utils/storage';

export default function AddEquipmentScreen() {
  const [equipment_name, setEquipmentName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');

  const saveRequest = async () => {
    try {
      const token = await getToken();

      console.log('====================');
      console.log('CREATE REQUEST TOKEN');
      console.log(token);

      const response = await api.post(
        '/equipment-request',
        {
          equipment_name,
          quantity,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log('REQUEST CREATED');
      console.log(response.data);

      Alert.alert('Success', 'Equipment Request Created');

      setEquipmentName('');
      setQuantity('');
      setDescription('');
    } catch (error) {
      console.log('REQUEST CREATE ERROR');
      console.log(error?.response?.data);

      Alert.alert('Error', 'Request Failed');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Create Equipment Request</Text>

      <TextInput
        placeholder="Equipment Name"
        value={equipment_name}
        onChangeText={setEquipmentName}
        style={styles.input}
      />

      <TextInput
        placeholder="Quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        style={[styles.input, { height: 120 }]}
      />

      <TouchableOpacity style={styles.button} onPress={saveRequest}>
        <Text style={styles.buttonText}>Submit Request</Text>
      </TouchableOpacity>
    </ScrollView>
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
    marginBottom: 20,
  },

  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },

  button: {
    backgroundColor: '#2563EB',
    padding: 15,
    borderRadius: 10,
  },

  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
