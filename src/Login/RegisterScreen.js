import React, { useState } from 'react';
import { View, Text, TextInput, Alert, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referral_code, setReferral_code] = useState('');
  const [mobileError, setMobileError] = useState('');

  const validateMobile = (mobile) => {
    const mobileRegex = /^[0-9]{10}$/; // Adjust the regex as per your requirement
    return mobileRegex.test(mobile);
  };

  const handleSubmit = () => {
    if (!name || !mobile || !password) {
      Alert.alert('Error', 'Please fill out all required fields');
      return;
    }

    if (!validateMobile(mobile)) {
      setMobileError('Invalid mobile number');
      return;
    }

    setMobileError('');

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    const formData = {
      name,
      mobile,
      password,
      referral_code,
    };

    console.log('Submitting form with data:', formData);

    fetch('https://liveapi.sattalives.com/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => {
        console.log('API response status:', response.status);
        return response.json();
      })
      .then(data => {
        console.log('API response data:', data);
        if (data.status === 'success') { // Check for status === 'success'
          Alert.alert('Success', 'Account created successfully');
          navigation.navigate('Login');
        } else {
          Alert.alert('Error', data.errors?.referral_code[0] || 'Something went wrong');
        }
      })
      .catch(error => {
        console.error('API request error:', error);
        Alert.alert('Error', 'An error occurred. Please try again later.');
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="gray"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Mobile"
        value={mobile}
        placeholderTextColor="gray"
        onChangeText={setMobile}
        keyboardType="phone-pad"
      />
      {mobileError ? <Text style={styles.errorText}>{mobileError}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="gray"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="gray"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Referral Code"
        placeholderTextColor="gray"
        value={referral_code}
        onChangeText={setReferral_code}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Already Registered? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#000000',
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 10,
    borderRadius: 5,
    color: '#000000',
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
  },
  button: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: 'green',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  link: {
    marginTop: 16,
    alignItems: 'center',
  },
  linkText: {
    color: '#000',
    fontSize: 16,
    fontWeight: "600"
  },
});

export default RegisterScreen;
