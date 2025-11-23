import React, { useState ,useEffect,useCallback} from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const Statements = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  useFocusEffect(
  useCallback(() => {
    const fetchTransactions = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          throw new Error('Token not found');
        }

        const response = await fetch('https://liveapi.sattalives.com/api/user/all-transaction', {
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
        setTransactions(data?.data || []);
      } catch (err) {
        setError('Failed to fetch transactions');
        Alert.alert('Error', 'Failed to fetch transactions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []));

  const renderItem = ({ item }) => {
    let amountText = item.amount;
    let amountStyle = styles.cell;

    const positiveTransactions = ['credit', 'won', 'bonus'];
    const negativeTransactions = ['debit', 'loss', 'withdrawal'];

    if (positiveTransactions.includes(item.transaction_type.toLowerCase())) {
      amountText = `+ ${item.amount}`;
      amountStyle = [styles.cell, styles.creditAmount];
    } else if (negativeTransactions.includes(item.transaction_type.toLowerCase())) {
      amountText = `- ${item.amount}`;
      amountStyle = [styles.cell, styles.debitAmount];
    }

    return (
      <View style={styles.row}>
        <View style={styles.categoryContainer}>
          <Text style={styles.cell}>{item.description}</Text>
          <Text style={styles.dateText}>{item.created_at_date}</Text>
        </View>
        <Text style={amountStyle}>{amountText}</Text>
      </View>
    );
  };

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
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()} // Assuming each transaction has a unique 'id'
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
  categoryContainer: {
    flex: 1,
    marginRight: 8,
  },
  cell: {
    flex: 1,
    textAlign: 'left',
    color: '#000000',
    paddingHorizontal: 8,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  dateText: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'left',
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#FFFFFF',
  },
  list: {
    flexGrow: 1,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  creditAmount: {
    color: 'green',
    fontWeight: 'bold',
  },
  debitAmount: {
    color: 'red',
    fontWeight: 'bold',
  },
});

export default Statements;
