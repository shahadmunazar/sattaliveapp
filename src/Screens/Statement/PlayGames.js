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

  const renderItem = ({ item, index }) => {
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
      <View style={[styles.row, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}>
        <View style={[styles.categoryContainer, styles.rightBorder]}>
          <Text style={styles.cell}>{item.category_name}</Text>
          <Text style={styles.dateText}>{item.created_at}</Text>
        </View>
        <View style={[styles.cellContainer, styles.rightBorder]}>
          <Text style={styles.cell}>{item.entered_number}({item.play_type == null ? playName : item.play_type == "bahar_harup" ? "B" +" "+ playName :"A" + " "+ playName})</Text>
        </View>
        <View style={styles.cellContainer}>
          <Text style={amountStyle}>{amountText}</Text>
        </View>
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
            <Text style={[styles.headerText, styles.rightBorder]}>Game</Text>
            <Text style={[styles.headerText, styles.rightBorder]}>No</Text>
            <Text style={styles.headerText}>Amount</Text>
          </View>
          <FlatList
            data={games}
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
  rightBorder: {
    borderRightWidth: 1,
    borderColor: '#333344',
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
    paddingHorizontal: 4,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  dateText: {
    fontSize: 12,
    color: '#A0A0A0',
    textAlign: 'center',
  },
  list: {
    flexGrow: 1,
  },
  errorText: {
    color: '#FF4C4C',
    textAlign: 'center',
    marginTop: 20,
  },
  lostAmount: {
    color: '#FF4C4C',
  },
  wonAmount: {
    color: '#00FF00',
  },
});

export default PlayGames;
