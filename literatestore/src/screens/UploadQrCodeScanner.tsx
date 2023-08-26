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

const UploadQrCodeScanner = () => {
  const navigation = useNavigation()

  const onSuccess = async (e: any) => {
    const qrData = _.get(e, 'data', '')
    const currentUserId = auth().currentUser?.uid
    const document = fireStore().collection('QR').doc(currentUserId)
    const documents = await document.get()
    const collectionRef = fireStore().collection('QR')

    // checking the qr data exists or not
    collectionRef
      .where(qrData, '==', qrData)
      .get()
      .then(async (querySnapshot) => {
        if (querySnapshot.empty) {
          await document
            .set({
              ...documents.data(),
              [qrData]: qrData,
            })
            .then((res) => {
              Toast.show({
                type: 'success',
                text1: 'Successfully updated the qr data',
              })
              navigation.goBack()
            })
            .catch((err) => {
              Toast.show({ type: 'error', text1: 'Failed to read the qr data' })
            })
        } else {
          Toast.show({ type: 'error', text1: 'Qr code already exists' })
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
      reactivateTimeout={3000}
      topContent={
        <Text style={styles.centerText}>
          Scan <Text style={styles.textBold}>QR_code</Text>
          To update the user
        </Text>
      }
    />
  )
}

export default UploadQrCodeScanner
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
