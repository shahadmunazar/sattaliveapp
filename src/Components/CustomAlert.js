import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Colors from '../Theme/Colors';

const CustomAlert = ({ visible, title, message, type = 'error', onClose, buttonText = 'OK', showCancelButton = false, cancelText = 'Cancel', onConfirm }) => {
  // Select icon and colors based on type (error, success, warning, info)
  let iconName = 'alert-circle';
  let iconColor = Colors.error;
  let bgHighlight = 'rgba(255, 92, 108, 0.1)';

  if (type === 'success') {
    iconName = 'check-circle';
    iconColor = Colors.live;
    bgHighlight = 'rgba(32, 217, 138, 0.1)';
  } else if (type === 'warning') {
    iconName = 'alert-triangle';
    iconColor = Colors.warning;
    bgHighlight = 'rgba(255, 181, 71, 0.1)';
  }

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          
          <View style={[styles.iconContainer, { backgroundColor: bgHighlight }]}>
            <Icon name={iconName} size={48} color={iconColor} />
          </View>
          
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          
          {showCancelButton ? (
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose} activeOpacity={0.8}>
                <Text style={styles.cancelButtonText}>{cancelText}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.confirmButton, { backgroundColor: iconColor }]} onPress={onConfirm || onClose} activeOpacity={0.8}>
                <Text style={styles.buttonText}>{buttonText}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={[styles.button, { backgroundColor: iconColor }]} onPress={onConfirm || onClose} activeOpacity={0.8}>
              <Text style={styles.buttonText}>{buttonText}</Text>
            </TouchableOpacity>
          )}

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  alertBox: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: Colors.primarySurface,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.divider,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: Colors.primaryText,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    color: Colors.secondaryText,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.divider,
    marginRight: 8,
  },
  cancelButtonText: {
    color: Colors.primaryText,
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  buttonText: {
    color: '#121212',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default CustomAlert;
