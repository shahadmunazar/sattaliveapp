import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      const response = await fetch('https://liveapi.sattalives.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile, password }),
      });

      const data = await response.json();
      console.log('API response data:', data);

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
      console.error('API request error:', error);
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
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.title}>Welcome To SATTA LIVE</Text>
        <Text style={styles.label}>Mobile Number</Text>
        <TextInput
          style={[styles.input, errors.mobile && styles.errorBorder]}
          value={mobile}
          onChangeText={handleInputChange(setMobile, 'mobile')}
          placeholder="Enter Mobile Number"
          placeholderTextColor="gray"
          keyboardType="phone-pad"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {errors.mobile && <Text style={styles.errorText}>{errors.mobile}</Text>}
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, errors.password && styles.errorBorder]}
            secureTextEntry={hidePassword}
            value={password}
            onChangeText={handleInputChange(setPassword, 'password')}
            placeholder="Enter Password"
            placeholderTextColor="gray"

          />
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.iconContainer}>
            <Icon
              name={hidePassword ? 'eye-slash' : 'eye'}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        {errors.form && <Text style={styles.errorText}>{errors.form}</Text>}
      </View>
      <View style={styles.checkboxContainer}>
        <TouchableOpacity onPress={() => { /* handle forgot password logic here */ }}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <View style={styles.createNewAccount}>
        <Text style={styles.createAccountText}>New To Satta Live?</Text>
        <TouchableOpacity onPress={handleRegister}>
          <Text style={styles.createAccountLink}>Create an account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
  },
  label: {
    marginBottom: 5,
    color: '#000000',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    color: '#000000',
  },
  errorBorder: {
    borderColor: 'red',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  iconContainer: {
    position: 'absolute',
    right: 15,
    top: 17,
  },
  icon: {
    fontSize: 20,
    color: '#000',
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
  },
  forgotPassword: {
    fontSize: 16,
    color: '#000',
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
  createNewAccount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  createAccountText: {
    fontSize: 16,
    color: '#000000',
  },
  createAccountLink: {
    fontSize: 16,
    color: '#000',
    marginLeft: 5,
  },
  errorText: {
    color: 'red',
    marginTop: -10,
  },
});

export default LoginScreen;
