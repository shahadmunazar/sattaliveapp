import React, { useState, useEffect ,useCallback} from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const AddMoney = () => {
  const [addMoneyList, setAddMoneyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(
  useCallback(() => {
    const fetchAddMoneyList = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          throw new Error('Token not found');
        }

        const response = await fetch('https://liveapi.sattalives.com/api/user/add-money-list', {
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
        setAddMoneyList(data?.data || []);
      } catch (err) {
        setError('Failed to fetch add money list');
        Alert.alert('Error', 'Failed to fetch add money list. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAddMoneyList();
  }, []));

  const renderItem = ({ item, index }) => {
    let amountText = item.amount;
    let amountStyle = styles.cell;

    // Add symbols and conditional styling based on transaction_type
    if (item.transaction_type === 'credit') {
      amountText = `+ ${item.amount}`;
      amountStyle = [styles.cell, styles.creditAmount];
    } else if (item.transaction_type === 'debit') {
      amountText = `- ${item.amount}`;
      amountStyle = [styles.cell, styles.debitAmount];
    }

    return (
      <View style={[styles.row, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}>
        <View style={[styles.descriptionContainer, styles.rightBorder]}>
          <Text style={styles.descriptionText}>{item.description}</Text>
          <Text style={styles.dateText}>{item.created_at}</Text>
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
      <View style={styles.tableWrapper}>
        <View style={styles.header}>
          <Text style={[styles.headerText, styles.rightBorder, { flex: 2 }]}>Description</Text>
          <Text style={[styles.headerText, { flex: 1 }]}>Amount</Text>
        </View>
        <FlatList
          data={addMoneyList}
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
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333344',
    alignItems: 'center',
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
  descriptionContainer: {
    flex: 2,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight:"500",
    textAlign: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#A0A0A0',
    marginTop: 4,
    textAlign: 'center',
  },
  cell: {
    textAlign: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  creditAmount: {
    color: '#00FF00',
    fontWeight:"500"
  },
  debitAmount: {
    color: '#FF4C4C',
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

export default AddMoney;
