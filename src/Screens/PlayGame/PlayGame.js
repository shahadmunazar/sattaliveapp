import React, { useEffect, useState,useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const PlayGame = () => {
  const navigation = useNavigation();
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
  useCallback(() => {
    const fetchCities = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken'); // Retrieve the token from AsyncStorage
        if (!token) {
          console.error('Token not found');
          setLoading(false);
          return;
        }

        const response = await axios.get('https://liveapi.sattalives.com/api/user/sub-category', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('API response:', response.data.data); // Log the entire response

        if (Array.isArray(response.data.data)) {
          setCities(response.data.data); // Assuming response.data is an array of cities
        } else {
          console.error('API response is not an array');
          setCities([]); // Set an empty array if response data is not an array
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
        setCities([]); // Set an empty array in case of error
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []));

  const handleDoublePress = (categoryId, subCategoryId) => {
    navigation.navigate('PlayGameAdd', { categoryId, subCategoryId });
    console.log('Other button pressed:', categoryId, subCategoryId);
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
    Alert.alert("Timed-out", "Game has been Timed-out Please try again later.");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#28a745" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.leftText}>Jodi : 10 x 950</Text>
        <Text style={styles.centerText}>Play Games</Text>
        <Text style={styles.rightText}>Harauf : 10 x 95</Text>
      </View>

      {cities.map((city, index) => (
        <View key={index} style={styles.cityContainer}>
          <View style={styles.cityHeader}>
            <Text style={styles.cityHeaderText}>{city.category_name}</Text>
            <Text style={styles.cityTimeText}>{city.open_time} - {city.close_time}</Text>
          </View>
          <View style={styles.buttonsContainer}>
            {city.subcategories.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.buttonWrapper,
                  !city.is_open && styles.buttonWrapperClosed
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
                  styles.buttonText,
                  !city.is_open && styles.buttonTextClosed
                ]}>{item.subcategory_name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1E1E2C',
    borderBottomWidth: 1,
    borderBottomColor: '#333344',
  },
  leftText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    backgroundColor: '#FFD700',
    color: '#121212',
    padding: 3,
    borderRadius: 15,
    fontWeight: 'bold',
  },
  centerText: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    color: "#FFD700",
    textTransform: 'uppercase',
  },
  rightText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    backgroundColor: '#FFD700',
    color: '#121212',
    padding: 3,
    borderRadius: 15,
    fontWeight: 'bold',
  },
  cityContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333344',
  },
  cityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cityHeaderText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: "#FFD700",
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cityTimeText: {
    fontSize: 15,
    color:"#A0A0A0"
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  buttonWrapper: {
    flex: 1,
    margin: 4,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFD700',
    padding: 8,
    borderRadius: 8,
  },
  buttonWrapperClosed: {
    borderColor: '#FF4C4C',
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 14,
    color: '#FFD700',
    textAlign: 'center',
    fontWeight: "bold",
    textTransform: 'uppercase',
  },
  buttonTextClosed: {
    color: '#FF4C4C',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PlayGame;
