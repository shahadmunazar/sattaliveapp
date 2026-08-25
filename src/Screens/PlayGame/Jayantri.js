import { BASE_URL } from '../../Config/env';
import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard, FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import Colors from '../../Theme/Colors';
import CustomAlert from '../../Components/CustomAlert';

const Jayantri = () => {
  // Generate 100 default items (01...99, 00)
  const defaultItems = useMemo(() => {
    return Array(100).fill(null).map((_, index) => {
      const number = (index + 1).toString().padStart(2, '0'); 
      return { id: `item-${index}`, number: number === '100' ? '00' : number, value: '' };
    });
  }, []);

  const [inputValues, setInputValues] = useState(defaultItems);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  const route = useRoute();
  const { categoryId, subCategoryId } = route.params;

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

  const totalAmount = useMemo(() => {
    return inputValues.reduce((sum, item) => sum + (parseInt(item.value) || 0), 0);
  }, [inputValues]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const token = await AsyncStorage.getItem('userToken');
          const response = await fetch(`${BASE_URL}/user/play-game-jodi?category_id=${categoryId}&sub_category_id=${subCategoryId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const result = await response.json();
          if (result.status === 200) {
            const data = result.data;
            setWalletBalance(data?.user_amount || 0);

            const fetchedJodi = data?.play_game?.jodi_harup || [];
            
            // Merge fetched data into the 100 default items to ensure grid never breaks
            const merged = defaultItems.map(defaultItem => {
              const found = fetchedJodi.find(apiItem => {
                let apiNum = apiItem.number.toString().padStart(2, '0');
                if (apiNum === '100') apiNum = '00';
                return apiNum === defaultItem.number;
              });
              return {
                ...defaultItem,
                value: found && found.entered_amount ? found.entered_amount.toString() : ''
              };
            });
            setInputValues(merged);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }, [categoryId, subCategoryId, defaultItems])
  );

  const handleInputChange = (id, text) => {
    const cleanText = text.replace(/[^0-9]/g, ''); // Ensure only numbers
    setInputValues(prev => prev.map(item => 
      item.id === id ? { ...item, value: cleanText } : item
    ));
  };

  const handleSubmit = async () => {
    setLoading(true);
    Keyboard.dismiss();
    try {
      const token = await AsyncStorage.getItem('userToken');

      // Filter and format for API
      const enteredData = inputValues
        .filter(item => parseInt(item.value) > 0)
        .map(item => ({
          number: item.number === '00' ? '100' : item.number, // Server expects "100" for "00"
          amount: parseInt(item.value) || 0,
        }));

      if (enteredData.length === 0) {
        setLoading(false);
        showAlert('Warning', 'Please enter a valid amount in at least one field before submitting.', 'warning');
        return;
      }

      const payload = {
        category_id: categoryId,
        subcategory_id: subCategoryId,
        subcategory_name: "Jantri",
        entered_data: enteredData,
      };

      const response = await fetch(`${BASE_URL}/user/submit-double-game`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        showAlert('Success', 'Jantri bets submitted successfully!', 'success');
        // Clear all inputs on success
        setInputValues(defaultItems);
      } else {
        showAlert('Error', data.error || 'Failed to submit data. Insufficient balance or invalid amounts.', 'error');
      }
    } catch (error) {
      setLoading(false);
      showAlert('Connection Error', 'An error occurred while communicating with the server.', 'error');
    }
  };

  const renderHeader = () => (
    <View style={styles.walletBanner}>
      <View style={styles.walletIconContainer}>
        <Icon name="pocket" size={20} color="#FFD700" />
      </View>
      <View>
        <Text style={styles.walletLabel}>Available Wallet Balance</Text>
        <Text style={styles.walletBalance}>₹ {walletBalance}</Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        data={inputValues}
        keyExtractor={item => item.id}
        numColumns={3}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.flatListContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        initialNumToRender={15}
        removeClippedSubviews={true}
        windowSize={5}
        renderItem={({ item }) => (
          <View style={styles.inputCard}>
            <View style={styles.digitBadge}>
              <Text style={styles.digitText}>{item.number}</Text>
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={Colors.secondaryText}
                value={item.value}
                onChangeText={(text) => handleInputChange(item.id, text)}
                maxLength={6}
              />
            </View>
          </View>
        )}
      />

      {/* Sticky Footer */}
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>₹ {totalAmount}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
          onPress={handleSubmit} 
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'PROCESSING...' : 'SUBMIT ALL BETS'}
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
  flatListContent: {
    padding: 16,
    paddingBottom: 140, // Space for footer
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
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  inputCard: {
    width: '31%', // 3 columns
    flexDirection: 'column',
    backgroundColor: Colors.primarySurface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.divider,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  digitBadge: {
    backgroundColor: Colors.secondarySurface,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  digitText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '900',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    backgroundColor: Colors.background,
  },
  input: {
    flex: 1,
    color: Colors.primaryText,
    fontSize: 15,
    fontWeight: '700',
    height: 40,
    textAlign: 'center',
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

export default Jayantri;
