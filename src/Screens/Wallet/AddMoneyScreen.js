import { BASE_URL } from '../../Config/env';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Feather';
import Colors from '../../Theme/Colors';
import CustomAlert from '../../Components/CustomAlert';

const AddMoneyScreen = () => {
  const [amount, setAmount] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [loadingQr, setLoadingQr] = useState(true);

  useEffect(() => {
    const fetchQR = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          setLoadingQr(false);
          return;
        }
        const response = await fetch(`${BASE_URL}/app-settings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data && data.data && data.data.qr_code_image) {
          let qrUrl = data.data.qr_code_image;
          if (qrUrl.includes('liveapi.sattalives.com/uploads/')) {
            qrUrl = qrUrl.replace('liveapi.sattalives.com/uploads/', 'liveapi.sattalives.com/public/uploads/');
          }
          setQrCode(qrUrl);
        }
      } catch (err) {
        console.error('Failed to fetch QR code', err);
      } finally {
        setLoadingQr(false);
      }
    };
    fetchQR();
  }, []);

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

  const handleAmountChange = (text) => {
    const cleanText = text.replace(/[^0-9]/g, '');
    setAmount(cleanText);
  };

  const handleAddMoney = async () => {
    if (!amount || parseInt(amount) <= 0) {
      showAlert('Invalid Amount', 'Please enter a valid amount to deposit.', 'warning');
      return;
    }
    
    // Some platforms require a receipt image. If it's mandatory, uncomment below:
    if (!image) {
      showAlert('Receipt Required', 'Please upload a screenshot of your payment receipt.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('No token found');
      }

      const formData = new FormData();
      formData.append('amount', amount);

      if (image) {
        formData.append('image', {
          uri: Platform.OS === 'android' ? image.uri : image.uri.replace('file://', ''),
          type: image.type || 'image/jpeg',
          name: image.fileName || 'receipt.jpg',
        });
      }

      console.log('\n\n--- 🚀 POSTMAN TESTING INFO ---');
      console.log('BEARER TOKEN:', token);
      console.log('PAYLOAD:', JSON.stringify({ amount: amount, image_name: image?.fileName || 'receipt.jpg' }));
      console.log('-------------------------------\n\n');

      const response = await fetch(`${BASE_URL}/user/add-money-to-wallet`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type here, let fetch handle the boundary for multipart/form-data
        },
        body: formData,
      });

      const responseText = await response.text();
      console.log('RAW SERVER RESPONSE:', responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error('JSON Parse Failed. Raw Response:', responseText);
        throw new Error('Server returned invalid data: ' + responseText.substring(0, 50));
      }

      setLoading(false);

      if (response.ok && (result.success || result.status === 'success' || result.status === 200)) {
        showAlert('Request Submitted', 'Your deposit request has been submitted successfully and is pending approval.', 'success');
        setAmount('');
        setImage(null);
      } else {
        showAlert('Notice', result.message || 'Deposit could not be completed.', 'warning');
      }
    } catch (error) {
      setLoading(false);
      console.error('Outer Catch Hit:', error);
      showAlert('Error', error.message || 'Network error. Please try again.', 'error');
    }
  };

  const handleSelectImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        showAlert('Error', response.errorMessage, 'error');
      } else if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0]);
      }
    });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>DEPOSIT FUNDS</Text>
          <Text style={styles.headerSubtitle}>Scan the QR, enter amount, and upload receipt</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.inputLabel}>Scan to Pay</Text>
          {loadingQr ? (
            <ActivityIndicator size="large" color={Colors.primary} style={{ marginVertical: 20 }} />
          ) : qrCode ? (
            <Image source={{ uri: qrCode }} style={styles.qrImage} />
          ) : (
            <View style={styles.emptyQrContainer}>
              <Icon name="image" size={32} color={Colors.divider} />
              <Text style={styles.emptyQrText}>No QR code available</Text>
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.inputLabel}>Deposit Amount (₹)</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.rupeeIcon}>₹</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={Colors.secondaryText}
              value={amount}
              onChangeText={handleAmountChange}
              maxLength={10}
            />
          </View>
          {amount && parseInt(amount) > 0 ? (
            <View style={styles.bonusOfferContainer}>
              <Icon name="gift" size={16} color="#FFD700" />
              <Text style={styles.bonusOfferText}>
                You'll receive <Text style={styles.bonusOfferAmount}>₹{Math.floor(parseInt(amount) * 1.1).toLocaleString('en-IN')}</Text> (10% extra from bonus!)
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.inputLabel}>Payment Receipt (Mandatory)</Text>
          
          {image ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: image.uri }} style={styles.previewImage} />
              <TouchableOpacity style={styles.removeImageButton} onPress={() => setImage(null)}>
                <Icon name="x" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.changeImageButton} onPress={handleSelectImage}>
                <Icon name="refresh-cw" size={16} color={Colors.primaryText} style={{ marginRight: 6 }} />
                <Text style={styles.changeImageText}>Change Image</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.uploadBox} onPress={handleSelectImage} activeOpacity={0.7}>
              <View style={styles.uploadIconCircle}>
                <Icon name="upload-cloud" size={32} color={Colors.primary} />
              </View>
              <Text style={styles.uploadTitle}>Tap to Upload Receipt</Text>
              <Text style={styles.uploadSubtitle}>Supported formats: JPG, PNG</Text>
            </TouchableOpacity>
          )}
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
          onPress={handleAddMoney}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'PROCESSING...' : 'SUBMIT DEPOSIT'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Custom Reusable Alert Modal */}
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
  qrImage: {
    width: '100%',
    height: 250,
    resizeMode: 'contain',
    borderRadius: 8,
    backgroundColor: '#fff',
    padding: 8,
  },
  emptyQrContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  emptyQrText: {
    color: Colors.secondaryText,
    marginTop: 8,
    fontSize: 14,
  },
  inputLabel: {
    color: Colors.primaryText,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#070A12',
    borderWidth: 1,
    borderColor: '#333344',
    borderRadius: 12,
    height: 56,
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
    fontSize: 22,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    height: '100%',
  },
  bonusOfferContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  bonusOfferText: {
    color: Colors.primaryText,
    fontSize: 13,
    marginLeft: 8,
  },
  bonusOfferAmount: {
    color: '#FFD700',
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
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(91, 92, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadTitle: {
    color: Colors.primaryText,
    fontSize: 16,
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
    backgroundColor: Colors.live,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.live,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#121212',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
});

export default AddMoneyScreen;
