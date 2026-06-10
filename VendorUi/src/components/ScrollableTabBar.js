import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

export default function ScrollableTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.wrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;

          const { options } = descriptors[route.key];

          const label = options.tabBarLabel ?? options.title ?? route.name;

          const onPress = () => {
            navigation.navigate(route.name);
          };

          return (
            <TouchableOpacity
              key={route.key}
              style={[styles.tab, focused && styles.activeTab]}
              onPress={onPress}
            >
              <Text style={[styles.label, focused && styles.activeLabel]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingVertical: 8,
  },

  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
  },

  activeTab: {
    backgroundColor: '#2563EB',
  },

  label: {
    color: '#444',
    fontWeight: '600',
  },

  activeLabel: {
    color: '#fff',
  },
});
