// import {StyleSheet} from 'react-native';
import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Login from './src/screens/Login'
import Register from './src/screens/Register'
import Toast from 'react-native-toast-message'
import Profile from './src/screens/Profile'
import auth from '@react-native-firebase/auth'
import { Provider } from 'react-redux'
import { store } from './src/redux/store'
import ModalComponent from './src/components/modals/ModalComponent'
import UpdateProfile from './src/screens/UpdateProfile'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import SearchQrCodeScanner from './src/screens/SearchQrCodeScanner'
import UploadQrCodeScanner from './src/screens/UploadQrCodeScanner'
import { colors } from './src/constants/colors'
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons'
import SeeProfile from './src/screens/SeeProfile'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { useAppDispatch } from './src/redux/hooks'
import { authActions } from './src/redux/slices/authSlice'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Stack = createStackNavigator()
const Tab = createMaterialTopTabNavigator();

// const Tab = createBottomTabNavigator()

const { height, width } = Dimensions.get('window')

const Header = ({
  title,
  showLogout,
  onClickOnLogout,
}: {
  title: string
  showLogout?: boolean
  onClickOnLogout?: () => void
}) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>{title}</Text>
      {showLogout ? (
        <TouchableOpacity onPress={onClickOnLogout}>
          <Text style={styles.logoutBtn}>Logout</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  )
}

const ProfileNavigations = () => {
  const dispatch = useAppDispatch()
  const onClickOnLogout = async (navigation: any) => {
    dispatch(authActions.logoutLoading(true))
    const navigateOnSuccessLogout = () => {
      Toast.show({ type: 'success', text1: 'Successfully Logged Out' })
      navigation.replace('Login')
    }
    const user = auth().currentUser?.providerData[0].providerId
    await auth()
      .signOut()
      .then(async () => {
        if (user === 'google.com') {
          await GoogleSignin.signOut()
            .then((res) => {
              navigateOnSuccessLogout()
            })
            .catch((err) => {
              Toast.show({ type: 'error', text1: 'Failed to logout' })
            }).finally(() => {
              dispatch(authActions.logoutLoading(false))
            })
        } else {
          dispatch(authActions.logoutLoading(false))
          navigateOnSuccessLogout()
        }
      })
      .catch((error) => {
        console.log(error)
        Toast.show({ type: 'error', text1: 'Failed to Logout' })
      })
  }

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="View"
        component={Profile}
        options={{
          header: ({ navigation }) => (
            <Header
              title="Profile"
              showLogout={true}
              onClickOnLogout={() => onClickOnLogout(navigation)}
            />
          ),
        }}
      />
      <Stack.Screen
        name="SeeProfile"
        component={SeeProfile}
        options={{
          header: ({ navigation }) => <Header title="Details" />,
        }}
      />
      <Stack.Screen
        name="UpdateProfile"
        component={UpdateProfile}
        options={{
          header: ({ navigation }) => (
            <Header title="Update Profile" showLogout={false} />
          ),
        }}
      />
    </Stack.Navigator>
  )
}

const BottomTabs = () => {
  return (
    <Tab.Navigator
      tabBarPosition='bottom'
      screenOptions={({ route, navigation }) => ({
        tabBarStyle: { backgroundColor: colors.black1 },
        tabBarShowLabel: false,
        tabBarIndicatorStyle: {
          backgroundColor:'white'
        },
        tabBarActiveTintColor: colors.white,
        tabBarIcon: ({ focused, color, size }) => {
          //  return <Text>{route.name}</Text>
          switch (route.name) {
            case 'Profile':
              return (
                <MaterialCommunity
                  name={'account-circle'}
                  color={focused ? colors.white : colors.white1}
                  size={25}
                />
              )
            case 'SearchWithQrCodeScanner':
              return (
                <MaterialCommunity
                  name={'qrcode-scan'}
                  color={focused ? colors.white : colors.white1}
                  size={25}
                />
              )
            case 'UploadQrCodeScanner':
              return (
                <MaterialCommunity
                  name={'qrcode'}
                  color={focused ? colors.white : colors.white1}
                  size={25}
                />
              )
            default:
              break
          }
        },
      })}
    >
      <Tab.Screen
        name="Profile"
        component={ProfileNavigations}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="SearchWithQrCodeScanner"
        component={SearchQrCodeScanner}
        options={{ header: () => <Header title="Search Qr" /> }}
      />
      <Tab.Screen
        name="UploadQrCodeScanner"
        component={UploadQrCodeScanner}
        options={{ header: () => <Header title="Upload Qr" /> }}
      />
    </Tab.Navigator>
  )
}

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Tabs">
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Tabs"
            component={BottomTabs}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
        <Toast />
        <ModalComponent />
      </NavigationContainer>
    </Provider>
  )
}

export default App

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    height: height * 0.06,
    paddingHorizontal: 10,
    backgroundColor: colors.black1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },
  bottomIconContainer: {
    borderWidth: 1,
    backgroundColor: colors.white,
  },
  logoutBtn: {
    fontSize: 15,
    color: colors.red,
  },
})
