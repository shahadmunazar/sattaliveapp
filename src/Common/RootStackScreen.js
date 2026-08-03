import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeNew from '../Screens/HomeNew';
import GamingScreen from '../Screens/GamingScreen';
import PlayGame from '../Screens/PlayGame/PlayGame';
import Wallet from '../Screens/Wallet/Wallet';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Example icon library

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeNew" component={HomeNew} />
  </Stack.Navigator>
);
const PlayStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PlayGame" component={PlayGame} />
  </Stack.Navigator>
);

const WalletStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="WalletScreen" component={Wallet} />
  </Stack.Navigator>
);

const GamingStack = ({ navigation }) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="GamingScreen">
      {(props) => <GamingScreen {...props} navigation={navigation} />}
    </Stack.Screen>
  </Stack.Navigator>
);

const RootStackScreen = () => {
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = 'home'; // Name of the icon for Home
              break;
            case 'Play':
              iconName = 'play-circle'; // Name of the icon for Play
              break;
            case 'Wallet':
              iconName = 'wallet'; // Name of the icon for Wallet
              break;
            case 'Gaming':
              iconName = 'game-controller'; // Name of the icon for Gaming
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FFD700',
        tabBarInactiveTintColor: '#A0A0A0',
        tabBarStyle: {
          backgroundColor: '#1E1E2C',
          borderTopWidth: 1,
          borderTopColor: '#333344',
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: false, // This hides the header for all screens in the tab navigator
      })}
    >
      <Tab.Screen
        name="Home"
        children={HomeStack}
        options={{
          title: 'HOME',
        }}
      />
      <Tab.Screen
        name="Play"
        component={PlayStack}
        options={{ title: 'PLAY GAME' }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletStack}
        options={{ title: 'WALLET' }}
      />
      <Tab.Screen
        name="Gaming"
        component={GamingStack}
        options={({ route }) => ({
          title: route.params?.tabName || 'STATEMENT', // Default title
        })}
      />
    </Tab.Navigator>
  );
};

export default RootStackScreen;
