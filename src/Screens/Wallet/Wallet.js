
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const Wallet = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
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
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 16,
    color: 'gray'
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
    backgroundColor: '#fff',
    padding: 10,
    margin: 10,
    borderRadius: 8,
    elevation: 3,
  },
  icon: {
    marginBottom: 8,
    color: 'green'
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000'
  },
  atmImage: {
    width: '100%',
    height: '50%',
    resizeMode: 'contain',
    marginTop: 16,
  },
});

export default Wallet;
