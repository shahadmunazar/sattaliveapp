
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useRoute } from '@react-navigation/native';

const TopTab = createMaterialTopTabNavigator();

const TabScreen = ({ name }) => (
  <View style={styles.tabContainer}>
    <Text>{name}</Text>
  </View>
);

const StatementTabs = ({ initialTabIndex = 0 }) => {
  const route = useRoute();
  const { tabIndex } = route.params || { tabIndex: initialTabIndex };

  return (
    <TopTab.Navigator initialRouteName={`Tab${tabIndex + 1}`}>
      <TopTab.Screen name="Tab1" component={() => <TabScreen name="Tab 1" />} />
      <TopTab.Screen name="Tab2" component={() => <TabScreen name="Tab 2" />} />
      <TopTab.Screen name="Tab3" component={() => <TabScreen name="Tab 3" />} />
      <TopTab.Screen name="Tab4" component={() => <TabScreen name="Tab 4" />} />
      <TopTab.Screen name="Tab5" component={() => <TabScreen name="Tab 5" />} />
    </TopTab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default StatementTabs;
