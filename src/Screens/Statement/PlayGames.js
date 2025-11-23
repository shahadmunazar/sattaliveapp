import React, { useState, useEffect,useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const PlayGames = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useFocusEffect(
  useCallback(() => {
    const fetchGames = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          throw new Error('Token not found');
        }

        const response = await fetch('https://liveapi.sattalives.com/api/user/all-play-game', {
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

        console.log("datttttttt" , data)
        setGames(data?.played_games || []);
      } catch (err) {
        setError('Failed to fetch games');
        Alert.alert('Error', 'Failed to fetch games. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []));

  console.log("games" , games);

  const renderItem = ({ item }) => {
    let amountText = item.entered_amount;
    let playName = item.Playing_Name.charAt(0);
    let amountStyle = styles.cell;

 
  if (item.status === 'lost') {
      amountText = `- ${item.entered_amount}`;
      amountStyle = [styles.cell, styles.lostAmount];
    } else if(item.status === 'won') {
      amountText = `+ ${item.entered_amount}`;
      amountStyle = [styles.cell, styles.wonAmount];
    }

    return (
      <View style={styles.row}>
        <View style={styles.categoryContainer}>
          <Text style={styles.cell}>{item.category_name}</Text>
          <Text style={styles.dateText}>{item.created_at}</Text>
        </View>
        <Text style={styles.cell}>{item.entered_number}({item.play_type == null ? playName : item.play_type == "bahar_harup" ? "B" +" "+ playName :"A" + " "+ playName})</Text>
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
      <ScrollView>
        <View style={styles.table}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Game</Text>
            <Text style={styles.headerText}>No</Text>
            <Text style={styles.headerText}>Amount</Text>
          </View>
          <FlatList
            data={games}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />
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
    width: '100%',
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
    width: '100%',
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
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#FFFFFF',
    width: '100%',
  },
  categoryContainer: {
    flex: 1,
    marginRight: 8,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 4,
    color: '#000000',
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  dateText: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
  },
  list: {
    flexGrow: 1,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  lostAmount: {
    color: 'red',
  },
  wonAmount: {
    color: 'green',
  },
});

export default PlayGames;
