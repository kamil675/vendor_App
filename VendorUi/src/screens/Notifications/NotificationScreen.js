import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import api from '../../api/axios';
import { getToken } from '../../utils/storage';

export default function NotificationScreen() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);

      const token = await getToken();

      const response = await api.get('/notification-list', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const unreadResponse = await api.get('/notification-unread-count', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications(response.data);
      setUnreadCount(unreadResponse.data.unread_count);
    } catch (error) {
      console.log('NOTIFICATION ERROR');
      console.log(error?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const markRead = async id => {
    try {
      const token = await getToken();

      await api.post(
        `/notification-read/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      loadNotifications();
    } catch (error) {
      console.log(error?.response?.data);
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
      <Text style={styles.heading}>Notifications</Text>

      <Text style={styles.unreadText}>
        Unread Notifications : {unreadCount}
      </Text>

      <TouchableOpacity style={styles.refreshBtn} onPress={loadNotifications}>
        <Text style={styles.btnText}>Refresh Notifications</Text>
      </TouchableOpacity>

      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.title}>{item.title}</Text>

              <Text style={styles.message}>{item.message}</Text>

              <Text
                style={[
                  styles.status,
                  {
                    color: item.is_read ? '#22C55E' : '#EF4444',
                  },
                ]}
              >
                {item.is_read ? 'Read' : 'Unread'}
              </Text>

              {!item.is_read && (
                <TouchableOpacity
                  style={styles.readBtn}
                  onPress={() => markRead(item.id)}
                >
                  <Text style={styles.btnText}>Mark Read</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      ) : (
        <View style={styles.center}>
          <Text>No Notifications Found</Text>
        </View>
      )}
    </View>
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
    marginBottom: 10,
  },

  unreadText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  refreshBtn: {
    backgroundColor: '#2563EB',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },

  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 3,
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  message: {
    fontSize: 15,
    marginBottom: 10,
  },

  status: {
    fontWeight: 'bold',
    marginBottom: 10,
  },

  readBtn: {
    backgroundColor: '#22C55E',
    padding: 10,
    borderRadius: 8,
  },

  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
