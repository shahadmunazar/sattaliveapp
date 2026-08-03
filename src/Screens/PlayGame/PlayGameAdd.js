import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';

const PlayGameAdd = () => {
  const route = useRoute();
  const { categoryId, subCategoryId } = route.params; // Access the parameters

  const [money, setMoney] = useState('');
  const [number, setNumber] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAddItem = () => {
    if (money && number) {
      setItems([...items, { id: Date.now().toString(), money, number }]);
      setMoney('');
      setNumber('');
    }
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleMoneyChange = (text) => {
    if (/^\d{0,10}$/.test(text)) {
      setMoney(text);
    }
  };

  const handleNumberChange = (text) => {
    if (/^\d{0,2}$/.test(text)) {
      setNumber(text);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken'); // Retrieve the token from AsyncStorage
      const enteredData = items.map(item => ({
        number: item.number,
        amount: item.money
      }));
      
      const payload = {
        category_id: categoryId,
        subcategory_id: subCategoryId,
        subcategory_name: "Double",
        entered_data: enteredData
      };

      const response = await fetch('https://liveapi.sattalives.com/api/user/submit-double-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      console.log("34567" , data)
      setLoading(false);

      if (response.ok) {
        Alert.alert('Success', 'Data submitted successfully!');
        setItems([]);
      } else {
        Alert.alert('Error', data.error || 'An error occurred');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', error.message || 'An error occurred');
    }
  };

  console.log("items: ", items);

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Number"
          value={number}
          onChangeText={handleNumberChange}
          keyboardType="numeric"
          placeholderTextColor="gray" // Set placeholder color to black
        />
        <TextInput
          style={styles.input}
          placeholder="Money"
          value={money}
          onChangeText={handleMoneyChange}
          keyboardType="numeric"
          placeholderTextColor="gray" // Set placeholder color to black
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Text style={styles.itemText}>Money: {item.money}, Number: {item.number}</Text>
            <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveItem(item.id)}>
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      {items.length > 0 && (
        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.saveButtonText}>{loading ? 'Saving...' : 'Save'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#121212',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#333344',
    backgroundColor: '#1E1E2C',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    color: "#fff"
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333344',
  },
  itemText: {
    flex: 1,
    color: "#A0A0A0",
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: '#FF4C4C',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#FFD700',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    elevation: 3,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  saveButtonText: {
    color: '#121212',
    fontWeight: 'bold',
    fontSize: 18,
  },
  addButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#121212',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PlayGameAdd;
