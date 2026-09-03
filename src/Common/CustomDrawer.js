import { BASE_URL } from '../Config/env';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Share, Linking, ScrollView, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../Theme/Colors';

const CustomDrawer = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userName = await AsyncStorage.getItem('name');
        const userMobile = await AsyncStorage.getItem('mobile');
        setName(userName);
        setMobile(userMobile);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const navigateToGamingScreen = (tabName, initialTab) => {
    navigation.navigate('Gaming', {
      screen: 'GamingScreen',
      params: { tabName, initialTab },
    });
  };

  const handleShare = async () => {
    try {
      const referralCode = await AsyncStorage.getItem('referral_code');
      const appLink = 'https://download.sattalives.com/SattaLive.apk';
      const message = `Check out this awesome app! Use my REFERRAL CODE: **${referralCode}** to sign up and get 5% rewards! You can download the app by clicking on the link: ${appLink}`;
  
      await Share.share({ message });
    } catch (error) {
      console.error('Failed to share the app link:', error.message);
    }
  };

  const handleHelp = () => {
    const phoneNumber = '9643859339';
    const message = 'Help needed';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  };

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${BASE_URL}/user/user-logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
      });
     
      if (!response.ok) {
        throw new Error('Logout failed');
      }

      await AsyncStorage.clear();
      navigation.navigate('RegisterScreen');
    } catch (error) {
      Alert.alert('Error', 'Failed to logout. Please try again.');
      console.error('Logout error:', error);
    }
  };

  const DrawerItem = ({ icon, label, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.drawerItem}>
      <View style={styles.drawerItemLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={22} color={Colors.gold} />
        </View>
        <Text style={styles.drawerItemText}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={Colors.secondaryText} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={40} color={Colors.background} />
        </View>
        <Text style={styles.userName}>{name || 'Satta User'}</Text>
        <Text style={styles.userMobile}>{mobile || '+91 0000000000'}</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.drawerContent} showsVerticalScrollIndicator={false}>
        <DrawerItem icon="home" label="Home" onPress={() => navigation.navigate('HomeNew')} />
        <DrawerItem icon="person-circle" label="My Profile" onPress={() => navigation.navigate('ProfileScreen')} />
        <DrawerItem icon="game-controller" label="My Play History" onPress={() => navigateToGamingScreen('Two', 'Two')} />
        <DrawerItem icon="wallet" label="My Winnings" onPress={() => navigateToGamingScreen('Five', 'Five')} />
        <DrawerItem icon="cash" label="Add Money List" onPress={() => navigateToGamingScreen('Three', 'Three')} />
        <DrawerItem icon="card" label="Withdraw Money List" onPress={() => navigateToGamingScreen('Four', 'Four')} />
        <DrawerItem icon="share-social" label="Share & Earn" onPress={handleShare} />
        <DrawerItem icon="help-circle" label="Help" onPress={handleHelp} />
        <DrawerItem icon="lock-closed" label="Terms & Conditions" onPress={() => navigation.navigate('TermAndConditions')} />
        
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out" size={22} color={Colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primarySurface,
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 20,
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: Colors.background,
  },
  userName: {
    color: Colors.primaryText,
    fontSize: 22,
    fontWeight: 'bold',
  },
  userMobile: {
    color: Colors.secondaryText,
    fontSize: 14,
    marginTop: 4,
    fontWeight: '600',
  },
  drawerContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: Colors.primarySurface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  drawerItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  drawerItemText: {
    fontSize: 16,
    color: Colors.primaryText,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginTop: 20,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
  },
  logoutText: {
    fontSize: 16,
    color: Colors.error,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default CustomDrawer;
