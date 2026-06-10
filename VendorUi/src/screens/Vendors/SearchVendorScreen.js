import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import api from '../../api/axios';
import { getToken } from '../../utils/storage';

export default function SearchVendorScreen({ navigation }) {
  const [keyword, setKeyword] = useState('');
  const [vendors, setVendors] = useState([]);

  const searchVendor = async text => {
    setKeyword(text);

    try {
      const token = await getToken();

      const response = await api.get(`/search-vendor?keyword=${text}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setVendors(response.data);
    } catch (error) {
      console.log(error?.response?.data);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search Vendor"
        value={keyword}
        onChangeText={searchVendor}
        style={styles.input}
      />

      <FlatList
        data={vendors}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('VendorDetails', {
                vendorId: item.id,
              })
            }
          >
            <Text style={styles.title}>{item.shop_name}</Text>

            <Text>{item.name}</Text>

            <Text>{item.phone}</Text>

            <Text>Status :{item.is_online ? ' Online' : ' Offline'}</Text>

            <Text>Tap To View Details</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#F5F7FA',
  },

  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },

  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
