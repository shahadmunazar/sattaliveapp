
import React, { useState, useEffect,useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const Haruf = () => {
  const [andarHarafInputs, setAndarHarafInputs] = useState([]);
  const [baharHarafInputs, setBaharHarafInputs] = useState([]);
  const [total, setTotal] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const route = useRoute();
  const { categoryId, subCategoryId } = route.params;

  useFocusEffect(
    useCallback(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await fetch(`https://liveapi.sattalives.com/api/user/play-games-haruf?category_id=${categoryId}&sub_category_id=${subCategoryId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const result = await response.json();
        console.log("345tghj", result)
        if (result.status == 200) {
          console.log("%%%%%%%%", result)
          const data = result.data;
          console.log("wertyui", data.user_amount)
          setWalletBalance(data?.user_amount || 0);
          setAndarHarafInputs((data?.play_game?.ander_harup || []).map(item => ({ number: item.number, value: item.entered_amount || '' })));
          setBaharHarafInputs((data?.play_game?.bahar_harup || []).map(item => ({ number: item.number, value: item.entered_amount || '' })));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [categoryId, subCategoryId]));

  const handleInputChange = (text, index, category) => {
    const value = parseInt(text, 10) || 0;

    if (category === 'andar') {
      const newInputs = [...andarHarafInputs];
      newInputs[index].value = value;
      setAndarHarafInputs(newInputs);
    } else {
      const newInputs = [...baharHarafInputs];
      newInputs[index].value = value;
      setBaharHarafInputs(newInputs);
    }

    const totalSum = [...andarHarafInputs, ...baharHarafInputs].reduce((sum, input) => sum + (parseInt(input.value, 10) || 0), 0);
    setTotal(totalSum);
  };

  const handleSubmit = async () => {
    try {
      // Filter out empty or zero values from the input arrays
      const filteredAndarHarafInputs = andarHarafInputs.filter(input => parseInt(input.value, 10) > 0);
      const filteredBaharHarafInputs = baharHarafInputs.filter(input => parseInt(input.value, 10) > 0);
  
      if (filteredAndarHarafInputs.length === 0 && filteredBaharHarafInputs.length === 0) {
        Alert.alert('Warning', 'Please enter valid amounts to submit.');
        return;
      }
  
      // Create the payload
      const payload = {
        entered_data: {
          ander_harup: filteredAndarHarafInputs.map(input => ({
            number: input.number,
            amount: parseInt(input.value, 10) || 0,
          })),
          bahar_harup: filteredBaharHarafInputs.map(input => ({
            number: input.number,
            amount: parseInt(input.value, 10) || 0,
          })),
        },
        category_id: categoryId,
        subcategory_id: subCategoryId,
        subcategory_name: "Harup",
      };
  
      // Log the payload to the console
      console.log("Payload to be submitted:", JSON.stringify(payload, null, 2));
  
      // Send the request
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch('https://liveapi.sattalives.com/api/user/submit-harup-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      const result = await response.json();
      console.log("Response:", result);
  
      if (result.status === 200) {
        Alert.alert('Success', 'Data submitted successfully!');
      } else {
        Alert.alert('Error', result.error || 'Failed to submit data.');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      Alert.alert('Error', 'An error occurred while submitting data.');
    }
  };

  const renderInputs = (inputs, category) => (
    <View style={styles.inputsContainer}>
      {inputs.map((input, index) => (
        <View key={index} style={styles.inputWrapper}>
          <Text style={styles.serialNumber}>{input.number}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={input.value.toString()}
            onChangeText={(text) => handleInputChange(text, index, category)}
          />
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.balanceText}>Available Wallet Balance : {walletBalance}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.categoryContainer}>
          <View style={styles.categoryColumn}>
            <Text style={styles.categoryHeading}>Andar Haraf</Text>
            {renderInputs(andarHarafInputs, 'andar')}
          </View>

          <View style={styles.categoryColumn}>
            <Text style={styles.categoryHeading}>Bahar Haraf</Text>
            {renderInputs(baharHarafInputs, 'bahar')}
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: {total}</Text>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#1E1E2C',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    marginTop: 16,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#FFD700',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  balanceText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryColumn: {
    marginBottom: 16,
    alignItems: 'center',
  },
  categoryHeading: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  inputsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  inputWrapper: {
    alignItems: 'center',
    margin: 4,
    width: '15%',
  },
  serialNumber: {
    color: '#A0A0A0',
    fontSize: 14,
    marginBottom: 4,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#1E1E2C',
    width: '100%',
    height: 45,
    textAlign: 'center',
    borderRadius: 8,
    fontSize: 16,
    borderColor: '#333344',
    borderWidth: 1,
    color: "#fff"
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1E1E2C',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#333344',
    elevation: 10,
  },
  totalText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  submitButtonText: {
    color: '#121212',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Haruf;


