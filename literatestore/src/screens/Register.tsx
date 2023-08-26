import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
// import {BlurView} from '@react-native-community/blur';
import { colors } from '../constants/colors';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import auth from '@react-native-firebase/auth';
import fireStore from '@react-native-firebase/firestore';
import * as yup from 'yup';
import _ from 'lodash';
import TextFieldComponent from '../components/TextFieldComponent';
import ButtonComponent from '../components/ButtonComponent';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

const { width, height } = Dimensions.get('window');

const schema = yup
  .object({
    name: yup.string().required('Name is required'),
    email: yup
      .string()
      .email('Must be valid email')
      .required('Email is required'),
    password: yup
      .string()
      .min(8, 'Minimum 8 digits needed')
      .required('Password is required'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required('Confirm Password is required'),
  })
  .required();

function Register() {
  const navigation: ScreenNavigationProp = useNavigation();
  const [loading, setLoading] = useState(false);
  const handleNavigateToLogin = () => navigation.navigate('Login');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await auth().createUserWithEmailAndPassword(
        _.get(data, 'email', ''),
        _.get(data, 'password'),
      );
      const document = fireStore().collection('Users').doc(response.user.uid);
      await document.set({
        name: _.get(data, 'name', ''),
        email: _.get(data, 'email', ''),
      })
      if (response.user) {
        Toast.show({ type: 'success', text1: 'Successfully registered' });
        navigation.navigate('Login');
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: _.get(error, 'code') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        resizeMode="cover"
        blurRadius={6}
        source={require('../assets/booksShelf.jpg')}
        style={styles.container}>
        <View style={styles.imageContainer} />
        <Text style={styles.title}>Sign Up</Text>
        <View style={styles.loginFormContainer}>
          <View style={styles.formContainerBlur}>
            <View style={styles.formContainer}>
              <View style={styles.inputContainerWrapper}>
                <TextFieldComponent
                  control={control}
                  name="name"
                  placeholder="Name"
                  style={[
                    {
                      ...styles.inputContainer,
                      ...styles.userNameInput,
                    },
                  ]}
                />
              </View>
              {_.get(errors, 'name.message', '') ? (
                <Text style={styles.errorText}>
                  {_.get(errors, 'name.message', '').toString()}
                </Text>
              ) : null}
              <View style={styles.inputContainerWrapper}>
                <TextFieldComponent
                  control={control}
                  name="email"
                  placeholder="Email"
                  style={[
                    {
                      ...styles.inputContainer,
                      ...styles.userNameInput,
                    },
                  ]}
                />
              </View>
              {_.get(errors, 'email.message', '') ? (
                <Text style={styles.errorText}>
                  {_.get(errors, 'email.message', '').toString()}
                </Text>
              ) : null}
              <View style={styles.inputContainerWrapper}>
                <TextFieldComponent
                  control={control}
                  name="password"
                  placeholder="password"
                  style={[
                    {
                      ...styles.inputContainer,
                      ...styles.passwordInput,
                    },
                  ]}
                />
              </View>
              {_.get(errors, 'password.message', '') ? (
                <Text style={styles.errorText}>
                  {_.get(errors, 'password.message', '').toString()}
                </Text>
              ) : null}
              <View style={styles.inputContainerWrapper}>
                <TextFieldComponent
                  control={control}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  style={[
                    {
                      ...styles.inputContainer,
                      ...styles.passwordInput,
                    },
                  ]}
                />
              </View>
              {_.get(errors, 'confirmPassword.message', '') ? (
                <Text style={styles.errorText}>
                  {_.get(errors, 'confirmPassword.message', '').toString()}
                </Text>
              ) : null}
            </View>

            <TouchableOpacity
              onPress={handleNavigateToLogin}
              disabled={loading}>
              <Text style={styles.registerNow}>Login ? click here</Text>
            </TouchableOpacity>
          </View>
          <ButtonComponent
            text="Register"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
          />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
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
    fontSize: 34,
    paddingBottom: 5,
    textAlign: 'center',
  },
  subTitle: {
    color: colors.white,
    textAlign: 'center',
    marginBottom: 20,
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
    position: 'relative',
    marginTop: height * 0.1,
  },
  line: {
    width: width * 0.8,
    height: 1,
    backgroundColor: colors.white,
    alignSelf: 'center',
  },
  continueWithText: {
    color: colors.white,
    backgroundColor: colors.black2,
    zIndex: 19,
    position: 'absolute',
    top: -10,
    paddingHorizontal: 10,
    left: '35%',
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
});

export default Register;
