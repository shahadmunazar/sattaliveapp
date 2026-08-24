import { BASE_URL } from '../Config/env';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ImageBackground
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referral_code, setReferral_code] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);

  const validateMobile = (mobile) => {
    const mobileRegex = /^[0-9]{10}$/;
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

    fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          Alert.alert('Success', 'Account created successfully');
          navigation.navigate('Login');
        } else {
          Alert.alert('Error', data.errors?.referral_code?.[0] || 'Something went wrong');
        }
      })
      .catch(error => {
        Alert.alert('Error', 'An error occurred. Please try again later.');
      });
  };

  return (
    <ImageBackground
      source={require('../assests/premium_bg.jpg')}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assests/main_logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Satta Live today</Text>

          <View style={styles.inputWrapper}>
            <Icon name="user" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#888"
              value={name}
              onChangeText={setName}
              autoCorrect={false}
            />
          </View>

          <View style={[styles.inputWrapper, mobileError ? styles.errorBorder : null]}>
            <Icon name="phone" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Mobile Number"
              placeholderTextColor="#888"
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
            />
          </View>
          {mobileError ? <Text style={styles.errorText}>{mobileError}</Text> : null}

          <View style={styles.inputWrapper}>
            <Icon name="lock" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={hidePassword}
            />
            <TouchableOpacity onPress={() => setHidePassword(!hidePassword)} style={styles.iconContainer}>
              <Icon name={hidePassword ? 'eye-slash' : 'eye'} style={styles.icon} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputWrapper}>
            <Icon name="lock" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#888"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={hideConfirmPassword}
            />
            <TouchableOpacity onPress={() => setHideConfirmPassword(!hideConfirmPassword)} style={styles.iconContainer}>
              <Icon name={hideConfirmPassword ? 'eye-slash' : 'eye'} style={styles.icon} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputWrapper}>
            <Icon name="gift" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Referral Code (Optional)"
              placeholderTextColor="#888"
              value={referral_code}
              onChangeText={setReferral_code}
              autoCapitalize="characters"
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit} activeOpacity={0.8}>
            <Text style={styles.buttonText}>SIGN UP</Text>
          </TouchableOpacity>

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Already Registered?</Text>
            <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.linkText}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  logo: {
    width: width * 0.45,
    height: width * 0.45,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFD700',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#A0A0A0',
    marginBottom: 25,
    textAlign: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 30, 44, 0.7)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333344',
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  inputIcon: {
    fontSize: 20,
    color: '#FFD700',
    marginRight: 10,
    width: 20,
    textAlign: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    color: '#FFFFFF',
    fontSize: 16,
  },
  errorBorder: {
    borderColor: '#FF4C4C',
  },
  iconContainer: {
    padding: 10,
  },
  icon: {
    fontSize: 20,
    color: '#A0A0A0',
  },
  errorText: {
    color: '#FF4C4C',
    marginTop: -10,
    marginBottom: 10,
    fontSize: 12,
    marginLeft: 5,
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 25,
    marginTop: 10,
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#121212',
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 1,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 15,
    color: '#A0A0A0',
  },
  link: {
    marginLeft: 8,
  },
  linkText: {
    color: '#FFD700',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
