import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Feather';
import Colors from '../../Theme/Colors';
import CustomAlert from '../../Components/CustomAlert';

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
  const [loading, setLoading] = useState(false);

  // Custom Alert State
  const [alertConfig, setAlertConfig] = useState({ 
    visible: false, 
    title: '', 
    message: '', 
    type: 'error' 
  });

  const showAlert = (title, message, type = 'error') => {
    setAlertConfig({ visible: true, title, message, type });
  };

  const hideAlert = () => {
    setAlertConfig(prev => ({ ...prev, visible: false }));
  };

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
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        showAlert('Error', response.errorMessage, 'error');
      } else if (response.assets && response.assets.length > 0) {
        setQrCodeImage(response.assets[0]);
      }
    });
  };

  const handleNumberChange = (setter) => (text) => {
    setter(text.replace(/[^0-9]/g, ''));
  };

  const handleWithdrawMoney = async () => {
    try {
      if (paymentMethod === 'upi') {
        if (!mobileNo || !requestMoney || !qrCodeImage) {
          showAlert('Missing Fields', 'Please enter your mobile number, withdrawal amount, and upload your UPI QR code.', 'warning');
          return;
        }
      } else if (paymentMethod === 'bank') {
        if (isNaN(amount) || amount <= 0) {
          showAlert('Invalid Amount', 'Please enter a valid withdrawal amount.', 'warning');
          return;
        }
        if (!accountNumber || !accountHolderName || !ifscCode) {
          showAlert('Missing Fields', 'Please fill out all bank account details.', 'warning');
          return;
        }
      } else {
        showAlert('Error', 'Please select a valid payment method.', 'error');
        return;
      }

      setLoading(true);
      let formData = new FormData();

      if (paymentMethod === 'upi') {
        formData.append('request_money', requestMoney);
        formData.append('mobile_no', mobileNo);
        formData.append('qr_code_image', {
          uri: qrCodeImage.uri,
          name: qrCodeImage.fileName || 'qrcode.jpg',
          type: qrCodeImage.type || 'image/jpeg',
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
      setLoading(false);

      if (response.ok && result.success) {
        showAlert('Success', 'Withdrawal request submitted successfully! Your funds will be transferred after processing.', 'success');
        
        // Reset state
        setAmount('');
        setAccountNumber('');
        setAccountHolderName('');
        setIfscCode('');
        setMobileNo('');
        setRequestMoney('');
        setQrCodeImage(null);
      } else {
        showAlert('Withdrawal Failed', result.message || 'Something went wrong. Please check your balance.', 'error');
      }
    } catch (error) {
      setLoading(false);
      console.error('Error:', error);
      showAlert('Connection Error', 'Network error. Please try again later.', 'error');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>WITHDRAW FUNDS</Text>
          <Text style={styles.headerSubtitle}>
            {paymentMethod === 'upi' ? 'Transfer directly to your UPI ID' : 'Transfer directly to your Bank Account'}
          </Text>
        </View>

        <View style={styles.card}>
          {paymentMethod === 'upi' ? (
            <>
              <Text style={styles.inputLabel}>Mobile Number (UPI linked)</Text>
              <View style={styles.inputWrapper}>
                <Icon name="phone" size={18} color={Colors.secondaryText} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="Enter 10-digit number"
                  placeholderTextColor={Colors.secondaryText}
                  value={mobileNo}
                  onChangeText={handleNumberChange(setMobileNo)}
                  maxLength={10}
                />
              </View>

              <Text style={[styles.inputLabel, { marginTop: 16 }]}>Withdrawal Amount (₹)</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.rupeeIcon}>₹</Text>
                <TextInput
                  style={[styles.input, styles.amountInput]}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={Colors.secondaryText}
                  value={requestMoney}
                  onChangeText={handleNumberChange(setRequestMoney)}
                  maxLength={10}
                />
              </View>

              <Text style={[styles.inputLabel, { marginTop: 16 }]}>Upload UPI QR Code</Text>
              {qrCodeImage ? (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: qrCodeImage.uri }} style={styles.previewImage} />
                  <TouchableOpacity style={styles.removeImageButton} onPress={() => setQrCodeImage(null)}>
                    <Icon name="x" size={20} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.changeImageButton} onPress={pickImage}>
                    <Icon name="refresh-cw" size={16} color={Colors.primaryText} style={{ marginRight: 6 }} />
                    <Text style={styles.changeImageText}>Change QR Code</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.uploadBox} onPress={pickImage} activeOpacity={0.7}>
                  <View style={[styles.uploadIconCircle, { backgroundColor: 'rgba(91, 92, 255, 0.15)' }]}>
                    <Icon name="maximize" size={28} color={Colors.primary} />
                  </View>
                  <Text style={styles.uploadTitle}>Tap to Upload QR Code</Text>
                  <Text style={styles.uploadSubtitle}>Make sure the QR is clear and scannable</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <>
              <Text style={styles.inputLabel}>Withdrawal Amount (₹)</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.rupeeIcon}>₹</Text>
                <TextInput
                  style={[styles.input, styles.amountInput]}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={Colors.secondaryText}
                  value={amount}
                  onChangeText={handleNumberChange(setAmount)}
                  maxLength={10}
                />
              </View>

              <Text style={[styles.inputLabel, { marginTop: 16 }]}>Account Holder Name</Text>
              <View style={styles.inputWrapper}>
                <Icon name="user" size={18} color={Colors.secondaryText} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Name as per bank records"
                  placeholderTextColor={Colors.secondaryText}
                  value={accountHolderName}
                  onChangeText={setAccountHolderName}
                  autoCapitalize="words"
                />
              </View>

              <Text style={[styles.inputLabel, { marginTop: 16 }]}>Account Number</Text>
              <View style={styles.inputWrapper}>
                <Icon name="hash" size={18} color={Colors.secondaryText} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="Enter Account Number"
                  placeholderTextColor={Colors.secondaryText}
                  value={accountNumber}
                  onChangeText={handleNumberChange(setAccountNumber)}
                />
              </View>

              <Text style={[styles.inputLabel, { marginTop: 16 }]}>IFSC Code</Text>
              <View style={styles.inputWrapper}>
                <Icon name="map-pin" size={18} color={Colors.secondaryText} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. SBIN0001234"
                  placeholderTextColor={Colors.secondaryText}
                  value={ifscCode}
                  onChangeText={setIfscCode}
                  autoCapitalize="characters"
                  maxLength={11}
                />
              </View>
            </>
          )}
        </View>

        <View style={styles.noteCard}>
          <Icon name="info" size={20} color="#FFD700" style={{ marginTop: 2, marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.noteTitle}>Important Notice</Text>
            <Text style={styles.noteText}>
              नोटः भुगतान निकालने का समय सुबह 06:30 से लेकर सुबह 11:00 तक रहेगा। पेमेंट दिन में सिर्फ एक बार दी जाएगी। आप कम से कम 500 रुपए निकाल सकते हैं।
            </Text>
          </View>
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
          onPress={handleWithdrawMoney}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'PROCESSING...' : 'WITHDRAW FUNDS'}
          </Text>
        </TouchableOpacity>
      </View>

      <CustomAlert 
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={hideAlert}
        buttonText={alertConfig.type === 'error' ? 'TRY AGAIN' : 'OK'}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
    paddingHorizontal: 4,
    marginTop: 8,
  },
  headerTitle: {
    color: '#FFD700',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
  },
  headerSubtitle: {
    color: Colors.secondaryText,
    fontSize: 14,
    marginTop: 6,
  },
  card: {
    backgroundColor: Colors.primarySurface,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.divider,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  inputLabel: {
    color: Colors.primaryText,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#070A12',
    borderWidth: 1,
    borderColor: '#333344',
    borderRadius: 12,
    height: 52,
  },
  inputIcon: {
    paddingLeft: 16,
  },
  rupeeIcon: {
    color: Colors.secondaryText,
    fontSize: 20,
    paddingLeft: 16,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    color: Colors.primaryText,
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 12,
    height: '100%',
  },
  amountInput: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  uploadBox: {
    borderWidth: 2,
    borderColor: '#333344',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(91, 92, 255, 0.05)',
  },
  uploadIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadTitle: {
    color: Colors.primaryText,
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  uploadSubtitle: {
    color: Colors.secondaryText,
    fontSize: 12,
  },
  imagePreviewContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#070A12',
    padding: 16,
    borderWidth: 1,
    borderColor: '#333344',
  },
  previewImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    borderRadius: 8,
    marginBottom: 16,
  },
  removeImageButton: {
    position: 'absolute',
    top: 24,
    right: 24,
    backgroundColor: 'rgba(255, 92, 108, 0.9)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  changeImageButton: {
    flexDirection: 'row',
    backgroundColor: Colors.secondarySurface,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.divider,
    alignItems: 'center',
  },
  changeImageText: {
    color: Colors.primaryText,
    fontWeight: 'bold',
    fontSize: 14,
  },
  noteCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  noteTitle: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  noteText: {
    color: Colors.primaryText,
    fontSize: 13,
    lineHeight: 20,
    opacity: 0.9,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.primarySurface,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingBottom: Platform.OS === 'ios' ? 32 : 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
});

export default WithdrawMoneyScreen;
