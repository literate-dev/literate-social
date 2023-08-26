import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native'
import auth from '@react-native-firebase/auth'
import { colors } from '../constants/colors'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native'
import TextFieldComponent from '../components/TextFieldComponent'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import _ from 'lodash'
import Toast from 'react-native-toast-message'
import ButtonComponent from '../components/ButtonComponent'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin'
import fireStore from '@react-native-firebase/firestore'
import { REACT_APP_GOOGLE_WEB_CLIENT_ID } from '@env'
import { useAppDispatch, useAppSelector } from '../../src/redux/hooks'
import { authActions } from '../../src/redux/slices/authSlice'
import Loading from '../../src/components/Loading'

const { width, height } = Dimensions.get('window')
const schema = yup
  .object({
    email: yup
      .string()
      .email('Must be valid email')
      .required('Email is required'),
    password: yup
      .string()
      .min(8, 'Minimum 8 digits needed')
      .required('Password is required'),
  })
  .required()

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const dispatch = useAppDispatch()
  const loginLoading = useAppSelector((state) => state.auth.loginLoading)
  const [showPassword, setShowPassword] = useState(false)
  const navigation: ScreenNavigationProp = useNavigation()
  const handlePasswordVisible = () => setShowPassword(!showPassword)
  const handleNavigateToRegister = () => navigation.navigate('Register')

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })
  const onSubmit = async (values: any) => {
    setLoading(true)
    try {
      // Perform login logic here
      const data = await auth().signInWithEmailAndPassword(
        _.get(values, 'email', ''),
        _.get(values, 'password', '')
      )
      if (data.user) {
        AsyncStorage.setItem('user', data.user.uid)
        Toast.show({ type: 'success', text1: 'Login Success' })
        navigation.replace('Tabs')
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: _.get(error, 'code', '').replace('auth/', ''),
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    GoogleSignin.configure({
      // scopes: ['email'], // what API you want to access on behalf of the user, default is email and profile
      webClientId:
        '258675114195-i33d6oj8oda5pofanbbnsjbi1cbrpqjb.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      // offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    })
  }, [])

  const handleGoogleLogin = async () => {
    try {
      dispatch(authActions.loginLoading(true))
      // await GoogleSignin.hasPlayServices();
      // const res = await GoogleSignin.signIn()
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
      // Get the users ID token
      const { idToken } = await GoogleSignin.signIn()

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken)

      // Sign-in the user with the credential
      const response = await auth().signInWithCredential(googleCredential)

      if (response.user) {
        AsyncStorage.setItem('user', response.user.uid)
        const document = fireStore().collection('Users').doc(response.user.uid)
        const docData = await document.get()
        const data = docData.data()
        if (!docData.exists) {
          await document.set({
            name: response.user.displayName,
            email: response.user.email,
            photo: response.user.photoURL,
          })
        }
        Toast.show({ type: 'success', text1: 'Login Success' })
        navigation.replace('Tabs')
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: _.get(err, 'code', ''),
        text2: _.get(err, 'message', ''),
      })
    } finally {
      dispatch(authActions.loginLoading(false))
    }
  }

  const handleSocialLogin = (name: string) => {
    switch (name) {
      case 'google':
        handleGoogleLogin()
        break
      case 'facebook':
        Toast.show({ type: 'info', text1: 'Coming Soon' })
        break
      case 'apple':
        Toast.show({ type: 'info', text1: 'Coming Soon' })
        break

      default:
        break
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      {loginLoading ? (
        <ImageBackground
          blurRadius={6}
          source={{
            uri: 'https://getwallpapers.com/wallpaper/full/c/1/6/6346.jpg',
          }}
          style={styles.container}
        >
          <Loading />
        </ImageBackground>
      ) : (
        <ImageBackground
          blurRadius={6}
          source={{
            uri: 'https://getwallpapers.com/wallpaper/full/c/1/6/6346.jpg',
          }}
          style={styles.container}
        >
          <View style={styles.imageContainer} />
          <View style={styles.loginFormContainer}>
            <Text style={styles.title}>LITERATE</Text>
            <Text style={styles.subTitle}>SOCIAL</Text>
            <View style={styles.formContainerBlur}>
              <View style={styles.formContainer}>
                <View style={styles.inputContainerWrapper}>
                  <TextFieldComponent
                    name="email"
                    placeholder="Email"
                    control={control}
                    style={[
                      {
                        ...styles.inputContainer,
                        ...styles.userNameInput,
                      },
                    ]}
                  />
                  <AntDesign name="mail" style={styles.startIcon} />
                </View>
                {_.get(errors, 'email.message', '') ? (
                  <Text style={styles.errorText}>
                    {_.get(errors, 'email.message', '').toString()}
                  </Text>
                ) : null}
                <View style={styles.inputContainerWrapper}>
                  <TextFieldComponent
                    placeholder="Password"
                    secureTextEntry={showPassword}
                    style={[
                      { ...styles.inputContainer, ...styles.passwordInput },
                    ]}
                    control={control}
                    name="password"
                  />
                  <Feather name="lock" style={styles.startIcon} />
                  {showPassword ? (
                    <Feather
                      name="eye-off"
                      style={styles.endIcon}
                      onPress={handlePasswordVisible}
                    />
                  ) : (
                    <Feather
                      name="eye"
                      style={styles.endIcon}
                      onPress={handlePasswordVisible}
                    />
                  )}
                </View>
                {_.get(errors, 'password.message', '') ? (
                  <Text style={styles.errorText}>
                    {_.get(errors, 'password.message', '').toString()}
                  </Text>
                ) : null}
              </View>
              <TouchableOpacity
                onPress={handleNavigateToRegister}
                disabled={loading}
              >
                <Text style={styles.registerNow}>
                  Register now ? click here
                </Text>
              </TouchableOpacity>
            </View>
            <ButtonComponent
              text="Login"
              loading={loading}
              onPress={handleSubmit(onSubmit)}
            />

            <View style={styles.continueWithContainer}>
              <View style={styles.line} />
              <Text style={styles.continueWithText}>Or continue with</Text>
              <View style={styles.line} />
            </View>
            <View style={styles.socialIconsContainer}>
              {[
                {
                  icon: (
                    <Image
                      source={require('../assets/googleIcon.png')}
                      style={[
                        {
                          ...styles.socialIcons,
                          height: 30,
                          width: 30,
                          marginTop: 10,
                        },
                      ]}
                    />
                  ),
                  name: 'google',
                },
                {
                  icon: (
                    <Image
                      source={require('../assets/ios.png')}
                      style={[{ ...styles.socialIcons, height: 40, width: 40 }]}
                    />
                  ),
                  name: 'apple',
                },
                {
                  icon: (
                    <Image
                      source={require('../assets/facebook.png')}
                      style={styles.socialIcons}
                    />
                  ),
                  name: 'facebook',
                },
              ].map((each, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => handleSocialLogin(each.name)}
                >
                  {each.icon}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ImageBackground>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  imageContainer: {
    flex: 1,
  },
  loginFormContainer: {
    flex: 3,
    // backgroundColor: 'rgba(0,0,0,0.4)',
  },
  title: {
    fontWeight: 'bold',
    color: colors.white,
    fontSize: 44,
    paddingBottom: 5,
    textAlign: 'center',
  },
  subTitle: {
    color: colors.white,
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 20,
    fontWeight: 'bold',
  },
  formContainerBlur: {
    width: width * 0.8,
    alignSelf: 'center',
    marginTop: 20,
  },
  formContainer: {
    borderWidth: 1,
    borderColor: colors.white,
    width: width * 0.8,
    paddingBottom: 0,
    padding: 5,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  inputContainer: {
    color: colors.white,
    height: 50,
    backgroundColor: 'transparent',
    marginBottom: 5,
    borderWidth: 0,
    shadowColor: 'transparent',
    marginLeft: 25,
  },
  userNameInput: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  passwordInput: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  inputContainerWrapper: {
    position: 'relative',
  },
  startIcon: {
    position: 'absolute',
    left: 0,
    top: '26%',
    fontSize: 20,
    color: colors.white,
  },
  endIcon: {
    position: 'absolute',
    right: 10,
    top: '26%',
    fontSize: 20,
    color: colors.white,
  },
  loginButton: {
    width: width * 0.8,
    alignSelf: 'center',
    backgroundColor: colors.pink,
    marginTop: height * 0.1,
    height: height * 0.05,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.white1,
    justifyContent: 'center',
  },
  loginButtonText: {
    color: colors.white,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
  },
  registerNow: {
    color: colors.white,
    textAlign: 'right',
  },
  continueWithContainer: {
    marginTop: height * 0.1,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  line: {
    width: width * 0.3,
    height: 1,
    backgroundColor: colors.white,
  },
  continueWithText: {
    color: colors.white,
    paddingHorizontal: 10,
  },
  socialIconsContainer: {
    marginTop: height * 0.06,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  socialIcon: {
    fontSize: 29,
    color: colors.white,
  },
  errorText: {
    color: colors.red,
    marginLeft: 15,
    marginBottom: 5,
  },
  socialIcons: {
    height: 35,
    width: 35,
  },
})

export default Login
