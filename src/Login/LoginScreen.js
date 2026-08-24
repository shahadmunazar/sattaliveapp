import { BASE_URL } from '../Config/env';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [errors, setErrors] = useState({});

  const togglePasswordVisibility = () => {
    setHidePassword(!hidePassword);
  };

  const validateMobile = (mobile) => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobile);
  };

  const handleLogin = async () => {
    const newErrors = {};
    if (!mobile) newErrors.mobile = 'Mobile number is required';
    if (!password) newErrors.password = 'Password is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile, password }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('name', data.user.name);
        await AsyncStorage.setItem('mobile', data.user.mobile);
        await AsyncStorage.setItem('balance', data.user.balance);
        await AsyncStorage.setItem('referral_code', data.user.referral_code);
        navigation.navigate('Home');
      } else {
        setErrors({ form: data.message || 'Login failed' });
      }
    } catch (error) {
      setErrors({ form: 'An error occurred. Please try again later.' });
    }
  };

  const handleInputChange = (setter, field) => (text) => {
    setter(text);

    if (field === 'mobile' && text) {
      if (!validateMobile(text)) {
        setErrors((prevErrors) => ({ ...prevErrors, mobile: 'Invalid mobile number' }));
      } else {
        setErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors.mobile;
          return newErrors;
        });
      }
    } else if (text) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleRegister = () => {
    navigation.navigate('RegisterScreen');
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

          <View style={styles.inputContainer}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue to Satta Live</Text>

            <Text style={styles.label}>Mobile Number</Text>
            <View style={styles.inputWrapper}>
              <Icon name="phone" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.mobile && styles.errorBorder]}
                value={mobile}
                onChangeText={handleInputChange(setMobile, 'mobile')}
                placeholder="Enter Mobile Number"
                placeholderTextColor="#888"
                keyboardType="phone-pad"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {errors.mobile && <Text style={styles.errorText}>{errors.mobile}</Text>}

            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Icon name="lock" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.password && styles.errorBorder]}
                secureTextEntry={hidePassword}
                value={password}
                onChangeText={handleInputChange(setPassword, 'password')}
                placeholder="Enter Password"
                placeholderTextColor="#888"
              />
              <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconContainer}>
                <Icon name={hidePassword ? 'eye-slash' : 'eye'} style={styles.icon} />
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            {errors.form && <Text style={styles.errorText}>{errors.form}</Text>}
          </View>

          <View style={styles.checkboxContainer}>
            <TouchableOpacity onPress={() => { }}>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={0.8}>
            <Text style={styles.buttonText}>LOGIN</Text>
          </TouchableOpacity>

          <View style={styles.createNewAccount}>
            <Text style={styles.createAccountText}>New To Satta Live?</Text>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.createAccountLink}>Create an account</Text>
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
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  logo: {
    width: width * 0.5,
    height: width * 0.5,
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
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
  },
  label: {
    marginBottom: 8,
    color: '#E0E0E0',
    fontSize: 14,
    fontWeight: '600',
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
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    color: '#FFFFFF',
    fontSize: 16,
  },
  errorBorder: {
    borderColor: '#FF4C4C',
    borderWidth: 1,
  },
  iconContainer: {
    padding: 10,
  },
  icon: {
    fontSize: 20,
    color: '#A0A0A0',
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    marginBottom: 25,
  },
  forgotPassword: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '600',
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 25,
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
  createNewAccount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  createAccountText: {
    fontSize: 15,
    color: '#A0A0A0',
  },
  createAccountLink: {
    fontSize: 15,
    color: '#FFD700',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  errorText: {
    color: '#FF4C4C',
    marginTop: -10,
    marginBottom: 10,
    fontSize: 12,
    marginLeft: 5,
  },
});

export default LoginScreen;
