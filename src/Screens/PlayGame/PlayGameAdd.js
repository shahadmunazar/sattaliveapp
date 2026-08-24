import { BASE_URL } from '../../Config/env';
import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import Colors from '../../Theme/Colors';
import CustomAlert from '../../Components/CustomAlert';

const PlayGameAdd = () => {
  const route = useRoute();
  const { categoryId, subCategoryId } = route.params; 

  const [money, setMoney] = useState('');
  const [number, setNumber] = useState('');
  const [items, setItems] = useState([]);
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

  const totalAmount = useMemo(() => {
    return items.reduce((sum, item) => sum + (parseInt(item.money) || 0), 0);
  }, [items]);

  const handleAddItem = () => {
    if (!number) {
      showAlert('Missing Info', 'Please enter a number before adding a bet.', 'warning');
      return;
    }
    if (!money || parseInt(money) <= 0) {
      showAlert('Missing Info', 'Please enter a valid amount.', 'warning');
      return;
    }
    
    setItems([{ id: Date.now().toString(), money, number }, ...items]);
    setMoney('');
    setNumber('');
    Keyboard.dismiss();
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleMoneyChange = (text) => {
    if (/^\d{0,10}$/.test(text)) {
      setMoney(text);
    }
  };

  const handleNumberChange = (text) => {
    if (/^\d{0,2}$/.test(text)) {
      setNumber(text);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const enteredData = items.map(item => ({
        number: item.number,
        amount: item.money
      }));
      
      const payload = {
        category_id: categoryId,
        subcategory_id: subCategoryId,
        subcategory_name: "Double",
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
        showAlert('Success', 'Bets placed successfully!', 'success');
        setItems([]);
      } else {
        showAlert('Error', data.error || 'Insufficient balance. Please add more money to play all games.', 'error');
      }
    } catch (error) {
      setLoading(false);
      showAlert('Connection Error', error.message || 'An error occurred. Please try again.', 'error');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ADD BETS</Text>
        <Text style={styles.headerSubtitle}>Enter your numbers and amount</Text>
      </View>

      {/* Input Section */}
      <View style={styles.inputCard}>
        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Number</Text>
            <View style={styles.inputWrapper}>
              <Icon name="hash" size={16} color={Colors.secondaryText} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="00"
                value={number}
                onChangeText={handleNumberChange}
                keyboardType="numeric"
                placeholderTextColor={Colors.secondaryText}
                maxLength={2}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Amount (₹)</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.rupeeIcon}>₹</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                value={money}
                onChangeText={handleMoneyChange}
                keyboardType="numeric"
                placeholderTextColor={Colors.secondaryText}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.addButton, (!number || !money) && styles.addButtonDisabled]} 
          onPress={handleAddItem}
          disabled={!number || !money}
        >
          <Icon name="plus" size={20} color="#121212" style={{ marginRight: 8 }} />
          <Text style={styles.addButtonText}>ADD TO SLIP</Text>
        </TouchableOpacity>
      </View>

      {/* List Section */}
      <View style={styles.listContainer}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Bet Slip</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{items.length}</Text>
          </View>
        </View>
        
        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="file-text" size={48} color={Colors.divider} />
            <Text style={styles.emptyText}>No bets added yet</Text>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.betCard}>
                <View style={styles.betInfo}>
                  <View style={styles.betNumberBox}>
                    <Text style={styles.betNumber}>{item.number}</Text>
                  </View>
                  <View>
                    <Text style={styles.betAmountLabel}>Amount</Text>
                    <Text style={styles.betAmount}>₹{item.money}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveItem(item.id)}>
                  <Icon name="trash-2" size={20} color={Colors.error} />
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>

      {/* Footer Section */}
      {items.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{totalAmount}</Text>
          </View>
          <TouchableOpacity 
            style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
            onPress={handleSubmit} 
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'PROCESSING...' : 'SUBMIT ALL BETS'}
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
  header: {
    padding: 20,
    backgroundColor: Colors.primarySurface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
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
    margin: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.divider,
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
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    height: '100%',
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
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5,
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
  betAmountLabel: {
    color: Colors.secondaryText,
    fontSize: 12,
    marginBottom: 2,
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
    backgroundColor: Colors.primarySurface,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingBottom: Platform.OS === 'ios' ? 32 : 20,
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

export default PlayGameAdd;
