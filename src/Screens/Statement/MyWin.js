import React, { useState, useEffect ,useCallback} from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';


const MyWin = () => {
  const [wins, setWins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(
  useCallback(() => {
    const fetchWins = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          throw new Error('Token not found');
        }

        const response = await fetch('https://liveapi.sattalives.com/api/user/won-money-list', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setWins(data?.data || []);
      } catch (err) {
        setError('Failed to fetch won money list');
        Alert.alert('Error', 'Failed to fetch won money list. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchWins();
  }, []));

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <View style={styles.categoryContainer}>
        <Text style={styles.cell}>{item.Play_Name}</Text>
        <Text style={styles.dateText}>{item.created_at}</Text>
      </View>
      <Text style={styles.cell}>{item.entered_amount}</Text>
      <Text style={[styles.cell, item.status === 'won' && styles.wonAmount]}>
        {item.status === 'won' ? `+${item.won_amount}` : item.won_amount}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.table}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Play</Text>
            <Text style={styles.headerText}>Amount</Text>
            <Text style={styles.headerText}>Win Amount</Text>
          </View>
          {wins.length === 0 ? (
            <Text style={styles.noDataText}>Data Not Found</Text>
          ) : (
            <FlatList
              data={wins}
              keyExtractor={(item) => item.id.toString()} // Assuming each entry has a unique 'id'
              renderItem={renderItem}
              contentContainerStyle={styles.list}
              showsHorizontalScrollIndicator={false}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F8F9FA',
  },
  table: {
    flexDirection: 'column',
    paddingBottom: 16,
  },
  dateText: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#007BFF',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginBottom: 8,
  },
  categoryContainer: {
    flex: 1,
    marginRight: 8,
  },
  headerText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  row: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#FFFFFF',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    color: '#000000',
    paddingHorizontal: 8,
    textTransform:"uppercase",
    fontWeight:"500"
  },
  wonAmount: {
    color: '#28a745', // Green color for won amounts
    fontWeight: 'bold',
  },
  list: {
    flexGrow: 1,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
    marginTop: 20,
  },
});

export default MyWin;
