import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Feather';
import Colors from '../../Theme/Colors';
import CustomAlert from '../../Components/CustomAlert';

const AddMoneyScreen = () => {
  const [amount, setAmount] = useState('');
  const [image, setImage] = useState(null);
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
    // if (!image) {
    //   showAlert('Receipt Required', 'Please upload a screenshot of your payment receipt.', 'warning');
    //   return;
    // }

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
          uri: image.uri,
          type: image.type,
          name: image.fileName || 'receipt.jpg',
        });
      }

      const response = await fetch('https://liveapi.sattalives.com/api/user/add-money-to-wallet', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type here, let fetch handle the boundary for multipart/form-data
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server Response Error:', errorText);
        throw new Error('Network response was not ok.');
      }

      const result = await response.json();
      setLoading(false);

      if (result.success) {
        showAlert('Request Submitted', 'Your deposit request has been submitted successfully and is pending approval.', 'success');
        setAmount('');
        setImage(null);
      } else {
        showAlert('Deposit Failed', result.message || 'Something went wrong.', 'error');
      }
    } catch (error) {
      setLoading(false);
      showAlert('Connection Error', 'Network error. Please check your connection and try again.', 'error');
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
          <Text style={styles.headerSubtitle}>Enter amount and upload payment receipt</Text>
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
        </View>

        <View style={styles.card}>
          <Text style={styles.inputLabel}>Payment Receipt (Optional)</Text>
          
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
