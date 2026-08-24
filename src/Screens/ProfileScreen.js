import { BASE_URL } from '../Config/env';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../Theme/Colors';
import CustomAlert from '../Components/CustomAlert';

const ProfileScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '', icon: '' });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userName = await AsyncStorage.getItem('name');
        const userMobile = await AsyncStorage.getItem('mobile');
        setName(userName || 'Satta User');
        setMobile(userMobile || '+91 0000000000');
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleAlertClose = () => {
    setAlertConfig(prev => ({ ...prev, visible: false }));
  };

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setAlertConfig({ visible: true, title: 'Error', message: 'All fields are required.', icon: 'alert-circle' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setAlertConfig({ visible: true, title: 'Error', message: 'New password and confirm password do not match.', icon: 'alert-circle' });
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const payload = {
        current_password: oldPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      };

      const response = await fetch(`${BASE_URL}/user/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Password change failed');
      }

      setAlertConfig({ visible: true, title: 'Success', message: 'Password changed successfully!', icon: 'checkmark-circle' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setAlertConfig({ visible: true, title: 'Error', message: error.message, icon: 'alert-circle' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* Header Section */}
        <View style={styles.headerCard}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={50} color={Colors.background} />
          </View>
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.userMobile}>{mobile}</Text>
        </View>

        {/* Change Password Section */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Change Password</Text>
          <Text style={styles.sectionSubtitle}>Ensure your account stays secure</Text>

          {/* Old Password */}
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color={Colors.secondaryText} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Current Password"
              placeholderTextColor={Colors.secondaryText}
              value={oldPassword}
              onChangeText={setOldPassword}
              secureTextEntry={!oldPasswordVisible}
            />
            <TouchableOpacity onPress={() => setOldPasswordVisible(!oldPasswordVisible)} style={styles.eyeIcon}>
              <Ionicons name={oldPasswordVisible ? 'eye-outline' : 'eye-off-outline'} size={20} color={Colors.secondaryText} />
            </TouchableOpacity>
          </View>

          {/* New Password */}
          <View style={styles.inputWrapper}>
            <Ionicons name="key-outline" size={20} color={Colors.secondaryText} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              placeholderTextColor={Colors.secondaryText}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!newPasswordVisible}
            />
            <TouchableOpacity onPress={() => setNewPasswordVisible(!newPasswordVisible)} style={styles.eyeIcon}>
              <Ionicons name={newPasswordVisible ? 'eye-outline' : 'eye-off-outline'} size={20} color={Colors.secondaryText} />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputWrapper}>
            <Ionicons name="shield-checkmark-outline" size={20} color={Colors.secondaryText} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm New Password"
              placeholderTextColor={Colors.secondaryText}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!confirmPasswordVisible}
            />
            <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)} style={styles.eyeIcon}>
              <Ionicons name={confirmPasswordVisible ? 'eye-outline' : 'eye-off-outline'} size={20} color={Colors.secondaryText} />
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={handlePasswordChange}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.background} />
            ) : (
              <>
                <Text style={styles.submitButtonText}>Update Password</Text>
                <Ionicons name="arrow-forward" size={20} color={Colors.background} />
              </>
            )}
          </TouchableOpacity>
        </View>

      </ScrollView>

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        icon={alertConfig.icon}
        onClose={handleAlertClose}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    padding: 20,
    flexGrow: 1,
  },
  headerCard: {
    backgroundColor: Colors.primarySurface,
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: Colors.divider,
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: Colors.background,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 4,
  },
  userMobile: {
    fontSize: 16,
    color: Colors.secondaryText,
    fontWeight: '600',
  },
  formContainer: {
    backgroundColor: Colors.primarySurface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.divider,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: Colors.primaryText,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 8,
  },
  submitButton: {
    backgroundColor: Colors.gold,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 12,
    marginTop: 10,
  },
  submitButtonText: {
    color: Colors.background,
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default ProfileScreen;
