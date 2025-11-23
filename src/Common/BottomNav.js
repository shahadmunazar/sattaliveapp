
import React,{useState} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View,StyleSheet,TouchableOpacity,Text, Modal,Pressable  } from 'react-native';

const Tab = createBottomTabNavigator();

function BottomNav() {
  const navigation = useNavigation();
  const route = useRoute();

  let initialRouteName = 'Home'; // Default initial route name

  // Check if the route params contain initialRouteName from the drawer navigation
  if (route.params?.initialRouteName) {
    initialRouteName = route.params.initialRouteName;
  }

  const screenOptions = ({ route }) => ({
    tabBarIcon: ({ color, size, focused }) => {
      let iconName;
      let iconColor = focused ? 'green' : 'gray'; // Change icon color based on focus

      if (route.name === 'Home') {
        iconName = 'home';
      } else if (route.name === 'PlayGame') {
        iconName = 'play';
      } else if (route.name === 'Wallet') {
        iconName = 'wallet';
      } else if (route.name === 'Statement') {
        iconName = 'book';
      }

      return <Ionicons name={iconName} size={size} color={iconColor} />;
    },
    headerShown: true,
    headerLeft: () => (
      <Ionicons
        name="menu"
        size={30}
        color="green"
        style={{ marginLeft: 15 }}
        onPress={() => navigation.toggleDrawer()}
      />
    ),
    tabBarLabelStyle: { fontSize: 12 },
    tabBarActiveTintColor: 'green',
    tabBarInactiveTintColor: 'gray',
    tabBarShowLabel: true,
    tabBarStyle: {
      borderTopWidth: 0,
    },
    headerTitleStyle: {
      color: 'green', 
      alignSelf: 'center', 
    },
    headerTitleAlign: 'center', 
  });


  const [activeText, setActiveText] = useState(null);
  const [modalopen, setModalOpen] = useState(false);

  const handlePress = (text) => {
    setActiveText(text);
  };

  return (
    
    <View style={styles.container}>
       <Modal
      visible={modalopen}
      transparent
      animationType="slide"
      onRequestClose={() =>{
        setModalOpen(false)
      }}
      
    >
      <Pressable  style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flex:1,}} onPress={() =>{
        setModalOpen(false)
      }}>
      <View style={{
       backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flex:1,

      }}>

        <View style={{width:"70%", height:"100%", backgroundColor:"#fff"}}>
        <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person" size={20} color="white" />
        <Text style={styles.userName}>John Doe</Text>
        <Text style={styles.userMobile}>+1234567890</Text>
      </View>

      <View style={styles.drawerContent}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <View style={styles.drawerItem}>
            <Ionicons name="home" size={24} color="green" />
            <Text style={styles.drawerItemText}>Home</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />

        <TouchableOpacity onPress={() => navigation.navigate('Statement', { initialRouteName: 'PlayGames' })}>
          <View style={styles.drawerItem}>
            <Ionicons name="game-controller" size={24} color="green" />
            <Text style={styles.drawerItemText}>My Play History</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />

        <TouchableOpacity onPress={() => navigation.navigate('Wallet')}>
          <View style={styles.drawerItem}>
            <Ionicons name="wallet" size={24} color="green" />
            <Text style={styles.drawerItemText}>My Winnings</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />

        <TouchableOpacity onPress={() => navigation.navigate('Statement', { initialRouteName: 'AddMoney' })}>
          <View style={styles.drawerItem}>
            <Ionicons name="document-text" size={24} color="green" />
            <Text style={styles.drawerItemText}>Add Money List</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />

        <TouchableOpacity onPress={() => navigation.navigate('Statement', { initialRouteName: 'Withdraw' })}>
          <View style={styles.drawerItem}>
            <Ionicons name="document-text" size={24} color="green" />
            <Text style={styles.drawerItemText}>Withdraw Money List</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />

        <TouchableOpacity onPress={() => navigation.navigate('Statement', { initialRouteName: 'Statements' })}>
          <View style={styles.drawerItem}>
            <Ionicons name="document-text" size={24} color="green" />
            <Text style={styles.drawerItemText}>Change Password</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />

        <TouchableOpacity onPress={() => {}}>
          <View style={styles.drawerItem}>
            <Ionicons name="share-social" size={24} color="green" />
            <Text style={styles.drawerItemText}>Share & Earn</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />

        <TouchableOpacity onPress={() => {}}>
          <View style={styles.drawerItem}>
            <Ionicons name="lock-closed" size={24} color="green" />
            <Text style={styles.drawerItemText}>Terms & Conditions</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />

        <TouchableOpacity onPress={() => {}}>
          <View style={styles.drawerItem}>
            <Ionicons name="help-circle" size={24} color="green" />
            <Text style={styles.drawerItemText}>Help</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />

        <TouchableOpacity onPress={() => {}}>
          <View style={styles.drawerItem}>
            <Ionicons name="log-out" size={24} color="green" />
            <Text style={styles.drawerItemText}>Logout</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>

        </View>

      </View>
      </Pressable>
    </Modal>
    <TouchableOpacity onPress={() =>{
      setModalOpen(true)
    }}>
      <Text style={{color:"red", fontWeight:"800",marginLeft:20, marginTop:30,}}>menu</Text>
      </TouchableOpacity>
      <View style={styles.bottomContainer}>
      
    <TouchableOpacity onPress={() => handlePress('Home')}>
      <Text style={[styles.text, activeText === 'Home' && styles.activeText]}>Home</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => handlePress('PlayGame')}>
      <Text style={[styles.text, activeText === 'PlayGame' && styles.activeText]}>PlayGame</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => handlePress('Wallet')}>
      <Text style={[styles.text, activeText === 'Wallet' && styles.activeText]}>Wallet</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => {
      handlePress('Statement')
      navigation.navigate('Statement')
    }}>
      <Text style={[styles.text, activeText === 'Statement' && styles.activeText]}>Statement</Text>
    </TouchableOpacity>
    </View>
  </View>
 
 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomContainer: {
    flex:1,
    justifyContent: 'flex-end', // Aligns children to the bottom of the screen
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    position:"absolute",
    width:"90%",
    bottom:10,
  },
  text: {
    fontSize: 16,
  },
  activeText: {
    color: 'blue', // Change to your desired active color
  },
  header: {
    backgroundColor: 'green',
    alignItems: 'center',
    paddingVertical: 5,
    marginBottom: 20,
  },
  userName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  userMobile: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
  },
  drawerContent: {
    marginTop: 10,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 0.3,
    borderColor: 'gray',
  },
  drawerItemText: {
    fontSize: 18,
    marginLeft: 10,
  },
  separator: {
    height: 1,
    backgroundColor: 'white',
  },

});

export default BottomNav;


