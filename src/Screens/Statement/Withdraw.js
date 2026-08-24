import { BASE_URL } from '../../Config/env';
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import Colors from '../../Theme/Colors';

const Withdraw = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const fetchWithdrawals = async () => {
        try {
          const token = await AsyncStorage.getItem('userToken');
          if (!token) {
            throw new Error('Token not found');
          }

          const response = await fetch(`${BASE_URL}/user/withdrawal-money`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const data = await response.json();
          setWithdrawals(data?.data || []);
        } catch (err) {
          setError('Failed to fetch withdrawal list');
          
        } finally {
          setLoading(false);
        }
      };

      fetchWithdrawals();
    }, [])
  );

  const renderItem = ({ item }) => {
    return (
      <View style={styles.transactionCard}>
        <View style={styles.cardLeft}>
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 92, 108, 0.15)' }]}>
            <Icon name="arrow-up-right" size={20} color={Colors.error} />
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.descriptionText} numberOfLines={1}>
              {item.mobile_no ? `Mobile: ${item.mobile_no}` : 'Bank Transfer'}
            </Text>
            <Text style={styles.dateText}>{item.created_at}</Text>
          </View>
        </View>
        <View style={styles.cardRight}>
          <Text style={styles.amountText}>- ₹ {item.request_money}</Text>
          {item.amount && item.amount !== item.request_money && (
            <Text style={styles.approvedAmount}>Approved: ₹ {item.amount}</Text>
          )}
        </View>
      </View>
    );
  };

  const renderEmptyState = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconCircle}>
          <Icon name="briefcase" size={48} color={Colors.divider} />
        </View>
        <Text style={styles.emptyTitle}>No Withdrawals Yet</Text>
        <Text style={styles.emptySubtitle}>Your withdrawal history will appear here once you make a request.</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  if (error && withdrawals.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Icon name="alert-circle" size={48} color={Colors.error} style={{ marginBottom: 16 }} />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={withdrawals}
        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
    flexGrow: 1,
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.primarySurface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.divider,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  descriptionText: {
    color: Colors.primaryText,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  dateText: {
    color: Colors.secondaryText,
    fontSize: 12,
    fontWeight: '500',
  },
  cardRight: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingLeft: 16,
  },
  amountText: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.error,
  },
  approvedAmount: {
    fontSize: 11,
    color: Colors.secondaryText,
    marginTop: 4,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: 60,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  emptyTitle: {
    color: Colors.primaryText,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: Colors.secondaryText,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  errorText: {
    color: Colors.error,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Withdraw;
