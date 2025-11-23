// import React, { useEffect, useState, useLayoutEffect } from 'react';
// import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
// import { useRoute, useNavigation } from '@react-navigation/native';
// import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
// import Withdraw from './Statement/Withdraw';
// import AddMoney from './Statement/AddMoney';
// import MyWin from './Statement/MyWin';
// import Statements from './Statement/Statements';
// import PlayGames from './Statement/PlayGames';

// const TABS = [
//   { key: 'One', label: 'STATEMENT', component: Statements, icon: 'document-text' },
//   { key: 'Two', label: 'PLAY GAME', component: PlayGames, icon: 'play-circle' },
//   { key: 'Three', label: 'ADD MONEY', component: AddMoney, icon: 'add-circle' },
//   { key: 'Four', label: 'WITHDRAW', component: Withdraw, icon: 'remove-circle' },
//   { key: 'Five', label: 'MY WIN', component: MyWin, icon: 'trophy' },
// ];

// const GamingScreen = ({ navigation }) => {
//   const route = useRoute();
//   const { initialTab } = route.params || {};
//   const [selectedTab, setSelectedTab] = useState(initialTab || 'One');

//   useEffect(() => {
//     if (initialTab && TABS.some(tab => tab.key === initialTab)) {
//       setSelectedTab(initialTab);
//     }
//   }, [initialTab]);

//   useLayoutEffect(() => {
//     // Update the bottom tab navigator's title and icon based on the selected tab
//     const tab = TABS.find(t => t.key === selectedTab);
//     if (tab) {
//       navigation.setOptions({
//         title: tab.label,
//         tabBarIcon: ({ color, size }) => (
//           <Ionicons name={tab.icon} size={size} color={color} />
//         ),
//       });
//     }
//   }, [selectedTab, navigation]);

//   const handleTabChange = (tabKey) => {
//     setSelectedTab(tabKey);
//   };

//   const renderSelectedTabComponent = () => {
//     const tab = TABS.find(t => t.key === selectedTab);
//     if (tab) {
//       const TabComponent = tab.component;
//       return <TabComponent />;
//     }
//     return null;
//   };

//   return (
//     <View >
//       <FlatList
//         data={TABS}
//         horizontal
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={[styles.tab, selectedTab === item.key && styles.selectedTab]}
//             onPress={() => handleTabChange(item.key)}
//           >
//             <Text style={[styles.tabLabel, selectedTab === item.key && styles.selectedTabLabel]}>
//               {item.label}
//             </Text>
//           </TouchableOpacity>
//         )}
//         keyExtractor={item => item.key}
//         contentContainerStyle={styles.tabContainer}
//       />
//       <ScrollView >
//         {renderSelectedTabComponent()}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   tabContainer: {
//     borderBottomWidth: 1,
//     borderBottomColor: 'green',
//   },
//   tab: {
//     padding: 10,
//     marginHorizontal: 5,
//   },
//   selectedTab: {
//     borderBottomWidth: 2,
//     borderBottomColor: 'green',
//   },
//   tabLabel: {
//     fontSize: 16,
//     color: "#000"
//   },
//   selectedTabLabel: {
//     fontWeight: 'bold',
//     color: 'green'
//   },
// });

// export default GamingScreen;
import React, { useEffect, useState, useLayoutEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
import Withdraw from './Statement/Withdraw';
import AddMoney from './Statement/AddMoney';
import MyWin from './Statement/MyWin';
import Statements from './Statement/Statements';
import PlayGames from './Statement/PlayGames';

const TABS = [
  { key: 'One', label: 'STATEMENT', component: Statements, icon: 'document-text' },
  { key: 'Two', label: 'PLAY GAME', component: PlayGames, icon: 'play-circle' },
  { key: 'Three', label: 'ADD MONEY', component: AddMoney, icon: 'add-circle' },
  { key: 'Four', label: 'WITHDRAW', component: Withdraw, icon: 'remove-circle' },
  { key: 'Five', label: 'MY WIN', component: MyWin, icon: 'trophy' },
];

const GamingScreen = ({ navigation }) => {
  const route = useRoute();
  const { initialTab } = route.params || {};
  const [selectedTab, setSelectedTab] = useState(initialTab || 'One');
  const scrollViewRef = useRef(null);
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    if (initialTab && TABS.some(tab => tab.key === initialTab)) {
      setSelectedTab(initialTab);
      const index = TABS.findIndex(tab => tab.key === initialTab);
      scrollViewRef.current?.scrollTo({ x: index * screenWidth, animated: false });
    }
  }, [initialTab]);

  useLayoutEffect(() => {
    const tab = TABS.find(t => t.key === selectedTab);
    if (tab) {
      navigation.setOptions({
        title: tab.label,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={tab.icon} size={size} color={color} />
        ),
      });
    }
  }, [selectedTab, navigation]);

  const handleTabChange = (tabKey) => {
    const index = TABS.findIndex(tab => tab.key === tabKey);
    setSelectedTab(tabKey);
    scrollViewRef.current?.scrollTo({ x: index * screenWidth, animated: true });
  };

  const handleScrollEnd = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const selectedTabIndex = Math.round(contentOffsetX / screenWidth);
    setSelectedTab(TABS[selectedTabIndex].key);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={TABS}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.tab, selectedTab === item.key && styles.selectedTab]}
            onPress={() => handleTabChange(item.key)}
          >
            <Text style={[styles.tabLabel, selectedTab === item.key && styles.selectedTabLabel]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.key}
        contentContainerStyle={styles.tabContainer}
      />
      <ScrollView
        horizontal
        pagingEnabled
        ref={scrollViewRef}
        onMomentumScrollEnd={handleScrollEnd}
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView} // Applied style here
      >
        {TABS.map(tab => {
          const TabComponent = tab.component;
          return (
            <View key={tab.key} style={{ width: screenWidth }}>
              <TabComponent />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'green',
  },
  tab: {
    padding: 10,
    marginHorizontal: 5,
  },
  selectedTab: {
    borderBottomWidth: 2,
    borderBottomColor: 'green',
  },
  tabLabel: {
    fontSize: 16,
    color: '#000',
  },
  selectedTabLabel: {
    fontWeight: 'bold',
    color: 'green',
  },
  scrollView: {
    // flex: -0, // Make sure the ScrollView takes up the remaining space
    marginTop:-530
  },
});

export default GamingScreen;


