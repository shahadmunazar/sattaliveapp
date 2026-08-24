import { BASE_URL } from '../../Config/env';
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import Colors from '../../Theme/Colors';

const PlayGame = () => {
  const navigation = useNavigation();
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCities = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.error('Token not found');
        return;
      }
      const response = await axios.get(`${BASE_URL}/user/sub-category`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (Array.isArray(response.data.data)) {
        setCities(response.data.data);
      } else {
        setCities([]);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
      setCities([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchCities();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchCities();
  };

  const handleDoublePress = (categoryId, subCategoryId) => {
    navigation.navigate('PlayGameAdd', { categoryId, subCategoryId });
  };

  const handleOtherButtonPress = (categoryId, subCategoryId, subCategoryName) => {
    switch (subCategoryName) {
      case 'Harup':
        navigation.navigate('Haruf', { categoryId, subCategoryId });
        break;
      case 'Crossing':
        navigation.navigate('Crossing', { categoryId, subCategoryId });
        break;
      case 'Jantri':
        navigation.navigate('Jayantri', { categoryId, subCategoryId });
        break;
      default:
        console.log('Other button pressed:', categoryId, subCategoryId);
    }
  };

  const handleTimedOutPress = () => {
    Alert.alert("Time Out", "This game is currently closed for betting. Please try during active hours.");
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading Games...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <Text style={styles.topHeaderTitle}>PLAY GAMES</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Payout Rates Banner */}
        <View style={styles.payoutBanner}>
          <View style={styles.payoutItem}>
            <Icon name="trending-up" size={16} color={Colors.primaryText} style={styles.payoutIcon} />
            <Text style={styles.payoutText}>Jodi: 10 × 950</Text>
          </View>
          <View style={styles.payoutDivider} />
          <View style={styles.payoutItem}>
            <Icon name="zap" size={16} color={Colors.primaryText} style={styles.payoutIcon} />
            <Text style={styles.payoutText}>Harauf: 10 × 95</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Available Markets</Text>

        {cities.map((city, index) => (
          <View key={index} style={[styles.cityCard, !city.is_open && styles.cityCardClosed]}>
            <View style={styles.cityHeader}>
              <View>
                <Text style={styles.cityHeaderText}>{city.category_name}</Text>
                <View style={styles.timeContainer}>
                  <Icon name="clock" size={12} color={Colors.secondaryText} style={{ marginRight: 4 }} />
                  <Text style={styles.cityTimeText}>{city.open_time} - {city.close_time}</Text>
                </View>
              </View>
              
              <View style={[styles.statusBadge, city.is_open ? styles.statusOpen : styles.statusClosed]}>
                <Text style={[styles.statusText, city.is_open ? styles.statusTextOpen : styles.statusTextClosed]}>
                  {city.is_open ? 'OPEN' : 'CLOSED'}
                </Text>
              </View>
            </View>

            <View style={styles.buttonsContainer}>
              {city.subcategories.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  activeOpacity={0.7}
                  style={[
                    styles.gameButton,
                    city.is_open ? styles.gameButtonOpen : styles.gameButtonClosed
                  ]}
                  onPress={() =>
                    city.is_open 
                      ? (item.subcategory_name === 'Double'
                          ? handleDoublePress(city.category_id, item.subcategory_id)
                          : handleOtherButtonPress(city.category_id, item.subcategory_id, item.subcategory_name))
                      : handleTimedOutPress()
                  }
                >
                  <Text style={[
                    styles.gameButtonText,
                    city.is_open ? styles.gameButtonTextOpen : styles.gameButtonTextClosed
                  ]}>
                    {item.subcategory_name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 12,
    color: Colors.secondaryText,
    fontSize: 14,
    fontWeight: '600',
  },
  topHeader: {
    paddingVertical: 16,
    backgroundColor: Colors.primarySurface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    alignItems: 'center',
  },
  topHeaderTitle: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
  scrollContent: {
    padding: 16,
  },
  payoutBanner: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  payoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  payoutIcon: {
    marginRight: 8,
    color: '#FFD700',
  },
  payoutText: {
    color: '#FFD700',
    fontSize: 15,
    fontWeight: '700',
  },
  payoutDivider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
  },
  sectionTitle: {
    color: Colors.primaryText,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cityCard: {
    backgroundColor: Colors.primarySurface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.divider,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  cityCardClosed: {
    opacity: 0.8,
  },
  cityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cityHeaderText: {
    fontWeight: '800',
    fontSize: 18,
    color: '#FFD700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cityTimeText: {
    fontSize: 13,
    color: Colors.secondaryText,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusOpen: {
    backgroundColor: 'rgba(32, 217, 138, 0.1)',
    borderColor: 'rgba(32, 217, 138, 0.3)',
  },
  statusClosed: {
    backgroundColor: 'rgba(255, 92, 108, 0.1)',
    borderColor: 'rgba(255, 92, 108, 0.3)',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  statusTextOpen: {
    color: Colors.live,
  },
  statusTextClosed: {
    color: Colors.error,
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gameButton: {
    width: '48%', // 2x2 grid
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameButtonOpen: {
    backgroundColor: Colors.secondarySurface,
    borderColor: '#333344',
  },
  gameButtonClosed: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(255, 92, 108, 0.3)',
  },
  gameButtonText: {
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  gameButtonTextOpen: {
    color: Colors.primaryText,
  },
  gameButtonTextClosed: {
    color: Colors.error,
  },
});

export default PlayGame;
