import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  Linking,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from '../constants/colors'
import Protected from '../routes/Protected'
import auth from '@react-native-firebase/auth'
import fireStore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore'
import { Toast } from 'react-native-toast-message/lib/src/Toast'
import { useNavigation, useIsFocused, useRoute } from '@react-navigation/native'
import { errors } from '../constants/errors'
import _ from 'lodash'
import Feather from 'react-native-vector-icons/Feather'
import facebook from '../assets/facebook.png'
import instagram from '../assets/instagram.png'
import twitter from '../assets/twitter.png'
import website from '../assets/website.png'
import Loading from '../../src/components/Loading'
import { useAppSelector } from '../../src/redux/hooks'

const { height, width } = Dimensions.get('window')

const Profile = () => {
  const route = useRoute()
  const logoutLoading = useAppSelector((state) => state.auth.logoutLoading)
  const paramsUserId = _.get(route, 'params.userId')
  const [userDetails, setUserDetails] =
    useState<FirebaseFirestoreTypes.DocumentData>()
  const navigation: ScreenNavigationProp = useNavigation()
  const isFocused = useIsFocused()
  const getUserDetails = async () => {
    try {
      const userId = paramsUserId ? paramsUserId : auth().currentUser?.uid

      if (userId) {
        const document = fireStore().collection('Users').doc(userId)
        const docData = await document.get()
        const data = docData.data()
        if (data) {
          setUserDetails(data)
        }
      }
    } catch (err) {
      Toast.show({ type: 'error', text1: errors.UNABLE_TO_GET_USER_DETAILS })
    }
  }

  useEffect(() => {
    getUserDetails()
  }, [isFocused])

  const handleNavigateToUpdateProfile = () => {
    navigation.navigate('UpdateProfile')
  }

  return (
    <Protected>
      {logoutLoading ? (
        <View style={styles.container}>
          <Loading />
        </View>
      ) : (
        <View style={styles.container}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.editContainer}
            onPress={handleNavigateToUpdateProfile}
          >
            <Feather name="edit" style={styles.editIcon} color={colors.black} />
          </TouchableOpacity>
          <View style={styles.wrapperProfile}>
            <ImageBackground
              source={
                _.get(userDetails, 'coverPhoto', '')
                  ? { uri: _.get(userDetails, 'coverPhoto', '') }
                  : require('../assets/sampleBackgroundImage.jpg')
              }
              style={styles.coverImageBackground}
            />
            <View style={styles.profileImageContainer}>
              <View style={styles.profileImage}>
                {_.get(userDetails, 'photo', '') ? (
                  <Image
                    style={styles.profileImageData}
                    source={{ uri: _.get(userDetails, 'photo', '') }}
                  />
                ) : null}
              </View>
            </View>
            <View style={styles.userDetails}>
              <View style={styles.infoContent}>
                <Text style={{ ...styles.name, ...styles.textWhite }}>
                  {_.get(userDetails, 'name', '')}
                </Text>
                <Text style={{ ...styles.email, ...styles.textWhite }}>
                  {_.get(userDetails, 'email', '')}
                </Text>
              </View>
              <View style={styles.iconContainer}>
                {_.get(userDetails, 'facebook') ? (
                  <TouchableOpacity
                    style={styles.imageIcon}
                    onPress={() =>
                      Linking.openURL(_.get(userDetails, 'facebook'))
                    }
                  >
                    <Image source={facebook} style={styles.imagePngIcon} />
                  </TouchableOpacity>
                ) : null}
                {_.get(userDetails, 'twitter') ? (
                  <TouchableOpacity
                    style={styles.imageIcon}
                    onPress={() =>
                      Linking.openURL(_.get(userDetails, 'twitter'))
                    }
                  >
                    <Image source={twitter} style={styles.imagePngIcon} />
                  </TouchableOpacity>
                ) : null}
                {_.get(userDetails, 'instagram') ? (
                  <TouchableOpacity
                    style={styles.imageIcon}
                    onPress={() =>
                      Linking.openURL(_.get(userDetails, 'instagram'))
                    }
                  >
                    <Image source={instagram} style={styles.imagePngIcon} />
                  </TouchableOpacity>
                ) : null}
                {_.get(userDetails, 'website') ? (
                  <TouchableOpacity
                    style={styles.imageIcon}
                    onPress={() =>
                      Linking.openURL(_.get(userDetails, 'website'))
                    }
                  >
                    <Image source={website} style={styles.imagePngIcon} />
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          </View>
        </View>
      )}
    </Protected>
  )
}

export default Profile

const styles = StyleSheet.create({
  text: {
    color: colors.black,
  },
  container: {
    flex: 1,
    backgroundColor: colors.black1,
  },
  wrapperProfile: {
    flex: 0.5,
    position: 'relative',
  },
  coverImageBackground: {
    flex: 1,
    backgroundColor: colors.white,
  },
  userDetails: {
    flex: 1,
    backgroundColor: colors.black1,
  },
  profileImageContainer: {
    height: height * 0.14,
    position: 'absolute',
    zIndex: 12,
    top: '40%',
    left: width * 0.35,
  },
  profileImage: {
    width: height * 0.14,
    height: height * 0.14,
    borderRadius: height * 0.07,
    borderWidth: 1,
    borderColor: colors.white,
    backgroundColor: colors.black,
  },
  profileImageData: {
    width: height * 0.14,
    height: height * 0.14,
    borderRadius: height * 0.07,
    borderWidth: 1,
    borderColor: colors.white,
    resizeMode: 'cover',
  },
  editIcon: {
    backgroundColor: colors.white,
    fontSize: 28,
    borderRadius: 24,
    padding: 10,
  },
  textWhite: {
    color: colors.white,
  },
  name: {
    textAlign: 'center',
    fontSize: 28,
  },
  email: {
    textAlign: 'center',
    fontSize: 14,
  },
  infoContent: {
    marginTop: height * 0.1,
  },
  logoutText: {
    color: colors.red,
    textAlign: 'center',
    paddingTop: height * 0.05,
    fontWeight: 'bold',
  },
  logoutContainer: {
    width: width * 0.3,
    alignSelf: 'center',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 30,
  },
  scanQrContainer: {
    marginVertical: height * 0.05,
    backgroundColor: colors.black2,
    borderWidth: 1,
    borderColor: colors.white1,
    borderRadius: 10,
    width: 'auto',
    padding: 10,
    alignSelf: 'center',
  },
  scanQrText: {
    color: colors.white,
    fontSize: 12,
    paddingTop: 8,
  },
  qrIcon: {
    color: colors.white,
    fontSize: 27,
    alignSelf: 'center',
  },
  qrContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  editContainer: {
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
  imagePngIcon: {
    height: 28,
    width: 28,
  },
  imageIcon: {
    height: 28,
    width: 28,
    margin: 10,
  },
  iconContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
  },
})
