import React from 'react'
import {
  StyleSheet,
  Text,
} from 'react-native'
import fireStore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { Toast } from 'react-native-toast-message/lib/src/Toast'
import { useNavigation, useRoute } from '@react-navigation/native'
import _ from 'lodash'
import { useAppDispatch } from '../redux/hooks'
import { modalActions } from '../redux/slices/modalSlice'

const SearchQrCodeScanner = () => {
  const navigation:ScreenNavigationProp = useNavigation()
  const dispatch = useAppDispatch()

  const onSuccess = async (e: any) => {
    const qrData = _.get(e, 'data', '')
    const currentUserId = auth().currentUser?.uid
    const document = fireStore().collection('QR').doc(currentUserId)
    const collectionRef = fireStore().collection('QR')

    // checking the qr data exists or not
    collectionRef
      .where(qrData, '==', qrData)
      .get()
      .then(async (querySnapshot) => {
        if (querySnapshot.empty) {
          Toast.show({
            type: 'error',
            text1: 'No user exists with this qr code',
          })
        } else {
          collectionRef
            .where(qrData, '==', qrData)
            .get()
            .then((querySnapshot) => {
              if (querySnapshot.empty) {
                Toast.show({
                  type: 'error',
                  text1: 'No documents found with the specified field value.',
                })
              } else {
                // Toast.show({ type: "success", text1: "successfully fetched" })
                querySnapshot.forEach((doc) => {
                 navigation.navigate('Tabs', {
                    screen: 'Profile',
                    params: {
                      screen: 'SeeProfile',
                      params: {
                        userId: doc.id
                      },
                    },
                  })
                })
              }
            })
            .catch((error) => {
              console.error('Error getting documents:', error)
            })
        }
      })
      .catch((error) => {
        console.error('Error getting documents:', error)
      })
  }

  return (
    <QRCodeScanner
      onRead={onSuccess}
      vibrate={true}
      reactivate
      reactivateTimeout={1000}
      topContent={
        <Text style={styles.centerText}>
          Scan <Text style={styles.textBold}>QR_code</Text>
          To get the user details
        </Text>
      }
    />
  )
}

export default SearchQrCodeScanner

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
})
