import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import {
  requestLocationPermission,
  getCurrentLocation,
} from '../../utils/location';
import { Image } from 'react-native';

import api from '../../api/axios';
import { getToken, removeToken } from '../../utils/storage';

export default function ProfileScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    loadProfile();
  }, [isFocused]);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const token = await getToken();

      const response = await api.get('/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfile(response.data);
      setIsOnline(Boolean(response.data.is_online));
      console.log(JSON.stringify(response.data, null, 2));

      console.log('PROFILE DATA');
      console.log(response.data);
    } catch (error) {
      console.log('PROFILE ERROR');
      console.log(error?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await removeToken();

      if (global.setLoggedIn) {
        global.setLoggedIn(false);
      }

      console.log('LOGOUT SUCCESS');
    } catch (error) {
      console.log('LOGOUT ERROR =>', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const updateOnlineStatus = async value => {
    try {
      setIsOnline(value);

      const token = await getToken();

      await api.post(
        '/vendor-online-status',
        {
          is_online: value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await loadProfile();

      Alert.alert('Success', value ? 'Vendor Online' : 'Vendor Offline');
    } catch (error) {
      console.log(error?.response?.data);
    }
  };

  const updateLocation = async () => {
    try {
      const token = await getToken();

      const permission = await requestLocationPermission();
      console.log('PERMISSION RESULT =>', permission);
      if (!permission) {
        Alert.alert('Permission Denied');
        return;
      }

      const coords = await getCurrentLocation();

      await api.post(
        '/vendor-location',
        {
          latitude: coords.latitude,
          longitude: coords.longitude,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      Alert.alert('Success', 'Live Location Updated');
    } catch (error) {
      console.log(error?.response?.data || error.message);
      Alert.alert('Error', 'Location Update Failed');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={
            profile?.image_url
              ? {
                  uri: profile.image_url + '?t=' + Date.now(),
                }
              : require('../../assets/13.jpg')
          }
          style={styles.profileImage}
        />

        <Text style={styles.vendorName}>{profile?.name}</Text>

        <Text style={styles.shopName}>{profile?.shop_name}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{profile?.name}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{profile?.email}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Phone</Text>
        <Text style={styles.value}>{profile?.phone}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Shop Name</Text>
        <Text style={styles.value}>{profile?.shop_name}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Address</Text>
        <Text style={styles.value}>{profile?.address}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Shop Status</Text>

        <View style={styles.switchRow}>
          <Text style={styles.value}>
            {isOnline ? '🟢 Online' : '🔴 Offline'}
          </Text>

          <Switch value={isOnline} onValueChange={updateOnlineStatus} />
        </View>
      </View>

      <TouchableOpacity style={styles.locationBtn} onPress={updateLocation}>
        <Text style={styles.btnText}>Update Location</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.refreshBtn}
        onPress={() => navigation.navigate('EditProfile')}
      >
        <Text style={styles.btnText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.refreshBtn} onPress={loadProfile}>
        <Text style={styles.btnText}>Refresh Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.btnText}>Logout</Text>
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
    marginBottom: 15,
  },

  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 3,
  },

  label: {
    fontSize: 14,
    color: '#666',
  },

  value: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },

  refreshBtn: {
    backgroundColor: '#2563EB',
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },

  logoutBtn: {
    backgroundColor: '#DC2626',
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 30,
  },

  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },

  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: '#2563EB',
  },

  vendorName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },

  shopName: {
    fontSize: 16,
    color: '#666',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },

  locationBtn: {
    backgroundColor: '#059669',
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },
});
