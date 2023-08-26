import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native'
import fireStore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import React, { useEffect, useState } from 'react'
import { colors } from '../../constants/colors'
import _ from 'lodash'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { Toast } from 'react-native-toast-message/lib/src/Toast'
import { useAppDispatch } from '../../redux/hooks'
import { modalActions } from '../../redux/slices/modalSlice'
import { Image } from 'react-native'

const { height, width } = Dimensions.get('window')

const ProfileModal: React.FC<IProfileModal> = ({ details }) => {
    const dispatch = useAppDispatch()
  const navigation:ScreenNavigationProp = useNavigation()
  const [userDetails, setUserDetails] =
    useState<FirebaseFirestoreTypes.DocumentData>()
  const isFocused = useIsFocused()
  const docId = _.get(details, 'documentId', '')
  const currentUser = auth().currentUser?.uid

  const getUserDetails = async () => {
    const document = fireStore().collection('Users').doc(docId)
    const docData = await document.get()
    setUserDetails(docData.data())
  }

  const handleUpdate = () => {
    dispatch(modalActions.hideModal())
    navigation.navigate('UpdateProfile')
  }

  useEffect(() => {
    getUserDetails()
  }, [isFocused])

  return (
    <View style={styles.container}>
      <View style={styles.userCircle}>
        <Image source={{uri:_.get(userDetails,'photo','')}} style={styles.userCircle}/>
      </View>
      <View style={styles.userInfoContainer}>
        <Text style={styles.name}>{_.get(userDetails, 'name')}</Text>
        <Text style={styles.email}>{_.get(userDetails, 'email')}</Text>
      </View>
      {currentUser === docId ? (
        <TouchableOpacity
          style={styles.updateDetailsContainer}
          onPress={handleUpdate}
        >
          <Text style={styles.updateDetailsText}>Update details</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  )
}

export default ProfileModal

const styles = StyleSheet.create({
  container: {
    width: width * 0.6,
  },
  text: { color: colors.black },
  userCircle: {
    height: height * 0.08,
    width: height * 0.08,
    borderRadius: height * 0.04,
    borderWidth: 1,
    borderColor: colors.black,
    alignSelf: 'center',
    backgroundColor: colors.darkred,
  },
  userInfoContainer: {
    marginTop: height * 0.02,
  },
  name: {
    color: colors.black,
    fontWeight: 'bold',
    fontSize: 18,
  },
  email: {
    color: colors.black,
    fontSize: 14,
  },
  updateDetailsContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: colors.black2,
    width: width * 0.4,
    borderRadius: 10,
    marginTop: 10,
  },
  updateDetailsText: {
    color: colors.white,
    textAlign: 'center',
  },
})
