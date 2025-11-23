import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, ScrollView } from 'react-native';
import CheckBox from '@react-native-community/checkbox'; // Updated import
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the icon library
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Crossing = () => {
  const [checked, setChecked] = useState(false);
  const [number1, setNumber1] = useState('');
  const [number2, setNumber2] = useState('');
  const [amount, setAmount] = useState('');
  const [pairs, setPairs] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const prevCheckedRef = useRef(checked);
  const [loading, setLoading] = useState(false);

  const route = useRoute();
  const { categoryId, subCategoryId } = route.params; // Access the parameters


  const calculatePairs = (num1, num2, amt) => {
    const crossingNumbers = [];
    for (let i = 0; i < num1.length; i++) {
      const digit1 = num1[i];
      for (let j = 0; j < num2.length; j++) {
        const digit2 = num2[j];
        crossingNumbers.push({ pair: digit1 + digit2, amount: amt });
      }
    }
    const totalAmount = crossingNumbers.length * amt;
    return { crossingNumbers, totalAmount };
  };

  const handleAdd = () => {
    if (number1 && number2 && amount) {
      const amountNumber = parseInt(amount);
      const { crossingNumbers, totalAmount } = calculatePairs(number1, number2, amountNumber);
      setPairs(crossingNumbers);
      setTotalAmount(totalAmount);
      setNumber1('');
      setNumber2('');
      setAmount('');
    } else {
      Alert.alert('Alert', 'Please fill in all fields before adding an item.');
    }
  };

  useEffect(() => {
    if (prevCheckedRef.current === false && checked === true) {
      handleAdd();
    }
    prevCheckedRef.current = checked;
  }, [checked]);

  const handleRemove = (index) => {
    const amountToRemove = pairs[index].amount;
    const newPairs = pairs.filter((_, i) => i !== index);
    setPairs(newPairs);
    setTotalAmount(totalAmount - amountToRemove);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken'); // Retrieve the token from AsyncStorage
      const enteredData = pairs?.map(item => ({
        number: item.pair,
        amount: item.amount
      }));
      console.log("pairs" , pairs)
      console.log("pairs" , enteredData)
      const payload = {
        category_id: categoryId,
        subcategory_id: subCategoryId,
        subcategory_name: "Crossing",
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
        // setItems([]);
      } else {
        Alert.alert('Error', data.error || 'An error occurred');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', error.message || 'An error occurred');
    }
  };

  const renderTableHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={styles.headerText}>Number Type</Text>
      <Text style={styles.headerText}>Number</Text>
      <Text style={styles.headerText}>Amount</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <CheckBox
            value={checked}
            onValueChange={setChecked}
            style={styles.checkbox} // Optional styling
            tintColors={{ true: 'black', false: 'black' }}
          />
          <Text style={styles.heading}>Crossing</Text>
        </View>
        <View style={styles.inputsContainer}>
          <TextInput
            style={[styles.input, styles.numberInput]} // Apply numberInput style
            keyboardType="numeric"
            placeholder="Number 1"
            value={number1}
            onChangeText={setNumber1}
            placeholderTextColor="gray" // Set placeholder color to black
          />
          <TextInput
            style={[styles.input, styles.numberInput]} // Apply numberInput style
            keyboardType="numeric"
            placeholder="Number 2"
            value={number2}
            onChangeText={setNumber2}
            placeholderTextColor="gray" // Set placeholder color to black
          />
        </View>
        <View style={styles.amountContainer}>
          <TextInput
            style={[styles.input, styles.amountInput]} // Apply amountInput style
            keyboardType="numeric"
            placeholder="Amount"
            value={amount}
            onChangeText={setAmount}
            placeholderTextColor="gray" // Set placeholder color to black
          />
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
        <FlatList
          ListHeaderComponent={renderTableHeader}
          data={pairs}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>Jodi</Text>
              <Text style={styles.itemText}>{item.pair}</Text>
              <Text style={styles.itemText}>{item.amount}</Text>
              <TouchableOpacity onPress={() => handleRemove(index)} style={styles.removeButton}>
                <Icon name="close" size={20} color="white" />
              </TouchableOpacity>
            </View>
          )}
        />
        {pairs.length > 0 && (
          <View style={styles.totalAmountContainer}>
            <Text style={styles.totalAmountText}>Total Amount: {totalAmount}</Text>
          </View>
        )}
      </ScrollView>
      {pairs.length > 0 && (
        <View style={styles.submitButtonContainer}>
          {/* <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Click here to Submit</Text>
          </TouchableOpacity> */}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.submitButtonText}>{loading ? 'Saving...' : 'Click here to Submit'}</Text>
        </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 80, // Make space for the Submit button
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  heading: {
    fontSize: 20,
    marginLeft: 10,
    color:"#000"
  },
  inputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    flex: 1,
    margin: 5,
    color:"#000"
  },
  numberInput: {
    height: 40, // Height for number inputs
  },
  amountContainer: {
    height: 50, // Container height for amount input
    marginBottom: 20,
  },
  amountInput: {
    height: '100%', // Ensure the input takes up the full height of the container
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerText: {
    fontWeight: 'bold',
    flex: 1,
    color:"#000"
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
     
  },
  itemText: {
    flex: 1,
    color:"#000"
  },
  removeButton: {
    backgroundColor: 'black',
    borderRadius: 50,
    padding: 2,
  },
  checkbox: {
    margin: 10, // Optional styling
  },
  addButton: {
    backgroundColor: 'black',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
  },
  totalAmountContainer: {
    marginVertical: 10,
  },
  totalAmountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color:"#000"
  },
  submitButtonContainer: {
    padding: 10,
    backgroundColor: 'lightred',
  },
  submitButton: {
    backgroundColor: 'red',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    width: '100%',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Crossing;
