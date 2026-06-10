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

export default function AddDispatchScreen({ navigation }) {
  const [equipmentId, setEquipmentId] = useState('');
  const [action, setAction] = useState('');

  const submitDispatch = async () => {
    try {
      const token = await getToken();

      await api.post(
        '/dispatch-add',
        {
          equipment_request_id: equipmentId,
          action,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      Alert.alert('Success', 'Dispatch Added');

      navigation.goBack();
    } catch (error) {
      console.log(error?.response?.data || error.message);

      Alert.alert('Error', 'Unable To Add Dispatch');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Equipment Request ID"
        value={equipmentId}
        onChangeText={setEquipmentId}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        placeholder="Action"
        value={action}
        onChangeText={setAction}
        style={styles.input}
      />

      <TouchableOpacity style={styles.btn} onPress={submitDispatch}>
        <Text style={styles.btnText}>Create Dispatch</Text>
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
