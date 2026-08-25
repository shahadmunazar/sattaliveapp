import { BASE_URL } from '../Config/env';
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Animated, TouchableOpacity, Linking, RefreshControl, BackHandler, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LoginUser } from '../Redux/Reducers/AuthSlice';
import { useSelector, useDispatch } from 'react-redux';
import Colors from '../Theme/Colors';
import CustomAlert from '../Components/CustomAlert';
import DeviceInfo from 'react-native-device-info';

const HomeNew = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [data, setData] = useState([]);
  const [dataContent, setDataContent] = useState([]);
  const [optenData, setOptenData] = useState({});
  const [loading, setLoading] = useState(true);
  const [exitModalVisible, setExitModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [updateDetails, setUpdateDetails] = useState(null);

  const dispatch = useDispatch();
  const blinkAnimation = useState(new Animated.Value(1))[0];

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
      fetchContent();
      fetchUpdateSettings();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        setExitModalVisible(true);
        return true;
      };
      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
      return () => backHandler.remove();
    }, [])
  );

  const fetchData = async () => {
    const token = await AsyncStorage.getItem('userToken');
    try {
      if (!refreshing) setLoading(true);
      const response = await fetch(`${BASE_URL}/user/numbers-history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const result = await response.json();
      setData(result.data.results || []);
      setOptenData(result.data.category || {});
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchContent = async () => {
    const token = await AsyncStorage.getItem('userToken');
    try {
      if (!refreshing) setLoading(true);
      const response = await fetch(`${BASE_URL}/user/home-content`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const result = await response.json();
      setDataContent(result?.data || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const compareVersions = (v1, v2) => {
    const v1Parts = v1.split('.').map(Number);
    const v2Parts = v2.split('.').map(Number);
    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
      const p1 = v1Parts[i] || 0;
      const p2 = v2Parts[i] || 0;
      if (p1 > p2) return 1;
      if (p1 < p2) return -1;
    }
    return 0;
  };

  const fetchUpdateSettings = async () => {
    try {
      const response = await fetch(`${BASE_URL}/app-settings`);
      const result = await response.json();
      if (result && result.data && result.data.app_version) {
        const serverVersion = result.data.app_version.trim();
        const localVersion = (DeviceInfo.getVersion() || '0.0.1').trim();
        // Only show update modal if server version is strictly greater than local version
        if (compareVersions(serverVersion, localVersion) > 0) {
          setUpdateDetails({
            url: result.data.update_url,
            force: result.data.force_update === true || result.data.force_update === 1 || result.data.force_update === '1'
          });
          setUpdateModalVisible(true);
        }
      }
    } catch (e) {
      console.error('Failed to fetch update settings', e);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
    fetchContent();
    dispatch(LoginUser());
  };

  const handleHelp = () => {
    const phoneNumber = '9643859339';
    const message = 'Help needed';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  };

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnimation, { toValue: 0.3, duration: 600, useNativeDriver: true }),
        Animated.timing(blinkAnimation, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  }, [blinkAnimation]);

  const renderItem = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={[styles.cell, styles.cellGameName]}>{item.category_name || 'N/A'}</Text>
      <Text style={styles.cell}>{item.yesterday_number || '0'}</Text>
      <View style={styles.cellDivider} />
      <Text style={[styles.cell, styles.cellToday]}>{item.today_number || '0'}</Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={styles.loadingText}>Loading Live Results...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFD700" />}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Live Card */}
        <View style={styles.liveCard}>
          <View style={styles.liveBadgeContainer}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE NOW</Text>
          </View>
          <Text style={styles.heading}>{optenData?.name || 'AWAITING RESULT'}</Text>
          <Animated.Text style={[styles.number, { opacity: blinkAnimation }]}>
            {optenData?.now_open_number || '--'}
          </Animated.Text>
          <View style={styles.timeContainer}>
            <Icon name="clock-o" size={14} color="#A0A0A0" style={{ marginRight: 6 }} />
            <Text style={styles.time}>{optenData?.open_time || '00:00'}</Text>
          </View>
        </View>

        {/* Announcements Card */}
        {dataContent && dataContent.length > 0 && (
          <View style={styles.announcementCard}>
            <Icon name="bullhorn" size={20} color={Colors.error} style={styles.announcementIcon} />
            <View style={styles.announcementContent}>
              {dataContent.map((item, i) => (
                <Text key={i} style={styles.announcementText}>
                  {i + 1}. {item.content_name}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Result Chart */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Icon name="bar-chart" size={20} color="#121212" style={{ marginRight: 8 }} />
            <Text style={styles.chartTitle}>RESULT CHART</Text>
          </View>
          
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableHeaderText, { flex: 1.2, textAlign: 'left', paddingLeft: 16 }]}>Game Name</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Yesterday</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Today</Text>
          </View>

          <View style={styles.tableBody}>
            {data.map((item, index) => (
              <React.Fragment key={index.toString()}>
                {renderItem({ item })}
              </React.Fragment>
            ))}
          </View>
        </View>
        
        {/* Bottom padding for FAB */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Help FAB */}
      <TouchableOpacity style={styles.fab} onPress={handleHelp} activeOpacity={0.8}>
        <Icon name="whatsapp" size={28} color="#121212" />
      </TouchableOpacity>

      <CustomAlert
        visible={exitModalVisible}
        title="Exit App"
        message="Are you sure you want to exit the application?"
        type="warning"
        onClose={() => setExitModalVisible(false)}
        showCancelButton={true}
        cancelText="Cancel"
        buttonText="Exit"
        onConfirm={() => BackHandler.exitApp()}
      />

      <CustomAlert
        visible={updateModalVisible}
        title="Update Available"
        message="A new version of the app is available. Please update to continue."
        type="warning"
        onClose={() => {
          if (updateDetails?.force) {
            BackHandler.exitApp();
          } else {
            setUpdateModalVisible(false);
          }
        }}
        showCancelButton={!updateDetails?.force}
        cancelText="Skip"
        buttonText="Update Now"
        onConfirm={() => {
          if (updateDetails?.url) {
            Linking.openURL(updateDetails.url).catch(err => console.error(err));
          }
          if (!updateDetails?.force) {
            setUpdateModalVisible(false);
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background, // #070A12
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#A0A0A0',
    fontWeight: '600',
  },
  scrollViewContent: {
    padding: 16,
  },
  
  // LIVE CARD
  liveCard: {
    backgroundColor: Colors.primarySurface, // #101522
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333344',
    elevation: 10,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  liveBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(32, 217, 138, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(32, 217, 138, 0.3)',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.live,
    marginRight: 6,
  },
  liveText: {
    color: Colors.live,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  heading: {
    color: '#A0A0A0',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  number: {
    color: '#FFD700',
    fontSize: 84,
    fontWeight: '900',
    textShadowColor: 'rgba(255, 215, 0, 0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
    marginBottom: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondarySurface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
  },
  time: {
    color: '#E0E0E0',
    fontSize: 16,
    fontWeight: '600',
  },

  // ANNOUNCEMENTS
  announcementCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 92, 108, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 92, 108, 0.3)',
    alignItems: 'flex-start',
  },
  announcementIcon: {
    marginTop: 2,
    marginRight: 12,
  },
  announcementContent: {
    flex: 1,
  },
  announcementText: {
    color: Colors.error,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: 4,
  },

  // CHART CARD
  chartCard: {
    backgroundColor: Colors.primarySurface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333344',
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingVertical: 16,
  },
  chartTitle: {
    color: '#121212',
    fontSize: 18,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: Colors.secondarySurface,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#333344',
  },
  tableHeaderText: {
    color: '#A0A0A0',
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  tableBody: {
    paddingBottom: 8,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    color: '#E0E0E0',
    fontSize: 16,
    fontWeight: '600',
  },
  cellGameName: {
    flex: 1.2,
    textAlign: 'left',
    paddingLeft: 16,
    color: '#FFFFFF',
  },
  cellToday: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  cellDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#333344',
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#FFD700',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});

export default HomeNew;
