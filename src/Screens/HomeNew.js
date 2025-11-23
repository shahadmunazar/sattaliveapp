
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
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            style={styles.list}
          />
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
    paddingVertical: 0,
    backgroundColor: "#fff"
  },
  helpIconContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#25D366', // WhatsApp green color
    borderRadius: 50,
    padding: 10,
    elevation: 5,
  },
  card: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    width: '90%',
    margin: '3%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  card2: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    width: '90%',
    margin: '3%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  heading: {
    color: 'white',
    fontSize: 26,
    marginBottom: 10,
  },
  number: {
    color: 'white',
    fontSize: 60,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  time: {
    color: 'white',
    fontSize: 18,
  },
  heading2: {
    color: 'red',
    fontSize: 19,
    fontWeight: '400',
    marginBottom: 10,
  },
  card3: {
    backgroundColor: 'white',
    padding: 0,
    borderRadius: 10,
    width: '90%',
    margin: '3%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  headerContainer: {
    backgroundColor: 'green',
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    padding: 10,
  },
  header: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
  },
  separator: {
    height: .5,
    backgroundColor: 'white',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: 'green',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
  tableHeaderText: {
    flex: 1,
    color: 'white',
    textAlign: 'center',
    fontSize: 18
  },
  list: {
    marginTop: 10,
    color:"black"
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    color:"black",
    padding:2
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
