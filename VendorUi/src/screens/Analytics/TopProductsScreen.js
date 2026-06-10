import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';

import api from '../../api/axios';
import { getToken } from '../../utils/storage';

export default function TopProductsScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const token = await getToken();

      const res = await api.get('/top-selling-products', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setData(res.data);
      setLoading(false);
    };

    load();
  }, []);

  if (loading) return <ActivityIndicator size="large" />;

  return (
    <ScrollView style={{ padding: 15 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold' }}>
        Top Selling Products
      </Text>

      {data?.map((item, i) => (
        <View
          key={i}
          style={{ padding: 10, marginVertical: 5, backgroundColor: '#fff' }}
        >
          <Text>{item.product_name}</Text>
          <Text>Sold: {item.total_sold}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
