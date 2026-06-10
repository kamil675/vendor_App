import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  TextInput,
  RefreshControl,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import api from '../../api/axios';
import { getToken } from '../../utils/storage';

export default function CatalogueScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showActions, setShowActions] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, []),
  );

  const loadProducts = async () => {
    try {
      setLoading(true);

      const token = await getToken();

      const response = await api.get('/my-products', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts(response.data);
    } catch (error) {
      console.log(error?.response?.data);
      console.log(error?.message);
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async () => {
    try {
      if (!keyword.trim()) {
        loadProducts();
        return;
      }

      const token = await getToken();

      const response = await api.get(`/search-product?keyword=${keyword}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts(response.data);
    } catch (error) {
      console.log(error?.response?.data);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => {
    const imageUrl = item?.image_urls?.[0] || null;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate('ProductDetails', {
            productId: item.id,
          })
        }
      >
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.productImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.noImage}>
            <Text>No Image</Text>
          </View>
        )}

        <View style={styles.row}>
          <Text style={styles.productName}>{item.product_name}</Text>

          <View
            style={[
              styles.badge,
              {
                backgroundColor:
                  item.status === 'ACTIVE'
                    ? '#22C55E'
                    : item.status === 'OUT_OF_STOCK'
                    ? '#EF4444'
                    : '#F59E0B',
              },
            ]}
          >
            <Text style={styles.badgeText}>{item.status}</Text>
          </View>
        </View>

        <Text style={styles.info}>₹ {item.price}</Text>

        <Text style={styles.info}>Stock : {item.stock_qty}</Text>

        <Text style={styles.info}>Category : {item.category || 'N/A'}</Text>

        <Text style={styles.viewText}>Tap to view details →</Text>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading Products...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Product Catalogue</Text>

      <TextInput
        placeholder="Search Product..."
        value={keyword}
        onChangeText={text => {
          setKeyword(text);

          if (text === '') {
            loadProducts();
          }
        }}
        style={styles.searchInput}
      />

      <TouchableOpacity style={styles.searchButton} onPress={searchProducts}>
        <Text style={styles.buttonText}>Search Product</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.refreshButton} onPress={loadProducts}>
        <Text style={styles.buttonText}>Refresh Products</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionToggle}
        onPress={() => setShowActions(!showActions)}
      >
        <Text style={styles.actionToggleText}>
          {showActions ? '▲ Hide Tools' : '⚙ Catalogue Tools'}
        </Text>
      </TouchableOpacity>

      {showActions && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddProduct')}
          >
            <Text style={styles.buttonText}>+ Add Product</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.lowStockBtn}
            onPress={() => navigation.navigate('LowStockProducts')}
          >
            <Text style={styles.buttonText}>Low Stock Products</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.outStockBtn}
            onPress={() => navigation.navigate('OutOfStockProducts')}
          >
            <Text style={styles.buttonText}>Out Of Stock Products</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate('FeaturedProducts')}
          >
            <Text style={styles.buttonText}>Featured Products</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate('MyProducts')}
          >
            <Text style={styles.buttonText}>My Products</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No Products Found</Text>
          </View>
        }
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

  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },

  searchButton: {
    backgroundColor: '#7C3AED',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  addButton: {
    backgroundColor: '#22C55E',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  lowStockBtn: {
    backgroundColor: '#F59E0B',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  outStockBtn: {
    backgroundColor: '#EF4444',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  refreshButton: {
    backgroundColor: '#2563EB',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },

  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 3,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },

  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  info: {
    fontSize: 14,
    marginBottom: 4,
  },

  viewText: {
    marginTop: 10,
    color: '#2563EB',
    fontWeight: '600',
  },

  productImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 10,
  },

  noImage: {
    height: 180,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 10,
  },

  emptyContainer: {
    marginTop: 50,
    alignItems: 'center',
  },

  emptyText: {
    fontSize: 16,
    color: '#6B7280',
  },

  actionToggle: {
    backgroundColor: '#111827',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },

  actionToggleText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  actionsContainer: {
    marginBottom: 15,
  },

  menuButton: {
    backgroundColor: '#374151',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
});
