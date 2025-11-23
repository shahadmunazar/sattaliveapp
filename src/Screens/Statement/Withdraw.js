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

  const renderItem = ({ item }) => (
    <View style={styles.row}>
        <View style={styles.categoryContainer}>
        <Text style={styles.cell}>{item.mobile_no}</Text>
        <Text style={styles.dateText}>{item.created_at}</Text>
      </View>
      <Text style={styles.cell}>{item.amount}</Text>
      <Text style={styles.cell}>{item.request_money}</Text>
      {/* <Text style={styles.cell}>{item.withdrawal_status}</Text> */}

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
      <View style={styles.header}>
        <Text style={styles.headerText}>Mobile</Text>
        <Text style={styles.headerText}>Request Money</Text>
        {/* <Text style={styles.headerText}>Status</Text> */}
      </View>
      <FlatList
        data={withdrawals}
        keyExtractor={(item) => item.id.toString()} // Assuming each entry has a unique 'id'
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#007BFF',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginBottom: 10,
  },
  categoryContainer: {
    flex: 1,
    marginRight: 8,
  },
  dateText: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
  },
  headerText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#FFFFFF',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    color: '#000000',
    textTransform:"uppercase",
    fontWeight:"500"
  },
  list: {
    flexGrow: 1,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Withdraw;
