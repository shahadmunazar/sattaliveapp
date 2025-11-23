import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../Login/SplashScreen';
import LoginScreen from '../Login/LoginScreen';
import RegisterScreen from '../Login/RegisterScreen';
import DrawerNavigator from './DrawerNavigator';
import PlayGameAdd from '../Screens/PlayGame/PlayGameAdd';
import Haruf from '../Screens/PlayGame/Haruf';
import Crossing from '../Screens/PlayGame/Crossing';
import Jayantri from '../Screens/PlayGame/Jayantri';
import AddMoneyScreen from '../Screens/Wallet/AddMoneyScreen';
import WithdrawMoneyScreen from '../Screens/Wallet/WithdrawMoneyScreen';
import TermAndConditions from './TermAndConditions';

const Stack = createStackNavigator();

const MainAppNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
            <Stack.Screen name="Home" component={DrawerNavigator}   options={{ headerShown: false, title: 'Add Game' }}/>
            <Stack.Screen name="PlayGameAdd" component={PlayGameAdd}    options={{ headerShown: true, title: 'Add Game' }}/>
            <Stack.Screen name="Haruf" component={Haruf}    options={{ headerShown: true, title: 'Haruf' }}/>
            <Stack.Screen name="Crossing" component={Crossing}    options={{ headerShown: true, title: 'Crossing' }}/>
            <Stack.Screen name="Jayantri" component={Jayantri}    options={{ headerShown: true, title: 'Jantri' }}/>
            <Stack.Screen name="AddMoney" component={AddMoneyScreen}    options={{ headerShown: true, title: 'AddMoneyScreen' }}/>
            <Stack.Screen name="WithdrawMoney" component={WithdrawMoneyScreen}    options={{ headerShown: true, title: 'WithdrawMoneyScreen' }}/>
            <Stack.Screen name="TermAndConditions" component={TermAndConditions}    options={{ headerShown: true, title: 'Term And Conditions' }}/>
        </Stack.Navigator>
    );
};

export default MainAppNavigator;
