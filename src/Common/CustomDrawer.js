import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Button, Share, Linking } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomDrawer = () => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const userName = await AsyncStorage.getItem('name');
        const userMobile = await AsyncStorage.getItem('mobile');

        setName(userName);
        setMobile(userMobile);
      } catch (error) {
        console.setMobileerror('Failed to fetch token:', error);
      }
    };

    fetchToken();
  }, []);

  const navigateToGamingScreen = (tabName, initialTab) => {
    navigation.navigate('Gaming', {
      screen: 'Gaming',
      params: { tabName, initialTab },
    });
  };

  const handleShare = async () => {
    try {
      const referralCode = await AsyncStorage.getItem('referral_code'); // Replace with your key for referral code
      const appLink = 'https://download.sattalives.com/SattaLive.apk'; // Replace with your app's actual link
      const message = `Check out this awesome app! Use my REFERRAL CODE: **${referralCode}** to sign up and get 5% rewards! You can download the app by clicking on the link: ${appLink}`;
  
      await Share.share({
        message,
      });
    } catch (error) {
      console.error('Failed to share the app link:', error.message);
    }
  };

  const handleHelp = () => {
    const phoneNumber = '9643859339'; // Replace with the desired phone number
    const message = 'Help needed';
  
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  };
  
  const handleChangePassword = () => {
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!oldPassword || !newPassword || !confirmPassword) {
        Alert.alert('Error', 'All fields are required.');
        return;
      }

      if (newPassword !== confirmPassword) {
        setError("Password did not match")
        Alert.alert('Error', 'New password and confirm password do not match.');
        return;
      }

      const payload = {
        current_password: oldPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      };

      const response = await fetch('https://liveapi.sattalives.com/api/user/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();

        console.log("dfghjkgfhj" , errorData)
        setError(errorData.message)
      Alert.alert('Error', errorData.message);
        throw new Error(errorData.message || 'Password change failed');
      }

      Alert.alert('Success', 'Password changed successfully');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Error', `Failed to change password. ${error.message}`);
      console.error('Password change error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch('https://liveapi.sattalives.com/api/user/user-logout', {
        method: 'POST', // Or 'GET' depending on the API requirement
        headers: {
          'Content-Type': 'application/json',
          // Add any required headers here
          Authorization: `Bearer ${token}`
        },
      });
     
      if (!response.ok) {
        throw new Error('Logout failed');
      }

      // Clear any user data from AsyncStorage
      await AsyncStorage.clear();

      // Navigate to login screen
      navigation.navigate('Login'); // Ensure 'Login' is the correct route name

    } catch (error) {
      Alert.alert('Error', 'Failed to logout. Please try again.');
      console.error('Logout error:', error);
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person" size={20} color="white" />
        <Text style={styles.userName}>{name}</Text>
        <Text style={styles.userMobile}>{mobile}</Text>
      </View>
      <View style={styles.drawerContent}>
        <TouchableOpacity onPress={() => navigation.navigate('HomeNew')}>
          <View style={styles.drawerItem}>
            <Ionicons name="home" size={24} color="green" />
            <Text style={styles.drawerItemText}>Home</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity onPress={() => navigateToGamingScreen('Two', 'Two')}>
          <View style={styles.drawerItem}>
            <Ionicons name="game-controller" size={24} color="green" />
            <Text style={styles.drawerItemText}>My Play History</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity onPress={() => navigateToGamingScreen('Five', 'Five')}>
          <View style={styles.drawerItem}>
            <Ionicons name="wallet" size={24} color="green" />
            <Text style={styles.drawerItemText}>My Winnings</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity onPress={() => navigateToGamingScreen('Three', 'Three')}>
          <View style={styles.drawerItem}>
            <Ionicons name="document-text" size={24} color="green" />
            <Text style={styles.drawerItemText}>Add Money List</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity onPress={() => navigateToGamingScreen('Four', 'Four')}>
          <View style={styles.drawerItem}>
            <Ionicons name="document-text" size={24} color="green" />
            <Text style={styles.drawerItemText}>Withdraw Money List</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity onPress={handleChangePassword}>
          <View style={styles.drawerItem}>
            <Ionicons name="document-text" size={24} color="green" />
            <Text style={styles.drawerItemText}>Change Password</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity onPress={handleShare}>
          <View style={styles.drawerItem}>
            <Ionicons name="share-social" size={24} color="green" />
            <Text style={styles.drawerItemText}>Share & Earn</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity onPress={handleHelp}>
          <View style={styles.drawerItem}>
            <Ionicons name="help-circle" size={24} color="green" />
            <Text style={styles.drawerItemText}>Help</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity onPress={() => navigation.navigate('TermAndConditions')}>
          <View style={styles.drawerItem}>
            <Ionicons name="lock-closed" size={24} color="green" />
            <Text style={styles.drawerItemText}>Terms & Conditions</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity onPress={handleLogout}>
          <View style={styles.drawerItem}>
            <Ionicons name="log-out" size={24} color="green" />
            <Text style={styles.drawerItemText}>Logout</Text>
          </View>
        </TouchableOpacity>
      </View>

    
      {/* Change Password Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Old Password"
                placeholderTextColor="gray"
                value={oldPassword}
                onChangeText={setOldPassword}
                secureTextEntry={!oldPasswordVisible}
              />
              <TouchableOpacity onPress={() => setOldPasswordVisible(!oldPasswordVisible)}>
                <Ionicons name={oldPasswordVisible ? 'eye' : 'eye-off'} size={24} color="gray" />
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="New Password"
                placeholderTextColor="gray"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!newPasswordVisible}
              />
              <TouchableOpacity onPress={() => setNewPasswordVisible(!newPasswordVisible)}>
                <Ionicons name={newPasswordVisible ? 'eye' : 'eye-off'} size={24} color="gray" />
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Confirm New Password"
                placeholderTextColor="gray"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!confirmPasswordVisible}
              />
              <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                <Ionicons name={confirmPasswordVisible ? 'eye' : 'eye-off'} size={24} color="gray" />
              </TouchableOpacity>
            </View>
            <Text style={{color:"red"}}>{error}</Text>
            <View style={styles.modalButtons}>
              <Button title="Submit" onPress={handleSubmit} />
              <Button title="Close" onPress={() => setModalVisible(false)} color="red" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: 'green',
    alignItems: 'center',
    paddingVertical: 5,
    marginBottom: 20,
  },
  userName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  userMobile: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
  },
  drawerContent: {
    marginTop: 10,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 0.3,
    borderColor: 'gray',
  },
  drawerItemText: {
    fontSize: 18,
    marginLeft: 10,
    color: "#000"
  },
  separator: {
    height: 1,
    backgroundColor: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
    color:"#000"
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
    paddingHorizontal: 10,
    color:"#000"
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default CustomDrawer;
