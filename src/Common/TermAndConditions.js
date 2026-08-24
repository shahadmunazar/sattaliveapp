import { View, Text, ScrollView, StyleSheet } from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../Theme/Colors';

const TermAndConditions = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Welcome Card */}
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Ionicons name="shield-checkmark" size={32} color={Colors.gold} />
          </View>
          <Text style={styles.title}>Welcome to SattaKhabars</Text>
          <Text style={styles.description}>
            Please read our terms and conditions carefully. By using our platform, you agree to abide by the rules and payment structures outlined below.
          </Text>
        </View>

        {/* Payment Rules Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="wallet" size={24} color={Colors.gold} />
            <Text style={styles.cardTitle}>Payment Rules & Payouts</Text>
          </View>
          
          <View style={styles.ruleRow}>
            <Text style={styles.ruleLabel}>10 Single Jodi Payment</Text>
            <Text style={styles.ruleValue}>₹950</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.ruleRow}>
            <Text style={styles.ruleLabel}>10 Haruf (A.B) Payment</Text>
            <Text style={styles.ruleValue}>₹95</Text>
          </View>
          
          <View style={styles.divider} />

          <View style={styles.ruleRow}>
            <Text style={styles.ruleLabel}>Minimum Deposit</Text>
            <Text style={styles.ruleValue}>₹100</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.ruleRow}>
            <Text style={styles.ruleLabel}>Minimum Withdrawal</Text>
            <Text style={styles.ruleValue}>₹500</Text>
          </View>
        </View>

        {/* Timings & Support Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="time" size={24} color={Colors.gold} />
            <Text style={styles.cardTitle}>Availability</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="cash-outline" size={20} color={Colors.secondaryText} style={styles.infoIcon} />
            <Text style={styles.infoText}>Time of Payment Deposit: 24x7 Available</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="swap-horizontal-outline" size={20} color={Colors.secondaryText} style={styles.infoIcon} />
            <Text style={styles.infoText}>Withdrawal Processing: Instant</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="help-buoy-outline" size={20} color={Colors.secondaryText} style={styles.infoIcon} />
            <Text style={styles.infoText}>Customer Support: 10:00 AM to 10:00 PM</Text>
          </View>
        </View>

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>
          By proceeding, you confirm that you are at least 18 years of age and that participating in these activities is legal in your jurisdiction.
        </Text>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: Colors.primarySurface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.divider,
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    alignSelf: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.gold,
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.secondaryText,
    textAlign: 'center',
    lineHeight: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginLeft: 12,
  },
  ruleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  ruleLabel: {
    fontSize: 16,
    color: Colors.secondaryText,
    flex: 1,
  },
  ruleValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.gold,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    fontSize: 15,
    color: Colors.secondaryText,
    flex: 1,
  },
  disclaimer: {
    fontSize: 12,
    color: Colors.secondaryText,
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
    lineHeight: 18,
    fontStyle: 'italic',
  }
});

export default TermAndConditions;
