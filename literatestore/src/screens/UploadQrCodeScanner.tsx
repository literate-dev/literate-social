import React from 'react'
import { StyleSheet, Text, Dimensions,View } from 'react-native'
import fireStore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { Toast } from 'react-native-toast-message/lib/src/Toast'
import { useNavigation, useRoute } from '@react-navigation/native'
import _ from 'lodash'
import { useAppDispatch } from '../redux/hooks'

const { width } = Dimensions.get('window')
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
      showMarker
      markerStyle={{ borderColor: 'white', borderStyle: 'dashed' }}
      reactivate
      reactivateTimeout={3000}
      topContent={
        <Text style={styles.centerText}>
          Scan <Text style={styles.textBold}>QR_code </Text>
          To update the user
        </Text>
      }
      bottomContent={
        <View style={styles.bottomTextContainer}>
          <Text style={styles.bottomText}>
            <Text style={styles.note}>Note: </Text> Scan QR code information will save in our records. Please wait...
          </Text>
        </View>
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
  note: {
   fontWeight:'bold',

  },
  bottomText: {
    color: 'black',
    width: width * 0.6,
    textAlign:'center'
  },
  bottomTextContainer: {
    flexDirection:'row',
    justifyContent:'center',
  }
})
