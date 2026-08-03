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

  const renderItem = ({ item, index }) => (
    <View style={[styles.row, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}>
      <View style={[styles.categoryContainer, styles.rightBorder]}>
        <Text style={styles.cell}>{item.Play_Name}</Text>
        <Text style={styles.dateText}>{item.created_at}</Text>
      </View>
      <View style={[styles.cellContainer, styles.rightBorder]}>
        <Text style={styles.cell}>{item.entered_amount}</Text>
      </View>
      <View style={styles.cellContainer}>
        <Text style={[styles.cell, item.status === 'won' && styles.wonAmount]}>
          {item.status === 'won' ? `+${item.won_amount}` : item.won_amount}
        </Text>
      </View>
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
        <View style={styles.tableWrapper}>
          <View style={styles.header}>
            <Text style={[styles.headerText, styles.rightBorder]}>Play</Text>
            <Text style={[styles.headerText, styles.rightBorder]}>Amount</Text>
            <Text style={styles.headerText}>Win Amount</Text>
          </View>
          {wins.length === 0 ? (
            <Text style={styles.noDataText}>Data Not Found</Text>
          ) : (
            <FlatList
              data={wins}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              contentContainerStyle={styles.list}
              showsHorizontalScrollIndicator={false}
            />
          )}
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#121212',
  },
  tableWrapper: {
    flex: 1,
    backgroundColor: '#1E1E2C',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333344',
    overflow: 'hidden',
  },
  dateText: {
    fontSize: 12,
    color: '#A0A0A0',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#1E1E2C',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FFD700',
  },
  categoryContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  cellContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  rightBorder: {
    borderRightWidth: 1,
    borderColor: '#333344',
  },
  headerText: {
    color: '#FFD700',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333344',
  },
  rowEven: {
    backgroundColor: '#1E1E2C',
  },
  rowOdd: {
    backgroundColor: '#171721',
  },
  cell: {
    textAlign: 'center',
    color: '#FFFFFF',
    paddingHorizontal: 8,
    textTransform: "uppercase",
    fontWeight: "500"
  },
  wonAmount: {
    color: '#00FF00', // Green color for won amounts
    fontWeight: 'bold',
  },
  list: {
    flexGrow: 1,
  },
  errorText: {
    color: '#FF4C4C',
    textAlign: 'center',
    marginTop: 20,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#A0A0A0',
    marginTop: 20,
  },
});

export default MyWin;
