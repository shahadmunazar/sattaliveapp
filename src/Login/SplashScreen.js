
import {StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const SplashScreen = () => {
  const navigation = useNavigation();
  // useEffect(() => {
  //   // Navigate to the login screen after a delay (e.g., 3 seconds)
  //   const timer = setTimeout(() => {
  //     navigation.navigate('Login');
  //   }, 3000);

  //   return () => clearTimeout(timer);
  // }, []);
  const saveddata = async() =>{
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      setTimeout(() => {
         navigation.navigate('Home');
      }, 2000);
    } else {
      setTimeout(() => {
        navigation.navigate('Login');
      }, 2000);
    }
  }

  useEffect(()=>{
    saveddata();
  },[])

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.touchableContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../assests/splash_logo.png')}
            resizeMode="contain"
            style={styles.image}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Set the background color if needed
  },
  touchableContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('100%'),
    height: hp('100%'),
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('100%'),
    height: hp('100%'),
  },
  image: {
    width: wp('80%'), // Adjust the width as needed
    height: hp('80%'), // Adjust the height as needed
  },
});

export default SplashScreen;
