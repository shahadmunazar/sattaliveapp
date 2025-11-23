// MenuModal.js
import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MenuModal = () => {
  const navigation = useNavigation();

  const navigateToTab = (tabIndex) => {
    navigation.navigate('StatementStack', {
      tabIndex // Pass the tabIndex
    });
  };

  return (
    <View style={styles.container}>
      <Button title="Go to Tab 1" onPress={() => navigateToTab(0)} />
      <Button title="Go to Tab 2" onPress={() => navigateToTab(1)} />
      <Button title="Go to Tab 3" onPress={() => navigateToTab(2)} />
      <Button title="Go to Tab 4" onPress={() => navigateToTab(3)} />
      <Button title="Go to Tab 5" onPress={() => navigateToTab(4)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:"red",
  }
});

export default MenuModal;

