
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const Wallet = () => {
  const navigation = useNavigation();
  const { result: resultLoginUser } = useSelector((state) => state.login.LoginUser);
  const balance = resultLoginUser?.data?.balance || 0;

  return (
    <View style={styles.container}>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceTitle}>Available Balance</Text>
        <Text style={styles.balanceAmount}>₹ {balance}</Text>
      </View>
      {/* <Text style={styles.heading}>Add Money</Text>

      <View style={styles.cardRow}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('AddMoney')}
        >
          <Icon name="credit-card" size={30} color="#000" style={styles.icon} />
          <Text style={styles.cardText}>UPI</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('AddMoney')}
        >
          <Icon name="credit-card" size={30} color="#000" style={styles.icon} />
          <Text style={styles.cardText}>PayTM</Text>
        </TouchableOpacity>
      </View> */}

      <Text style={styles.heading}>Withdraw Money</Text>
      <View style={styles.cardRow}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('WithdrawMoney', { method: 'bank' })}
        >
          <Icon name="bank" size={30} color="#000" style={styles.icon} />
          <Text style={styles.cardText}>Bank</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('WithdrawMoney', { method: 'upi' })}
        >
          <Icon name="credit-card" size={30} color="#000" style={styles.icon} />
          <Text style={styles.cardText}>UPI</Text>
        </TouchableOpacity>
      </View>

      {/* <View style={styles.cardRow}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('WithdrawMoney', { method: 'upi' })}
        >
          <Icon name="google-wallet" size={30} color="#000" style={styles.icon} />
          <Text style={styles.cardText}>Google Pay</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('WithdrawMoney', { method: 'upi' })}
        >
          <Icon name="credit-card" size={30} color="#000" style={styles.icon} />
          <Text style={styles.cardText}>PhonePe</Text>
        </TouchableOpacity>
      </View> */}

      <Image
        source={{ uri: 'https://example.com/atm-image.png' }}
        style={styles.atmImage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#121212',
  },
  balanceCard: {
    backgroundColor: '#FFD700',
    padding: 25,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 8,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  balanceTitle: {
    fontSize: 16,
    color: '#121212',
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 10,
  },
  balanceAmount: {
    fontSize: 42,
    fontWeight: '900',
    color: '#121212',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 16,
    color: '#FFD700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E1E2C',
    padding: 15,
    margin: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333344',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  icon: {
    marginBottom: 8,
    color: '#FFD700',
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  atmImage: {
    width: '100%',
    height: '50%',
    resizeMode: 'contain',
    marginTop: 16,
  },
});

export default Wallet;
