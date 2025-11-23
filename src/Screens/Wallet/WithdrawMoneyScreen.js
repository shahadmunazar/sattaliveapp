
// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, TextInput, Alert, ScrollView, TouchableOpacity } from 'react-native';

// const WithdrawMoneyScreen = ({ route }) => {
//   const { method } = route.params || {}; // Get the payment method from navigation params

//   const [amount, setAmount] = useState('');
//   const [accountNumber, setAccountNumber] = useState('');
//   const [accountHolderName, setAccountHolderName] = useState('');
//   const [ifscCode, setIfscCode] = useState('');
//   // const [branchName, setBranchName] = useState('');
//   // const [bankName, setBankName] = useState('');
//   const [paymentMethod, setPaymentMethod] = useState(method || ''); // Set the payment method

//   useEffect(() => {
//     // Update the payment method state if it's changed via route params
//     if (method) {
//       setPaymentMethod(method);
//     }
//   }, [method]);

//   const handleWithdrawMoney = async () => {
//     if (isNaN(amount) || amount <= 0) {
//       Alert.alert('Invalid Amount', 'Please enter a valid amount.');
//       return;
//     }

//     if (paymentMethod === 'bank') {
//       if (!accountNumber || !accountHolderName || !ifscCode) {
//         Alert.alert('Missing Fields', 'Please fill out all bank details.');
//         return;
//       }
//     } else if (paymentMethod === 'upi') {
//       if (!accountNumber) {
//         Alert.alert('Missing Fields', 'Please enter your UPI ID.');
//         return;
//       }
//     } else {
//       Alert.alert('No Payment Method Selected', 'Please select a payment method.');
//       return;
//     }

//     try {
//       const response = await fetch('https://liveapi.sattalives.com/api/user/withdrawal-money-request', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           amount,
//           account_number: paymentMethod === 'upi' ? '' : accountNumber,
//           account_holder_name: paymentMethod === 'upi' ? '' : accountHolderName,
//           ifsc_code: paymentMethod === 'upi' ? '' : ifscCode,
//           // branch_name: paymentMethod === 'upi' ? '' : branchName,
//           // bank_name: paymentMethod === 'upi' ? '' : bankName,
//           payment_method: paymentMethod,
//           request_money: 100000,
//           mobile_no: 8077172001
//         }),
//       });

//       const result = await response.json();
//       console.log("jdgfsaud", result);
//       if (result.success) {
//         Alert.alert('Success', 'Money withdrawn successfully!');
//         // Clear form fields
//         setAmount('');
//         setAccountNumber('');
//         setAccountHolderName('');
//         setIfscCode('');
//         // setBranchName('');
//         // setBankName('');
//         setPaymentMethod('');
//       } else {
//         Alert.alert('Error', result.message || 'Something went wrong.');
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Network error. Please try again later.');
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.heading}>Withdraw Money</Text>
//       <TextInput
//         style={styles.input}
//         keyboardType="numeric"
//         placeholder="Enter amount"
//         value={amount}
//         onChangeText={setAmount}
//       />
//       {paymentMethod === 'bank' && (
//         <>
//           <TextInput
//             style={styles.input}
//             placeholder="Bank account number"
//             value={accountNumber}
//             onChangeText={setAccountNumber}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Account holder name"
//             value={accountHolderName}
//             onChangeText={setAccountHolderName}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="IFSC code"
//             value={ifscCode}
//             onChangeText={setIfscCode}
//           />
//           {/* <TextInput
//             style={styles.input}
//             placeholder="Branch name"
//             value={branchName}
//             onChangeText={setBranchName}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Bank name"
//             value={bankName}
//             onChangeText={setBankName}
//           /> */}
//         </>
//       )}
//       {paymentMethod === 'upi' && (
//         <TextInput
//           style={styles.input}
//           placeholder="Enter UPI ID"
//           value={accountNumber}
//           onChangeText={setAccountNumber}
//         />
//       )}
//       {/* <Button title="Withdraw Money" onPress={handleWithdrawMoney} color="#007BFF" /> */}
//       <TouchableOpacity style={styles.addButton} onPress={handleWithdrawMoney}>
//         <Text style={styles.addButtonText}>Withdraw Money</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#F8F9FA',
//   },
//   heading: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 24,
//     color: '#343A40',
//   },
//   addButton: {
//     width: "100%",
//     backgroundColor: '#28A745',
//     paddingVertical: 14,
//     paddingHorizontal: 30,
//     borderRadius: 8,
//     marginHorizontal: 20,
//     marginVertical: 15,
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   addButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   input: {
//     width: '100%',
//     borderWidth: 1,
//     borderColor: '#CED4DA',
//     padding: 12,
//     marginBottom: 16,
//     fontSize: 16,
//     borderRadius: 8,
//     backgroundColor: '#FFFFFF',
//   },
// });

// export default WithdrawMoneyScreen;
// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, TextInput, Alert, ScrollView, TouchableOpacity } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const WithdrawMoneyScreen = ({ route }) => {
//   const { method } = route.params || {};

//   const [amount, setAmount] = useState('');
//   const [accountNumber, setAccountNumber] = useState('');
//   const [accountHolderName, setAccountHolderName] = useState('');
//   const [ifscCode, setIfscCode] = useState('');
//   const [paymentMethod, setPaymentMethod] = useState(method || '');
//   const [mobileNo, setMobileNo] = useState('');
//   const [requestMoney, setRequestMoney] = useState('');
//   const [token, setToken] = useState('');

//   useEffect(() => {
//     if (method) {
//       setPaymentMethod(method);
//     }

//     // Fetch token from AsyncStorage
//     const fetchToken = async () => {
//       try {
//         const userToken = await AsyncStorage.getItem('userToken');
//         if (userToken) {
//           setToken(userToken);
//         }
//       } catch (error) {
//         console.error('Failed to retrieve token:', error);
//       }
//     };

//     fetchToken();
//   }, [method]);

//   const handleWithdrawMoney = async () => {
//     if (paymentMethod === 'upi') {
//       if (!mobileNo || !requestMoney) {
//         Alert.alert('Missing Fields', 'Please enter your mobile number and request money amount.');
//         return;
//       }
//     } else if (paymentMethod === 'bank') {
//       if (isNaN(amount) || amount <= 0) {
//         Alert.alert('Invalid Amount', 'Please enter a valid amount.');
//         return;
//       }
//       if (!accountNumber || !accountHolderName || !ifscCode) {
//         Alert.alert('Missing Fields', 'Please fill out all bank details.');
//         return;
//       }
//     } else {
//       Alert.alert('No Payment Method Selected', 'Please select a payment method.');
//       return;
//     }

//     try {
//       const payload = paymentMethod === 'upi' ? {
//         request_money: requestMoney,
//         mobile_no: mobileNo,
//       } : {
//         amount,
//         account_number: accountNumber,
//         account_holder_name: accountHolderName,
//         ifsc_code: ifscCode,
//         payment_method: paymentMethod,
//       };

//       const response = await fetch('https://liveapi.sattalives.com/api/user/withdrawal-money-request', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
//         },
//         body: JSON.stringify(payload),
//       });

//       const result = await response.json();
//       console.log("Response:", result);
//       if (result.success) {
//         Alert.alert('Success', 'Money withdrawn successfully!');
//         // Clear form fields
//         setAmount('');
//         setAccountNumber('');
//         setAccountHolderName('');
//         setIfscCode('');
//         setMobileNo('');
//         setRequestMoney('');
//         setPaymentMethod('');
//       } else {
//         Alert.alert('Error', result.message || 'Something went wrong.');
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Network error. Please try again later.');
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.heading}>Withdraw Money</Text>
//       {paymentMethod === 'upi' ? (
//         <>
//           <TextInput
//             style={styles.input}
//             keyboardType="numeric"
//             placeholder="Enter mobile number"
//             value={mobileNo}
//             onChangeText={setMobileNo}
//           />
//           <TextInput
//             style={styles.input}
//             keyboardType="numeric"
//             placeholder="Enter request money amount"
//             value={requestMoney}
//             onChangeText={setRequestMoney}
//           />
//         </>
//       ) : (
//         <>
//           <TextInput
//             style={styles.input}
//             keyboardType="numeric"
//             placeholder="Enter amount"
//             value={amount}
//             onChangeText={setAmount}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Bank account number"
//             value={accountNumber}
//             onChangeText={setAccountNumber}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Account holder name"
//             value={accountHolderName}
//             onChangeText={setAccountHolderName}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="IFSC code"
//             value={ifscCode}
//             onChangeText={setIfscCode}
//           />
//         </>
//       )}
//       <TouchableOpacity style={styles.addButton} onPress={handleWithdrawMoney}>
//         <Text style={styles.addButtonText}>Withdraw Money</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#F8F9FA',
//   },
//   heading: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 24,
//     color: '#343A40',
//   },
//   addButton: {
//     width: "100%",
//     backgroundColor: '#28A745',
//     paddingVertical: 14,
//     paddingHorizontal: 30,
//     borderRadius: 8,
//     marginHorizontal: 20,
//     marginVertical: 15,
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   addButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   input: {
//     width: '100%',
//     borderWidth: 1,
//     borderColor: '#CED4DA',
//     padding: 12,
//     marginBottom: 16,
//     fontSize: 16,
//     borderRadius: 8,
//     backgroundColor: '#FFFFFF',
//   },
// });

// export default WithdrawMoneyScreen;

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, ScrollView, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';

const WithdrawMoneyScreen = ({ route }) => {
  const { method } = route.params || {};

  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(method || '');
  const [mobileNo, setMobileNo] = useState('');
  const [requestMoney, setRequestMoney] = useState('');
  const [qrCodeImage, setQrCodeImage] = useState(null);
  const [token, setToken] = useState('');

  useEffect(() => {
    if (method) {
      setPaymentMethod(method);
    }

    const fetchToken = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        if (userToken) {
          setToken(userToken);
        }
      } catch (error) {
        console.error('Failed to retrieve token:', error);
      }
    };

    fetchToken();
  }, [method]);

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.error('ImagePicker Error: ', response.errorMessage);
      } else {
        const uri = response.assets[0].uri;
        setQrCodeImage(uri);
      }
    });
  };

  const handleWithdrawMoney = async () => {
    try {
      if (paymentMethod === 'upi') {
        if (!mobileNo || !requestMoney || !qrCodeImage) {
          Alert.alert('Missing Fields', 'Please enter your mobile number, request money amount, and upload a QR code image.');
          return;
        }
      } else if (paymentMethod === 'bank') {
        if (isNaN(amount) || amount <= 0) {
          Alert.alert('Invalid Amount', 'Please enter a valid amount.');
          return;
        }
        if (!accountNumber || !accountHolderName || !ifscCode) {
          Alert.alert('Missing Fields', 'Please fill out all bank details.');
          return;
        }
      } else {
        Alert.alert('No Payment Method Selected', 'Please select a payment method.');
        return;
      }

      let formData = new FormData();

      if (paymentMethod === 'upi') {
        formData.append('request_money', requestMoney);
        formData.append('mobile_no', mobileNo);
        formData.append('qr_code_image', {
          uri: qrCodeImage,
          name: 'qrcode.jpg',
          type: 'image/jpeg',
        });
      } else {
        formData.append('request_money', amount);
        formData.append('account_number', accountNumber);
        formData.append('account_holder_name', accountHolderName);
        formData.append('ifsc_code', ifscCode);
      }

      const response = await fetch('https://liveapi.sattalives.com/api/user/withdrawal-money-request', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      console.log("Response:", result);

      if (response.ok) {
        Alert.alert('Success', 'Money withdrawn successfully!');
        // Reset state after successful submission
        setAmount('');
        setAccountNumber('');
        setAccountHolderName('');
        setIfscCode('');
        setMobileNo('');
        setRequestMoney('');
        setQrCodeImage(null);
        setPaymentMethod('');
      } else {
        Alert.alert('Error', result.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Network error. Please try again later.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Withdraw Money</Text>
      {paymentMethod === 'upi' ? (
        <>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter mobile number"
            value={mobileNo}
            onChangeText={setMobileNo}
            placeholderTextColor="gray"
          />
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter request money amount"
            value={requestMoney}
            onChangeText={setRequestMoney}
            placeholderTextColor="gray"
          />
          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <Text style={styles.uploadButtonText}>Upload QR Code</Text>
          </TouchableOpacity>
          {qrCodeImage && <Image source={{ uri: qrCodeImage }} style={styles.qrImage} />}
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter amount"
            value={amount}
            onChangeText={setAmount}
             placeholderTextColor="gray"
          />
          <TextInput
            style={styles.input}
            placeholder="Bank account number"
            value={accountNumber}
            onChangeText={setAccountNumber}
             placeholderTextColor="gray"
          />
          <TextInput
            style={styles.input}
            placeholder="Account holder name"
            value={accountHolderName}
            onChangeText={setAccountHolderName}
             placeholderTextColor="gray"
          />
          <TextInput
            style={styles.input}
            placeholder="IFSC code"
            value={ifscCode}
            onChangeText={setIfscCode}
            placeholderTextColor="gray"
          />
        </>
      )}
      <TouchableOpacity style={styles.addButton} onPress={handleWithdrawMoney}>
        <Text style={styles.addButtonText}>Withdraw Money</Text>
      </TouchableOpacity>

      <View style={styles.noteCard}>
        <Text style={styles.noteText}>
          नोटः भुगतान निकालने का समय सुबह 06:30 से लेकर सुबह 11:00 तक रहेगा पेमेंट दिन में सिर्फ एक बार दी जाएगी आप कम से कम 500 रुपए निकल सकते हैं
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#343A40',
  },
  addButton: {
    width: "100%",
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
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#CED4DA',
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    color:"black"
  },
  uploadButton: {
    width: "100%",
    backgroundColor: '#007BFF',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginHorizontal: 20,
    marginVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  qrImage: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
  noteCard: {
    width: '100%',
    padding: 16,
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    borderColor: '#FFE8A1',
    borderWidth: 1,
    marginTop: 20,
  },
  noteText: {
    fontSize: 14,
    color: '#856404',
  },
});

export default WithdrawMoneyScreen;


