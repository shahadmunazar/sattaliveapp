import React, { useState, useEffect ,useCallback} from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';


const Withdraw = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(
  useCallback(() => {
    const fetchWithdrawals = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          throw new Error('Token not found');
        }

        const response = await fetch('https://liveapi.sattalives.com/api/user/withdrawal-money', {
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
        setWithdrawals(data?.data || []);
      } catch (err) {
        setError('Failed to fetch withdrawal list');
        Alert.alert('Error', 'Failed to fetch withdrawal list. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchWithdrawals();
  }, []));

  const renderItem = ({ item, index }) => (
    <View style={[styles.row, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}>
      <View style={[styles.categoryContainer, styles.rightBorder]}>
        <Text style={styles.cell}>{item.mobile_no}</Text>
        <Text style={styles.dateText}>{item.created_at}</Text>
      </View>
      <View style={[styles.cellContainer, styles.rightBorder]}>
        <Text style={styles.cell}>{item.amount}</Text>
      </View>
      <View style={styles.cellContainer}>
        <Text style={styles.cell}>{item.request_money}</Text>
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
          <Text style={[styles.headerText, styles.rightBorder]}>Mobile</Text>
          <Text style={[styles.headerText, styles.rightBorder]}>Amount</Text>
          <Text style={styles.headerText}>Request</Text>
        </View>
        <FlatList
          data={withdrawals}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
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
  header: {
    flexDirection: 'row',
    backgroundColor: '#1E1E2C',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FFD700',
  },
  headerText: {
    color: '#FFD700',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  categoryContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  cellContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#A0A0A0',
    textAlign: 'center',
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
  rightBorder: {
    borderRightWidth: 1,
    borderColor: '#333344',
  },
  cell: {
    textAlign: 'center',
    color: '#FFFFFF',
    textTransform: "uppercase",
    fontWeight: "500",
  },
  list: {
    flexGrow: 1,
  },
  errorText: {
    color: '#FF4C4C',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Withdraw;
