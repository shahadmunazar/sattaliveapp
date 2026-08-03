
import {StyleSheet, View, Image, TouchableOpacity, ImageBackground} from 'react-native';
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
    <ImageBackground 
      source={require('../assests/premium_bg.png')} 
      style={styles.container}
    >
      <TouchableOpacity
        style={styles.touchableContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../assests/main_logo.png')}
            resizeMode="contain"
            style={styles.image}
          />
        </View>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    width: wp('60%'),
    height: wp('60%'),
  },
});

export default SplashScreen;
