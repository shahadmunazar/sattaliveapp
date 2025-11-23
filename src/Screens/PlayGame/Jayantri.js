
// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
// import { useRoute } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const Jayantri = () => {
//   const [inputValues, setInputValues] = useState(Array(100).fill(null).map((_, index) => ({ number: index + 1, value: '' })));
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [walletBalance, setWalletBalance] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const route = useRoute();
//   const { categoryId, subCategoryId } = route.params;

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = await AsyncStorage.getItem('userToken');
//         const response = await fetch(`https://liveapi.sattalives.com/api/user/play-game-jodi?category_id=${categoryId}&sub_category_id=${subCategoryId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const result = await response.json();
//         if (result.status === 200) {
//           const data = result.data;
//           setWalletBalance(data.user_amount || 0); // Ensure walletBalance is set to a number
//           setInputValues(data.play_game.jodi_harup.map(item => ({ number: item.number, value: item.entered_amount || '' })));
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//   }, [categoryId, subCategoryId]);

//   const handleInputChange = (index, text) => {
//     const newValues = [...inputValues];
//     newValues[index] = { ...newValues[index], value: text }; // Ensure the specific index is updated
//     setInputValues(newValues);
//     updateTotalAmount(newValues);
//   };

//   const updateTotalAmount = (values) => {
//     const total = values.reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0);
//     setTotalAmount(total);
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     try {
//       const token = await AsyncStorage.getItem('userToken');

//       // Create enteredData with valid numbers and serial numbers
//       const enteredData = inputValues
//         .filter(item => parseFloat(item.value) > 0) // Filter out items with non-positive values
//         .map(item => ({
//           number: item.number,
//           amount: parseFloat(item.value) || 0,
//         }));

//       // If no valid data, show an alert and exit
//       if (enteredData.length === 0) {
//         Alert.alert('Validation Error', 'Please enter valid amounts before submitting.');
//         return;
//       }

//       // Create the payload
//       const payload = {
//         category_id: categoryId,
//         subcategory_id: subCategoryId,
//         subcategory_name: "Jantri",
//         entered_data: enteredData,
//       };

//       // Log the payload to the console
//       console.log("Payload to be submitted:", JSON.stringify(payload, null, 2));

//       // Send the request
//       const response = await fetch('https://liveapi.sattalives.com/api/user/submit-double-game', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       // Parse the response
//       const data = await response.json();

//       if (response.ok) {
//         Alert.alert('Success', 'Data submitted successfully!');
//       } else {
//         Alert.alert('Error', data.error || 'An error occurred');
//       }
//     } catch (error) {
//       console.error('Error submitting data:', error);
//       Alert.alert('Error', error.message || 'An error occurred');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderInputs = () => {
//     const rows = [];
//     for (let i = 0; i < 100; i += 5) {
//       rows.push(
//         <View key={i} style={styles.row}>
//           {Array.from({ length: 5 }, (_, j) => (
//             <View key={i + j} style={styles.inputContainer}>
//               <Text style={styles.rowNumber}>{inputValues[i + j].number}</Text>
//               <TextInput
//                 style={styles.input}
//                 keyboardType="numeric"
//                 value={inputValues[i + j].value}
//                 onChangeText={(text) => handleInputChange(i + j, text)}
//               />
//             </View>
//           ))}
//         </View>
//       );
//     }
//     return rows;
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.card}>
//         <Text style={styles.balanceText}>Available Wallet Balance: {walletBalance}</Text>
//       </View>
//       <ScrollView contentContainerStyle={styles.scrollViewContent}>
//         {renderInputs()}
//       </ScrollView>
//       <View style={styles.bottomContainer}>
//         <Text style={styles.totalText}>Total Amount: {totalAmount.toFixed(2)}</Text>
//         <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
//           <Text style={styles.submitButtonText}>{loading ? 'Submitting...' : 'Submit'}</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     // padding: 20,
//     backgroundColor: '#fff',
//   },
//   card: {
//     backgroundColor: '#28a745',
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 16,
//     marginTop: 16,
//     marginHorizontal: 20
//   },
//   balanceText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   scrollViewContent: {
//     flexGrow: 1,
//     padding:20
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//   },
//   inputContainer: {
//     alignItems: 'center',
//     width: '18%',
//   },
//   rowNumber: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 5,
//     color: "#000", // Changed to black
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     padding: 10,
//     width: '100%',
//     textAlign: 'center',
//     color: '#000', // Changed to black
//   },
//   bottomContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 15,
//     backgroundColor: '#f8f8f8',
//   },
//   totalText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: "#000", // Changed to black
//   },
//   submitButton: {
//     backgroundColor: 'green',
//     borderRadius: 5,
//     padding: 10,
//     alignItems: 'center',
//   },
//   submitButtonText: {
//     color: 'white',
//     fontSize: 16,
//   },
// });

// export default Jayantri;

// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
// import { useRoute } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const Jayantri = () => {
//   const [inputValues, setInputValues] = useState(
//     Array(100)
//       .fill(null)
//       .map((_, index) => ({
//         number: index === 99 ? '00' : String(index + 1).padStart(2, '0'), // Format numbers as 01, 02, ..., 99, 00
//         value: '',
//       }))
//   );
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [walletBalance, setWalletBalance] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const route = useRoute();
//   const { categoryId, subCategoryId } = route.params;

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = await AsyncStorage.getItem('userToken');
//         const response = await fetch(
//           `https://liveapi.sattalives.com/api/user/play-game-jodi?category_id=${categoryId}&sub_category_id=${subCategoryId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         const result = await response.json();
//         if (result.status === 200) {
//           const data = result.data;
//           setWalletBalance(data.user_amount || 0);
//           setInputValues(
//             data.play_game.jodi_harup.map(item => ({
//               number: item.number === 100 ? '00' : String(item.number).padStart(2, '0'),
//               value: item.entered_amount || '',
//             }))
//           );
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//   }, [categoryId, subCategoryId]);

//   const handleInputChange = (index, text) => {
//     const newValues = [...inputValues];
//     newValues[index] = { ...newValues[index], value: text };
//     setInputValues(newValues);
//     updateTotalAmount(newValues);
//   };

//   const updateTotalAmount = (values) => {
//     const total = values.reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0);
//     setTotalAmount(total);
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     try {
//       const token = await AsyncStorage.getItem('userToken');

//       const enteredData = inputValues
//         .filter(item => parseFloat(item.value) > 0)
//         .map(item => ({
//           number: item.number === '00' ? 100 : parseInt(item.number, 10), // Convert back to number for API
//           amount: parseFloat(item.value) || 0,
//         }));
//         console.log("gafd",enteredData)
//       if (enteredData.length === 0) {
//         Alert.alert('Validation Error', 'Please enter valid amounts before submitting.');
//         return;
//       }

//       const payload = {
//         category_id: categoryId,
//         subcategory_id: subCategoryId,
//         subcategory_name: "Jantri",
//         entered_data: enteredData,
//       };

//       const response = await fetch('https://liveapi.sattalives.com/api/user/submit-double-game', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         Alert.alert('Success', 'Data submitted successfully!');
//       } else {
//         Alert.alert('Error', data.error || 'An error occurred');
//       }
//     } catch (error) {
//       console.error('Error submitting data:', error);
//       Alert.alert('Error', error.message || 'An error occurred');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderInputs = () => {
//     const rows = [];
//     for (let i = 0; i < 100; i += 5) {
//       rows.push(
//         <View key={i} style={styles.row}>
//           {Array.from({ length: 5 }, (_, j) => (
//             <View key={i + j} style={styles.inputContainer}>
//               <Text style={styles.rowNumber}>{inputValues[i + j].number}</Text>
//               <TextInput
//                 style={styles.input}
//                 keyboardType="numeric"
//                 value={inputValues[i + j].value}
//                 onChangeText={(text) => handleInputChange(i + j, text)}
//               />
//             </View>
//           ))}
//         </View>
//       );
//     }
//     return rows;
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.card}>
//         <Text style={styles.balanceText}>Available Wallet Balance: {walletBalance}</Text>
//       </View>
//       <ScrollView contentContainerStyle={styles.scrollViewContent}>
//         {renderInputs()}
//       </ScrollView>
//       <View style={styles.bottomContainer}>
//         <Text style={styles.totalText}>Total Amount: {totalAmount.toFixed(2)}</Text>
//         <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
//           <Text style={styles.submitButtonText}>{loading ? 'Submitting...' : 'Submit'}</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   card: {
//     backgroundColor: '#28a745',
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 16,
//     marginTop: 16,
//     marginHorizontal: 20,
//   },
//   balanceText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   scrollViewContent: {
//     flexGrow: 1,
//     padding: 20,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//   },
//   inputContainer: {
//     alignItems: 'center',
//     width: '18%',
//   },
//   rowNumber: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 5,
//     color: '#000',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     padding: 10,
//     width: '100%',
//     textAlign: 'center',
//     color: '#000',
//   },
//   bottomContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 15,
//     backgroundColor: '#f8f8f8',
//   },
//   totalText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#000',
//   },
//   submitButton: {
//     backgroundColor: 'green',
//     borderRadius: 5,
//     padding: 10,
//     alignItems: 'center',
//   },
//   submitButtonText: {
//     color: 'white',
//     fontSize: 16,
//   },
// });

// export default Jayantri;
import React, { useState, useEffect,useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const Jayantri = () => {
  const [inputValues, setInputValues] = useState(Array(100).fill(null).map((_, index) => {
    const number = (index + 1).toString().padStart(2, '0'); // Format number as '01', '02', ..., '09', '10', ..., '99', '00'
    return { number: number === '100' ? '00' : number, value: '' };
  }));
  const [totalAmount, setTotalAmount] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const route = useRoute();
  const { categoryId, subCategoryId } = route.params;

  useFocusEffect(
  useCallback(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await fetch(`https://liveapi.sattalives.com/api/user/play-game-jodi?category_id=${categoryId}&sub_category_id=${subCategoryId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        if (result.status === 200) {
          const data = result.data;
          setWalletBalance(data.user_amount || 0); // Ensure walletBalance is set to a number
          setInputValues(data.play_game.jodi_harup.map(item => {
            const formattedNumber = item.number.toString().padStart(2, '0');
            return { number: formattedNumber === '100' ? '00' : formattedNumber, value: item.entered_amount || '' };
          }));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [categoryId, subCategoryId]));

  const handleInputChange = (index, text) => {
    const newValues = [...inputValues];
    newValues[index] = { ...newValues[index], value: text }; // Ensure the specific index is updated
    setInputValues(newValues);
    updateTotalAmount(newValues);
  };

  const updateTotalAmount = (values) => {
    const total = values.reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0);
    setTotalAmount(total);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');

      // Create enteredData with valid numbers and serial numbers
      const enteredData = inputValues
        .filter(item => parseFloat(item.value) > 0) // Filter out items with non-positive values
        .map(item => ({
          number: item.number,
          amount: parseFloat(item.value) || 0,
        }));

      // If no valid data, show an alert and exit
      if (enteredData.length === 0) {
        Alert.alert('Validation Error', 'Please enter valid amounts before submitting.');
        setLoading(false);
        return;
      }

      // Create the payload
      const payload = {
        category_id: categoryId,
        subcategory_id: subCategoryId,
        subcategory_name: "Jantri",
        entered_data: enteredData,
      };

      // Log the payload to the console
      // console.log("Payload to be submitted:", JSON.stringify(payload, null, 2));

      // Send the request
      const response = await fetch('https://liveapi.sattalives.com/api/user/submit-double-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      // Parse the response
      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Data submitted successfully!');
      } else {
        Alert.alert('Error', data.error || 'An error occurred');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      Alert.alert('Error', error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderInputs = () => {
    const rows = [];
    for (let i = 0; i < 100; i += 5) {
      rows.push(
        <View key={i} style={styles.row}>
          {Array.from({ length: 5 }, (_, j) => (
            <View key={i + j} style={styles.inputContainer}>
              <Text style={styles.rowNumber}>{inputValues[i + j].number}</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={inputValues[i + j].value}
                onChangeText={(text) => handleInputChange(i + j, text)}
              />
            </View>
          ))}
        </View>
      );
    }
    return rows;
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.balanceText}>Available Wallet Balance: {walletBalance}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {renderInputs()}
      </ScrollView>
      <View style={styles.bottomContainer}>
        <Text style={styles.totalText}>Total Amount: {totalAmount.toFixed(2)}</Text>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.submitButtonText}>{loading ? 'Submitting...' : 'Submit'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#28a745',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    marginTop: 16,
    marginHorizontal: 20,
  },
  balanceText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  inputContainer: {
    alignItems: 'center',
    width: '18%',
  },
  rowNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: "#000", // Changed to black
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    textAlign: 'center',
    color: '#000', // Changed to black
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f8f8',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "#000", // Changed to black
  },
  submitButton: {
    backgroundColor: 'green',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Jayantri;

