// import React, { useEffect, useState ,useCallback} from 'react';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import CustomDrawer from './CustomDrawer';
// import RootStackScreen from './RootStackScreen';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { View, Text, StyleSheet } from 'react-native';
// import { useFocusEffect } from '@react-navigation/native';

// const Drawer = createDrawerNavigator();

// const HeaderTitle = () => (
//   <View style={styles.headerTitleContainer}>
//     <Text style={styles.headerTitleText}>Satta Live</Text>
//   </View>
// );

// const HeaderRight = ({ balance }) => (
//   <View style={styles.headerRightContainer}>
//     <Text style={styles.headerRightText}>{balance ? balance :0.00}</Text>
//   </View>
// );

// const DrawerNavigator = () => {
//   const [balance, setBalance] = useState(null);
  
//   useFocusEffect(
//     useCallback(() => {
//     const fetchBalance = async () => {
//       try {
//         const token = await AsyncStorage.getItem('userToken'); // Assuming you store the token under 'userToken'
//         if (token) {
//           const response = await fetch('https://liveapi.sattalives.com/api/user/profile', {
//             method: 'GET',
//             headers: {
//               'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
//               'Content-Type': 'application/json',
//             },
//           });

//           if (response.ok) {
//             const data = await response.json();
//             const balanceValue = data?.data?.balance; // Adjust based on the actual structure of the response
//             setBalance(balanceValue);
//           } else {
//             console.error('Failed to fetch balance:', response.statusText);
//           }
//         } else {
//           console.error('No token found');
//         }
//       } catch (error) {
//         console.error('Failed to fetch balance:', error);
//       }
//     };

//     fetchBalance();
//   }, []));

//   return (
//     <Drawer.Navigator drawerContent={(props) => <CustomDrawer {...props} />}>
//       <Drawer.Screen
//         name="Satta Live"
//         component={RootStackScreen}
//         options={{
//           headerTitle: () => <HeaderTitle />,
//           headerRight: () => (
//             balance !== null ? <HeaderRight balance={balance} /> : null
//           ),
//           headerStyle: {
//             backgroundColor: '#fff', // Optional: Customize header background
//           },
//           headerTitleAlign: 'center', // Center the title
//         }}
//       />
//       {/* Add other drawer screens here if needed */}
//     </Drawer.Navigator>
//   );
// };

// const styles = StyleSheet.create({
//   headerTitleContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   headerTitleText: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color:"#000"
//   },
//   headerRightContainer: {
//     paddingRight: 15,
//   },
//   headerRightText: {
//     fontSize: 19,
//     fontWeight: 'bold',
//     color: 'green',
//   },
// });

// export default DrawerNavigator;

import React, { useState, useCallback, useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from './CustomDrawer';
import RootStackScreen from './RootStackScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LoginUser } from '../Redux/Reducers/AuthSlice';
import { useSelector,useDispatch } from 'react-redux';

const Drawer = createDrawerNavigator();

const HeaderTitle = () => (
  <View style={styles.headerTitleContainer}>
    <Text style={styles.headerTitleText}>Satta Live</Text>
  </View>
);

const HeaderRight = ({ balance }) => (
  <View style={styles.headerRightContainer}>
    <Text style={styles.headerRightText}>{balance ? balance : 0.00}</Text>
  </View>
);

const DrawerNavigator = () => {
  const [balance, setBalance] = useState(null);

  const dispatch = useDispatch();

  const {result: resultLoginUser } = useSelector((state) => state.login.LoginUser);  // const fetchBalance = useCallback(async () => {
  //   try {
  //     const token = await AsyncStorage.getItem('userToken'); // Assuming you store the token under 'userToken'
  //     if (token) {
  //       const response = await fetch('https://liveapi.sattalives.com/api/user/profile', {
  //         method: 'GET',
  //         headers: {
  //           'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
  //           'Content-Type': 'application/json',
  //         },
  //       });

  //       if (response.ok) {
  //         const data = await response.json();
  //         const balanceValue = data?.data?.balance; // Adjust based on the actual structure of the response
  //         setBalance(balanceValue);
  //       } else {
  //         console.error('Failed to fetch balance:', response.statusText);
  //       }
  //     } else {
  //       console.error('No token found');
  //     }
  //   } catch (error) {
  //     console.error('Failed to fetch balance:', error);
  //   }
  // }, []);

  console.log("valance22222 " , resultLoginUser?.data?.balance);

  useFocusEffect(
    useCallback(() => {
      // fetchBalance();
      dispatch(LoginUser());
    }, [])
  );

  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawer {...props} />}>
      <Drawer.Screen
        name="Satta Live"
        component={RootStackScreen } 
        options={{
          headerTitle: () => <HeaderTitle />,
          headerRight: () => (
            resultLoginUser?.data?.balance !== null ? <HeaderRight balance={resultLoginUser?.data?.balance} /> : null
          ),
          headerStyle: {
            backgroundColor: '#fff', // Optional: Customize header background
          },
          headerTitleAlign: 'center', // Center the title
        }}
        
      />
      {/* Add other drawer screens here if needed */}
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  headerTitleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: "#000"
  },
  headerRightContainer: {
    paddingRight: 15,
  },
  headerRightText: {
    fontSize: 19,
    fontWeight: 'bold',
    color: 'green',
  },
});

export default DrawerNavigator;
