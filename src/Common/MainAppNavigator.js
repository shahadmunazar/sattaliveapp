import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
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
            screenOptions={{ 
                headerShown: false,
                headerStyle: { backgroundColor: '#121212', elevation: 0, shadowOpacity: 0, borderBottomWidth: 1, borderBottomColor: '#333344' },
                headerTintColor: '#FFD700',
                headerTitleStyle: { fontWeight: 'bold' }
            }}
        >
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
            <Stack.Screen name="Home" component={DrawerNavigator}   options={{ headerShown: false, title: 'Add Game' }}/>
            <Stack.Screen name="PlayGameAdd" component={PlayGameAdd} options={({ navigation }) => ({ headerShown: true, title: 'Add Game', headerLeft: () => (
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 15, paddingRight: 15 }}>
                        <Icon name="angle-left" size={30} color="#FFD700" />
                    </TouchableOpacity>
                ) })}/>
            <Stack.Screen name="Haruf" component={Haruf} options={({ navigation }) => ({ headerShown: true, title: 'Haruf', headerLeft: () => (
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 15, paddingRight: 15 }}>
                        <Icon name="angle-left" size={30} color="#FFD700" />
                    </TouchableOpacity>
                ) })}/>
            <Stack.Screen name="Crossing" component={Crossing} options={({ navigation }) => ({ headerShown: true, title: 'Crossing', headerLeft: () => (
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 15, paddingRight: 15 }}>
                        <Icon name="angle-left" size={30} color="#FFD700" />
                    </TouchableOpacity>
                ) })}/>
            <Stack.Screen name="Jayantri" component={Jayantri} options={({ navigation }) => ({ headerShown: true, title: 'Jantri', headerLeft: () => (
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 15, paddingRight: 15 }}>
                        <Icon name="angle-left" size={30} color="#FFD700" />
                    </TouchableOpacity>
                ) })}/>
            <Stack.Screen name="AddMoney" component={AddMoneyScreen}    options={{ headerShown: true, title: 'AddMoneyScreen' }}/>
            <Stack.Screen name="WithdrawMoney" component={WithdrawMoneyScreen}    options={{ headerShown: true, title: 'WithdrawMoneyScreen' }}/>
            <Stack.Screen name="TermAndConditions" component={TermAndConditions}    options={{ headerShown: true, title: 'Term And Conditions' }}/>
        </Stack.Navigator>
    );
};

export default MainAppNavigator;
