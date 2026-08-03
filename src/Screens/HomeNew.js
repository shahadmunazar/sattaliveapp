
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, ActivityIndicator, Animated, TouchableOpacity, Share, Linking, RefreshControl ,BackHandler,Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect  } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LoginUser } from '../Redux/Reducers/AuthSlice';
import { useSelector,useDispatch } from 'react-redux';

const HomeNew = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [data, setData] = useState([]);
  const [dataContent, setDataContent] = useState([]);
  const [optenData, setOptenData] = useState({});
  const [loading, setLoading] = useState(true); // Loading state
  const [refreshing, setRefreshing] = useState(false); // Refreshing state

  const dispatch = useDispatch();
  // Animation setup
  const blinkAnimation = useState(new Animated.Value(1))[0];

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString();
      setCurrentTime(formattedTime);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
      fetchContent();
    }, [])
  );

  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        'Exit App',
        'Are you sure you want to exit?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Yes', onPress: () => BackHandler.exitApp() },
        ],
        { cancelable: true }
      );
      return true; // Prevents default behavior (exiting immediately).
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    // Cleanup the event listener on unmount
    return () => backHandler.remove();
  }, []);
  
  const fetchData = async () => {
    const token = await AsyncStorage.getItem('userToken');
    try {
      if (!refreshing) {
        setLoading(true); // Start loading only if not refreshing
      }
      const response = await fetch('https://liveapi.sattalives.com/api/user/numbers-history', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setData(result.data.results || []); // Adjust based on actual API response structure
      setOptenData(result.data.category || {}); // Adjust based on actual API response structure
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false); // End loading
      setRefreshing(false); // End refreshing
    }
  };

  const fetchContent = async () => {
    const token = await AsyncStorage.getItem('userToken');
    try {
      if (!refreshing) {
        setLoading(true); // Start loading only if not refreshing
      }
      const response = await fetch('https://liveapi.sattalives.com/api/user/home-content', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      // console.log("balnace aya ki nhi " , result);

      setDataContent(result?.data || []); // Adjust based on actual API response structure
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false); // End loading
      setRefreshing(false); // End refreshing
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
    fetchContent();
    dispatch(LoginUser());
  };

  const handleHelp = () => {
    const phoneNumber = '9643859339'; // Replace with the desired phone number
    const message = 'Help needed';

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  };

  useEffect(() => {
    // Set up blinking animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnimation, {
          toValue: 0.5,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [blinkAnimation]);

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.category_name || 'N/A'}</Text>
      <Text style={styles.cell}>{item.yesterday_number || '0'}</Text>
      <Text style={styles.cell}>{item.today_number || '0'}</Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.card}>
          <Text style={styles.heading}>{optenData?.name}</Text>
          <Animated.Text
            style={[
              styles.number,
              {
                opacity: blinkAnimation,
              },
            ]}
          >
            {optenData?.now_open_number}
          </Animated.Text>
          <Text style={styles.time}>{optenData?.open_time}</Text>
        </View>
        <View style={styles.card2}>
          <Text style={styles.heading2}>
            {dataContent?.map((item, i) => (
              <Text key={i}>{i + 1} - {item.content_name} </Text>
            ))}
          </Text>
        </View>
        <View style={styles.card3}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Result Chart's</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Game Name</Text>
            <Text style={styles.tableHeaderText}>Yesterday</Text>
            <Text style={styles.tableHeaderText}>Today</Text>
          </View>
          <View style={styles.list}>
            {data.map((item, index) => (
              <React.Fragment key={index.toString()}>
                {renderItem({ item })}
              </React.Fragment>
            ))}
          </View>
        </View>
      </ScrollView>
      {/* Help Icon */}
      <TouchableOpacity style={styles.helpIconContainer} onPress={handleHelp}>
        <Icon name="question-circle" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: "#121212"
  },
  helpIconContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FFD700', // Gold color for premium look
    borderRadius: 50,
    padding: 12,
    elevation: 5,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  card: {
    backgroundColor: '#1E1E2C',
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFD700',
    alignItems: 'center',
    width: '90%',
    margin: '3%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  card2: {
    backgroundColor: '#1E1E2C',
    padding: 15,
    borderRadius: 16,
    width: '90%',
    margin: '3%',
    borderWidth: 1,
    borderColor: '#333344',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  heading: {
    color: '#A0A0A0',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  number: {
    color: '#FFD700',
    fontSize: 72,
    fontWeight: '900',
    marginBottom: 10,
  },
  time: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
  heading2: {
    color: '#FF4C4C',
    fontSize: 17,
    fontWeight: '500',
    lineHeight: 24,
    marginBottom: 5,
  },
  card3: {
    backgroundColor: '#1E1E2C',
    padding: 0,
    borderRadius: 16,
    width: '90%',
    margin: '3%',
    borderWidth: 1,
    borderColor: '#333344',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  headerContainer: {
    backgroundColor: '#FFD700',
    padding: 15,
  },
  header: {
    textAlign: 'center',
    color: '#121212',
    fontSize: 18,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#333344',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#121212',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333344',
  },
  tableHeaderText: {
    flex: 1,
    color: '#FFD700',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    marginTop: 0,
    color:"#FFF"
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#333344',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    color: "#E0E0E0",
    fontSize: 14,
    padding: 2
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
  },
});


export default HomeNew;
