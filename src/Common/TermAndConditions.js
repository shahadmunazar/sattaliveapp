import { View, Text, ScrollView, StyleSheet } from 'react-native';
import React from 'react';

const TermAndConditions = () => {
  return (
    <View style={styles.termsContainer}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.termsTitle}>Terms & Conditions</Text>
        <Text style={styles.termsContent}>Welcome to SattaKhabars</Text>
        <Text style={styles.termsContent}>10 Single Jodi Payment = ₹950</Text>
        <Text style={styles.termsContent}>10 Haruf (A.B) Payment = ₹95</Text>
        <Text style={styles.termsContent}>Time of Payment Deposit: 24x7 Available</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  termsContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  scrollViewContent: {
    alignItems: 'center', // Centers content horizontally
  },
  termsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
    textAlign: 'center', // Centers the text
  },
  termsContent: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
    textAlign: 'center', // Centers the text
  },
});

export default TermAndConditions;
