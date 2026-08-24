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
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons'; 
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
  
  const flatListRef = useRef(null);

  useEffect(() => {
    if (initialTab && TABS.some(tab => tab.key === initialTab)) {
      setSelectedTab(initialTab);
      const index = TABS.findIndex(tab => tab.key === initialTab);
      flatListRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
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
    setSelectedTab(tabKey);
    const index = TABS.findIndex(tab => tab.key === tabKey);
    flatListRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
  };

  const renderSelectedTabComponent = () => {
    const tab = TABS.find(t => t.key === selectedTab);
    if (tab) {
      const TabComponent = tab.component;
      return <TabComponent />;
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <View>
        <FlatList
          ref={flatListRef}
          data={TABS}
          horizontal
          showsHorizontalScrollIndicator={false}
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
      </View>
      <View style={styles.contentContainer}>
        {renderSelectedTabComponent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  tabContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#333344',
  },
  tab: {
    padding: 14,
    marginHorizontal: 4,
  },
  selectedTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FFD700',
  },
  tabLabel: {
    fontSize: 14,
    color: '#A0A0A0',
  },
  selectedTabLabel: {
    fontWeight: 'bold',
    color: '#FFD700',
  },
  contentContainer: {
    flex: 1,
  },
});

export default GamingScreen;


