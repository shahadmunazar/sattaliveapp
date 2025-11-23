import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import CustomDrawer from './CustomDrawer';
import BottomNav from './BottomNav';
// import StatementTabs from '../Screens/Statement/StatementTabs';

const Drawer = createDrawerNavigator();

const HomeDrawer = () => {
  const navigation = useNavigation();

  const navigateToStatement = () => {
    navigation.navigate('BottomNav', {
      screen: 'Statement',
    });
  };

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} navigateToStatement={navigateToStatement} />}
    >
      <Drawer.Screen name="BottomNav" component={BottomNav} options={{ headerShown: false }} />
      {/* <Drawer.Screen name="Statement" component={StatementTabs} options={{ headerShown: false }} /> */}
    </Drawer.Navigator>
  );
};

export default HomeDrawer;
