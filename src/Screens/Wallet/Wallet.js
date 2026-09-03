import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Colors from '../../Theme/Colors';

const Wallet = () => {
  const navigation = useNavigation();
  const { result: resultLoginUser } = useSelector((state) => state.login.LoginUser);
  const balance = resultLoginUser?.data?.balance || 0;
  const bonusBalance = resultLoginUser?.data?.bonus_balance || 0;


  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      {/* Premium Balance Card */}
      <View style={styles.balanceCardWrapper}>
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <View style={styles.walletIconBox}>
              <Icon name="pocket" size={24} color="#121212" />
            </View>
            <Text style={styles.balanceTitle}>Available Balance</Text>
          </View>
          <Text style={styles.balanceAmount}>₹ {balance.toLocaleString('en-IN')}</Text>
          
          <View style={styles.balanceFooter}>
            <Text style={styles.statusText}>
              <Icon name="check-circle" size={12} color="#121212" /> Verified Wallet
            </Text>
          </View>
        </View>
        
        {/* Bonus Balance Card */}
        <View style={styles.bonusCard}>
          <View style={styles.balanceHeader}>
            <View style={[styles.walletIconBox, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
              <Icon name="gift" size={24} color="#FFF" />
            </View>
            <Text style={[styles.balanceTitle, { color: 'rgba(255, 255, 255, 0.9)' }]}>Bonus Balance</Text>
          </View>
          <Text style={[styles.balanceAmount, { color: '#FFF' }]}>₹ {bonusBalance.toLocaleString('en-IN')}</Text>
          
          <View style={[styles.balanceFooter, { borderTopColor: 'rgba(255, 255, 255, 0.2)' }]}>
            <Text style={[styles.statusText, { color: '#FFF' }]}>
              <Icon name="award" size={12} color="#FFF" /> Promotional Bonus
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        
        {/* Deposit Section (Uncommented and Redesigned) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.heading}>Deposit Funds</Text>
        </View>
        <View style={styles.cardRow}>
          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('AddMoney')}
          >
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(32, 217, 138, 0.15)' }]}>
              <Icon name="arrow-down-circle" size={28} color={Colors.live} />
            </View>
            <Text style={styles.cardText}>Add Money</Text>
            <Text style={styles.cardSubText}>Instant via UPI</Text>
          </TouchableOpacity>
        </View>

        {/* Withdraw Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.heading}>Withdraw Winnings</Text>
        </View>
        <View style={styles.cardRow}>
          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('WithdrawMoney', { method: 'bank' })}
          >
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(255, 215, 0, 0.15)' }]}>
              <Icon name="briefcase" size={28} color="#FFD700" />
            </View>
            <Text style={styles.cardText}>Bank Transfer</Text>
            <Text style={styles.cardSubText}>NEFT / IMPS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('WithdrawMoney', { method: 'upi' })}
          >
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(91, 92, 255, 0.15)' }]}>
              <Icon name="smartphone" size={28} color={Colors.primary} />
            </View>
            <Text style={styles.cardText}>UPI Transfer</Text>
            <Text style={styles.cardSubText}>GPay / PhonePe</Text>
          </TouchableOpacity>
        </View>

        {/* Empty State / Decorative Section */}
        <View style={styles.emptyStateContainer}>
          <View style={styles.decorativeCircle}>
            <Icon name="shield" size={48} color={Colors.divider} />
          </View>
          <Text style={styles.secureText}>100% Secure & Encrypted</Text>
          <Text style={styles.secureSubText}>Your transactions and data are protected with bank-grade security protocols.</Text>
        </View>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  balanceCardWrapper: {
    padding: 16,
    paddingTop: 24,
  },
  balanceCard: {
    backgroundColor: '#FFD700',
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    elevation: 10,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  bonusCard: {
    backgroundColor: '#9C27B0',
    borderRadius: 24,
    padding: 24,
    elevation: 10,
    shadowColor: '#9C27B0',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  walletIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(18, 18, 18, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  balanceTitle: {
    fontSize: 15,
    color: 'rgba(18, 18, 18, 0.7)',
    textTransform: 'uppercase',
    fontWeight: '800',
    letterSpacing: 1,
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: '900',
    color: '#121212',
    marginBottom: 20,
    letterSpacing: -1,
  },
  balanceFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(18, 18, 18, 0.1)',
    paddingTop: 16,
  },
  statusText: {
    fontSize: 13,
    color: '#121212',
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  sectionHeader: {
    marginBottom: 16,
    marginTop: 8,
  },
  heading: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primaryText,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.primarySurface,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: Colors.divider,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardText: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.primaryText,
    marginBottom: 4,
  },
  cardSubText: {
    fontSize: 12,
    color: Colors.secondaryText,
    fontWeight: '600',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    padding: 24,
    backgroundColor: 'rgba(18, 18, 18, 0.5)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  decorativeCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  secureText: {
    color: Colors.primaryText,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  secureSubText: {
    color: Colors.secondaryText,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
  },
});

export default Wallet;
