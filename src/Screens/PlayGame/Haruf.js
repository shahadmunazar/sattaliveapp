import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import Colors from '../../Theme/Colors';
import CustomAlert from '../../Components/CustomAlert';

const Haruf = () => {
  const [andarHarafInputs, setAndarHarafInputs] = useState([]);
  const [baharHarafInputs, setBaharHarafInputs] = useState([]);
  const [total, setTotal] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
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

  const route = useRoute();
  const { categoryId, subCategoryId } = route.params;

  useFocusEffect(
    useCallback(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await fetch(`https://liveapi.sattalives.com/api/user/play-games-haruf?category_id=${categoryId}&sub_category_id=${subCategoryId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const result = await response.json();
        
        if (result.status == 200) {
          const data = result.data;
          setWalletBalance(data?.user_amount || 0);
          setAndarHarafInputs((data?.play_game?.ander_harup || []).map(item => ({ number: item.number, value: item.entered_amount || '' })));
          setBaharHarafInputs((data?.play_game?.bahar_harup || []).map(item => ({ number: item.number, value: item.entered_amount || '' })));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [categoryId, subCategoryId]));

  const handleInputChange = (text, index, category) => {
    const value = parseInt(text, 10) || 0;

    if (category === 'andar') {
      const newInputs = [...andarHarafInputs];
      newInputs[index].value = value;
      setAndarHarafInputs(newInputs);
    } else {
      const newInputs = [...baharHarafInputs];
      newInputs[index].value = value;
      setBaharHarafInputs(newInputs);
    }

    const totalSum = [...andarHarafInputs, ...baharHarafInputs].reduce((sum, input) => sum + (parseInt(input.value, 10) || 0), 0);
    setTotal(totalSum);
  };

  const handleSubmit = async () => {
    setLoading(true);
    Keyboard.dismiss();
    try {
      const filteredAndarHarafInputs = andarHarafInputs.filter(input => parseInt(input.value, 10) > 0);
      const filteredBaharHarafInputs = baharHarafInputs.filter(input => parseInt(input.value, 10) > 0);
  
      if (filteredAndarHarafInputs.length === 0 && filteredBaharHarafInputs.length === 0) {
        setLoading(false);
        showAlert('Warning', 'Please enter a valid amount in at least one field to submit bets.', 'warning');
        return;
      }
  
      const payload = {
        entered_data: {
          ander_harup: filteredAndarHarafInputs.map(input => ({
            number: input.number,
            amount: parseInt(input.value, 10) || 0,
          })),
          bahar_harup: filteredBaharHarafInputs.map(input => ({
            number: input.number,
            amount: parseInt(input.value, 10) || 0,
          })),
        },
        category_id: categoryId,
        subcategory_id: subCategoryId,
        subcategory_name: "Harup",
      };
  
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch('https://liveapi.sattalives.com/api/user/submit-harup-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      const result = await response.json();
      setLoading(false);
  
      if (result.status === 200) {
        showAlert('Success', 'Your bets have been submitted successfully!', 'success');
        // Reset inputs on success
        setAndarHarafInputs(andarHarafInputs.map(input => ({ ...input, value: '' })));
        setBaharHarafInputs(baharHarafInputs.map(input => ({ ...input, value: '' })));
        setTotal(0);
      } else {
        showAlert('Error', result.error || 'Failed to submit data. Insufficient balance or invalid amounts.', 'error');
      }
    } catch (error) {
      setLoading(false);
      showAlert('Connection Error', 'An error occurred while communicating with the server. Please check your internet connection.', 'error');
    }
  };

  const renderInputs = (inputs, category) => (
    <View style={styles.inputsGrid}>
      {inputs.map((input, index) => (
        <View key={index} style={styles.inputCard}>
          <View style={styles.digitBadge}>
            <Text style={styles.digitText}>{input.number}</Text>
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.rupeeIcon}>₹</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={Colors.secondaryText}
              value={input.value ? input.value.toString() : ''}
              onChangeText={(text) => handleInputChange(text, index, category)}
              maxLength={6}
            />
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Wallet Balance Banner */}
        <View style={styles.walletBanner}>
          <View style={styles.walletIconContainer}>
            <Icon name="pocket" size={20} color="#FFD700" />
          </View>
          <View>
            <Text style={styles.walletLabel}>Available Wallet Balance</Text>
            <Text style={styles.walletBalance}>₹ {walletBalance}</Text>
          </View>
        </View>

        {/* Andar Haraf Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Icon name="arrow-down-left" size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Andar Haraf</Text>
          </View>
          {renderInputs(andarHarafInputs, 'andar')}
        </View>

        {/* Bahar Haraf Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Icon name="arrow-up-right" size={20} color={Colors.accent} />
            <Text style={styles.sectionTitle}>Bahar Haraf</Text>
          </View>
          {renderInputs(baharHarafInputs, 'bahar')}
        </View>

      </ScrollView>

      {/* Footer Area */}
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>₹ {total}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>{loading ? 'PROCESSING...' : 'SUBMIT BETS'}</Text>
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
  scrollContainer: {
    padding: 16,
    paddingBottom: 140, // Space for the fixed footer
  },
  walletBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  walletIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  walletLabel: {
    color: Colors.secondaryText,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  walletBalance: {
    color: '#FFD700',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
  },
  sectionContainer: {
    backgroundColor: Colors.primarySurface,
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.divider,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    paddingBottom: 12,
  },
  sectionTitle: {
    color: Colors.primaryText,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  inputsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  inputCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.divider,
    marginBottom: 12,
    overflow: 'hidden',
  },
  digitBadge: {
    width: 40,
    height: 48,
    backgroundColor: Colors.secondarySurface,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: Colors.divider,
  },
  digitText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: '900',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  rupeeIcon: {
    color: Colors.secondaryText,
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 4,
  },
  input: {
    flex: 1,
    color: Colors.primaryText,
    fontSize: 16,
    fontWeight: '700',
    height: 48,
    paddingVertical: 0,
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
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    color: Colors.secondaryText,
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: '900',
  },
  submitButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#121212',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
});

export default Haruf;
