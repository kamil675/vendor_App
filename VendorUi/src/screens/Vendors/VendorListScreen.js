import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import {
  requestLocationPermission,
  getCurrentLocation,
} from '../../utils/location';

import { getDistanceKm } from '../../utils/distance';
import { useIsFocused } from '@react-navigation/native';

import api from '../../api/axios';
import { getToken } from '../../utils/storage';

export default function VendorListScreen({ navigation }) {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myLocation, setMyLocation] = useState(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadVendors();
    }
  }, [isFocused]);

  const loadVendors = async () => {
    try {
      const token = await getToken();

      let userLat = null;
      let userLng = null;

      try {
        const permission = await requestLocationPermission();

        if (permission) {
          const coords = await getCurrentLocation();

          userLat = coords.latitude;
          userLng = coords.longitude;

          setMyLocation(coords);
        }
      } catch (e) {
        console.log('LOCATION ERROR =>', e);
      }

      const response = await api.get('/nearby-vendors', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let vendorsData = response.data || [];

      if (userLat && userLng) {
        vendorsData = vendorsData.map(vendor => {
          const distance =
            vendor.latitude && vendor.longitude
              ? getDistanceKm(
                  userLat,
                  userLng,
                  parseFloat(vendor.latitude),
                  parseFloat(vendor.longitude),
                )
              : null;

          return {
            ...vendor,
            distance,
          };
        });

        vendorsData.sort((a, b) => (a.distance || 9999) - (b.distance || 9999));
      }

      setVendors(vendorsData);
    } catch (error) {
      console.log(error?.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('SearchVendor')}
      >
        <Text style={styles.btnText}>Search Vendor</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('TopRatedVendors')}
      >
        <Text style={styles.btnText}>Top Rated Vendors</Text>
      </TouchableOpacity>

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

            <Text>Status :{item.is_online ? ' 🟢 Online' : ' 🔴 Offline'}</Text>

            <Text>Rating : {item.rating || 0}</Text>

            {item.distance && (
              <Text
                style={{
                  color: '#059669',
                  fontWeight: 'bold',
                  marginTop: 5,
                }}
              >
                Distance :{item.distance.toFixed(2)} KM
              </Text>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#F5F7FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  btn: {
    backgroundColor: '#2563EB',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
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
