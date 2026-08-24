import { BASE_URL } from '../../Config/env';
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Icon from 'react-native-vector-icons/Feather';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../Theme/Colors';
import CustomAlert from '../../Components/CustomAlert';

const Crossing = () => {
  const [checked, setChecked] = useState(false);
  const [number1, setNumber1] = useState('');
  const [number2, setNumber2] = useState('');
  const [amount, setAmount] = useState('');
  const [pairs, setPairs] = useState([]);
  const prevCheckedRef = useRef(checked);
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
    return pairs.reduce((sum, item) => sum + (parseInt(item.amount) || 0), 0);
  }, [pairs]);

  const calculatePairs = (num1, num2, amt) => {
    const crossingNumbers = [];
    for (let i = 0; i < num1.length; i++) {
      const digit1 = num1[i];
      for (let j = 0; j < num2.length; j++) {
        const digit2 = num2[j];
        crossingNumbers.push({ 
          id: Math.random().toString(36).substr(2, 9), 
          pair: digit1 + digit2, 
          amount: amt 
        });
      }
    }
    return crossingNumbers;
  };

  const handleAmountChange = (text) => {
    // Only allow digits to prevent 'parseInt' from breaking on spaces/commas
    const cleanText = text.replace(/[^0-9]/g, '');
    setAmount(cleanText);
  };

  const handleNumber1Change = (text) => {
    const cleanText = text.replace(/[^0-9]/g, '');
    setNumber1(cleanText);
  };

  const handleNumber2Change = (text) => {
    const cleanText = text.replace(/[^0-9]/g, '');
    setNumber2(cleanText);
  };

  const handleAdd = () => {
    if (!number1 || !number2) {
      showAlert('Missing Info', 'Please enter both numbers for crossing.', 'warning');
      setChecked(false);
      return;
    }
    if (!amount || parseInt(amount) <= 0) {
      showAlert('Missing Info', 'Please enter a valid amount.', 'warning');
      setChecked(false);
      return;
    }
    
    const amountNumber = parseInt(amount);
    const crossingNumbers = calculatePairs(number1, number2, amountNumber);
    
    // Add new pairs to existing ones
    setPairs(prev => [...crossingNumbers, ...prev]);
    setNumber1('');
    setNumber2('');
    setAmount('');
    setChecked(false);
    Keyboard.dismiss();
  };

  useEffect(() => {
    if (prevCheckedRef.current === false && checked === true) {
      handleAdd();
    }
    prevCheckedRef.current = checked;
  }, [checked]);

  const handleRemove = (id) => {
    setPairs(prev => prev.filter(item => item.id !== id));
  };

  const handleSubmit = async () => {
    setLoading(true);
    Keyboard.dismiss();
    try {
      const token = await AsyncStorage.getItem('userToken');
      const enteredData = pairs.map(item => ({
        number: item.pair,
        amount: item.amount
      }));
      
      const payload = {
        category_id: categoryId,
        subcategory_id: subCategoryId,
        subcategory_name: "Crossing",
        entered_data: enteredData
      };

      const response = await fetch(`${BASE_URL}/user/submit-double-game`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        showAlert('Success', 'Crossing bets placed successfully!', 'success');
        setPairs([]);
      } else {
        showAlert('Error', data.error || 'Insufficient balance or invalid request.', 'error');
      }
    } catch (error) {
      setLoading(false);
      showAlert('Connection Error', 'An error occurred while communicating with the server.', 'error');
    }
  };

  const renderHeader = () => (
    <View>
      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerTitle}>CROSSING BETS</Text>
        <Text style={styles.headerSubtitle}>Generate pairs automatically</Text>
      </View>

      <View style={styles.inputCard}>
        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Number 1</Text>
            <View style={styles.inputWrapper}>
              <Icon name="hash" size={16} color={Colors.secondaryText} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Ex: 12"
                placeholderTextColor={Colors.secondaryText}
                value={number1}
                onChangeText={handleNumber1Change}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Number 2</Text>
            <View style={styles.inputWrapper}>
              <Icon name="hash" size={16} color={Colors.secondaryText} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Ex: 34"
                placeholderTextColor={Colors.secondaryText}
                value={number2}
                onChangeText={handleNumber2Change}
              />
            </View>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Amount Per Pair (₹)</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.rupeeIcon}>₹</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={Colors.secondaryText}
              value={amount}
              onChangeText={handleAmountChange}
            />
          </View>
        </View>

        <View style={styles.checkboxRow}>
          <CheckBox
            value={checked}
            onValueChange={setChecked}
            tintColors={{ true: Colors.primary, false: Colors.secondaryText }}
            boxType="square"
            onTintColor={Colors.primary}
            onCheckColor={Colors.background}
            onFillColor={Colors.primary}
          />
          <Text style={styles.checkboxLabel}>Auto-Generate & Add Crossing Pairs</Text>
        </View>

        <TouchableOpacity 
          style={[styles.addButton, (!number1 || !number2 || !amount) && styles.addButtonDisabled]} 
          onPress={handleAdd}
          disabled={!number1 || !number2 || !amount}
        >
          <Icon name="layers" size={20} color="#121212" style={{ marginRight: 8 }} />
          <Text style={styles.addButtonText}>GENERATE PAIRS</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Crossing Slip</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{pairs.length} Pairs</Text>
        </View>
      </View>
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyState}>
      <Icon name="grid" size={48} color={Colors.divider} />
      <Text style={styles.emptyText}>No crossing pairs generated</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        contentContainerStyle={styles.flatListContent}
        data={pairs}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyComponent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.betCard}>
            <View style={styles.betInfo}>
              <View style={styles.betNumberBox}>
                <Text style={styles.betNumber}>{item.pair}</Text>
              </View>
              <View>
                <Text style={styles.betTypeLabel}>Type: JODI</Text>
                <Text style={styles.betAmount}>₹ {item.amount}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.removeButton} onPress={() => handleRemove(item.id)}>
              <Icon name="trash-2" size={20} color={Colors.error} />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Sticky Footer */}
      {pairs.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹ {totalAmount}</Text>
          </View>
          <TouchableOpacity 
            style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
            onPress={handleSubmit} 
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'PROCESSING...' : 'SUBMIT ALL PAIRS'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

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
  headerTitleContainer: {
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  headerTitle: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },
  headerSubtitle: {
    color: Colors.secondaryText,
    fontSize: 14,
    marginTop: 4,
  },
  inputCard: {
    backgroundColor: Colors.primarySurface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.divider,
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  inputGroup: {
    flex: 1,
    marginHorizontal: 4,
    marginBottom: 16,
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
    height: 50,
  },
  inputIcon: {
    paddingLeft: 12,
  },
  rupeeIcon: {
    color: Colors.secondaryText,
    fontSize: 16,
    paddingLeft: 12,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    color: Colors.primaryText,
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    height: '100%',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
    backgroundColor: 'rgba(91, 92, 255, 0.1)',
    borderRadius: 8,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(91, 92, 255, 0.3)',
  },
  checkboxLabel: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#FFD700',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#555544',
    opacity: 0.5,
  },
  addButtonText: {
    color: '#121212',
    fontWeight: '900',
    fontSize: 15,
    letterSpacing: 1,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  listTitle: {
    color: Colors.primaryText,
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  badge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    color: Colors.primaryText,
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5,
    marginTop: 40,
  },
  emptyText: {
    color: Colors.secondaryText,
    fontSize: 16,
    marginTop: 12,
  },
  betCard: {
    flexDirection: 'row',
    backgroundColor: Colors.primarySurface,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.divider,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  betInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  betNumberBox: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(91, 92, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(91, 92, 255, 0.3)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  betNumber: {
    color: Colors.primary,
    fontSize: 20,
    fontWeight: '900',
  },
  betTypeLabel: {
    color: Colors.secondaryText,
    fontSize: 12,
    marginBottom: 2,
    fontWeight: '600',
  },
  betAmount: {
    color: '#20D98A',
    fontSize: 18,
    fontWeight: 'bold',
  },
  removeButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 92, 108, 0.1)',
    borderRadius: 8,
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
    color: Colors.primaryText,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
});

export default Crossing;
