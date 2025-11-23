
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddMoneyScreen = () => {
  const [amount, setAmount] = useState('');
  const [image, setImage] = useState(null);

  const handleAddMoney = async () => {
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken'); // Retrieve the token from AsyncStorage
      if (!token) {
        throw new Error('No token found');
      }

      const formData = new FormData();
      formData.append('amount', amount);

      if (image) {
        formData.append('image', {
          uri: image.uri,
          type: image.type,
          name: image.fileName || 'image.jpg',
        });
      }

      const response = await fetch('https://liveapi.sattalives.com/api/user/add-money-to-wallet', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text(); // Get response text for detailed error message
        console.error('Server Response Error:', errorText);
        throw new Error('Network response was not ok.');
      }

      const result = await response.json();
      if (result.success) {
        Alert.alert('Success', 'Money added successfully!');
        setAmount('');
        setImage(null);
      } else {
        Alert.alert('Error', result.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Network error:', error.message); // Improved error logging
      Alert.alert('Error', 'Network error. Please try again later.');
    }
  };

  const handleSelectImage = () => {
    launchImageLibrary({}, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        setImage(response.assets[0]);
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Enter amount"
          placeholderTextColor="#888"
          value={amount}
          onChangeText={setAmount}
        />
      </View>
      <TouchableOpacity style={styles.imageButton} onPress={handleSelectImage}>
        <Text style={styles.imageButtonText}>Select Image</Text>
      </TouchableOpacity>
      {image && (
        <View style={styles.imagePreview}>
          <Image source={{ uri: image.uri }} style={styles.image} />
        </View>
      )}
      <TouchableOpacity style={styles.addButton} onPress={handleAddMoney}>
        <Text style={styles.addButtonText}>Add Money</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 14,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  imageButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginHorizontal: 20,
    marginVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  imageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  imagePreview: {
    marginVertical: 20,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
  },
  addButton: {
    backgroundColor: '#28A745',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginHorizontal: 20,
    marginVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default AddMoneyScreen;





